var axios = require('axios');
var moment = require('moment');

var Account = require('../models/account');
var Transaction = require("../models/transaction");
var isSameOwner = require("../utils/owner.check").isSameOwner;

var view = async (acctno) => {
    var account = await Account.findOne({"acctNumber": acctno});
    return account;
}

var withdraw = async (acctno, amount) => {
    var account = await Account.findOne({"acctNumber": acctno});
    if (account.balance < 100 || account.balance < amount) {
        var operation = "Invalid"
        return operation;
    }
    var transaction = new Transaction({
        trans_type: "withdraw",
        amount: amount,
        target_acct: acctno,
        account: account
    });

    account.balance = account.balance - amount;
    var result = await transaction.save();
    account.transactions.push(result);

    await account.save();
    return account.balance
}

var deposit = async (acctno, amount) => {
    var account = await Account.findOne({"acctNumber": acctno});
    
    var transaction = new Transaction({
        trans_type: "deposit",
        amount: amount,
        target_acct: acctno,
        account: account
    });
    account.balance = account.balance + amount;
    var result = await transaction.save();
    account.transactions.push(result);

    await account.save();
    return account.balance
}

var transfer = async (transfrom, transto, amount) => {
    var status = "unsuccess";
    var today = moment().startOf('day').valueOf();
    var tomorrow = moment(today).add(1, 'days').valueOf();

    var owner = await Account.findOne({"acctNumber": transfrom});
    var target_owner = await Account.findOne({"acctNumber": transto});
    var daily_transrecords = await Transaction.find({"account": owner._id, "trans_type": "transfer", "createdAt":{$gte: today, $lt: tomorrow}});
    var daily_translimit = 0;

    if (!target_owner || target_owner.acctStatus === "close") {
        status = "Invalid_owner";
        return status;        
    }

    if (owner.balance < amount) {
        status = "no_balance";
        return status;        
    }

    for (x in daily_transrecords) {
        var daily_translimit = daily_translimit + daily_transrecords[x].amount;
    }

    if (daily_translimit + amount > 10000) {
        status = "over_limit"
        return status;
    }

    var transaction = new Transaction({
        trans_type: "transfer",
        amount: amount,
        target_acct: transto,
        account: owner
    });

    if (!isSameOwner(owner.identity, target_owner.identity)) {
        var charge = 100;
        var approval = await axios({
            method: 'get',
            url: 'http://handy.travel/test/success.json'
        });
        if (approval.data.status === "success") {
            owner.balance = owner.balance - amount - charge;
        } else {
            return status
        }

    } else { 
        owner.balance = owner.balance - amount;
    }

    target_owner.balance = target_owner.balance + amount;
    var result = await transaction.save();
    owner.transactions.push(result);
    await owner.save();
    await target_owner.save();
    status = "success";

    return status;

}

module.exports = {
    view,
    withdraw,
    deposit,
    transfer
};