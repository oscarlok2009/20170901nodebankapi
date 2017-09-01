var express = require('express');
var router = express.Router();

var Account = require('../models/account');
var gen = require('../utils/acctnumber.generate');
var operation = require("../utils/account.operation");
var isAmountValid = require("../utils/amount.check").isAmountValid;
var isTransAmountValid = require("../utils/amount.check").isTransAmountValid;
var {statuscheck} = require('../middleware/acctstatuscheck');

router.get('/', (req, res, next) => {
    res.status(200).json({
        title: 'This is the account services.'
    });
});

/**
 * Open an account and inserts it into the database.
 * @param {Object} req - req.body must contains "firstName", "lastName", "accountNumber", "identity"
 * @param {Object} res - response appropriate json message
 */
router.post('/', async (req, res, next) => {

    try {
      var acctcount = await Account.find().count();
      var accountNumber = gen.acctgen(acctcount + 1);
      
      var account = new Account({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          acctNumber: accountNumber,
          identity: req.body.identity
      });

      var result = await account.save();
      res.status(201).json({
        message: 'Account created',
        obj: result
      });

    } catch (e) {
      res.status(500).json({
        title: 'An error occurred',
        error: e
      })
    }

});

/**
 * Close an account and update the account status into the database.
 * @param {Number} acctNumber - req.params must contains "acctNumber"
 * @param {Object} req - req.body must contains "status"
 * @param {Object} res - response appropriate json message
 */
router.patch('/:acctNumber', async (req, res, next) => {
  try {
    var account = await Account.findOne({"acctNumber": req.params.acctNumber})
    if (!account) {
      return res.status(500).json({
          title: 'No Account Found!',
          error: {message: 'Account not found'}
      });
    }

    account.acctStatus = req.body.status;
    var result = await account.save();
    res.status(200).json({
        message:'Account closed',
        obj: result
    });

  } catch (e) {
    res.status(500).json({
        title: 'An error occurred',
        error: e
    });
  }
});


/**
 * Account operation (view, deposit, withdraw, transfer)
 * @param {Object} req - req.body must contains "type" and appropriate field depends on the operation type
 * @param {Object} res - response appropriate json message
 */
router.post('/operation', statuscheck, async (req, res, next) => {
  var opera_type = req.body.type;
  try {

    var account = await Account.findOne({"acctNumber": req.body.acctNumber})
    if (!account) {
      return res.status(404).json({
          title: 'No Account Found!',
          error: {message: 'Account not found'}
      });
    }

    switch(opera_type) {

      /**
       * View balance
       * @param {Object} req - req.body must contains "acctNumber"
       * @param {Object} res - response appropriate json message with account balance value
       */
      case "view":
        var result = await operation.view(req.body.acctNumber)
        res.status(200).json({
          message:'View Balance',
          balance: result.balance
        });
        break;

      /**
       * Withdraw money (Only accept amount which must be 100 times)
       * @param {Object} req - req.body must contains "acctNumber", "amount"
       * @param {Object} res - response appropriate json message with withdraw amount and account balance
       */
      case "withdraw":
        if (!isAmountValid(req.body.amount)) {
          return res.status(400).json({
            title: 'Invalid withdraw amount!',
            error: {message: 'Withdraw amount must be 100 times'}
          });  
        }
        var result = await operation.withdraw(req.body.acctNumber, req.body.amount)
        if (result === "Invalid") {
          return res.status(400).json({
            title: 'Invalid operation!',
            error: {message: 'Withdraw amount over than the current balance'}
          });          
        }
        res.status(200).json({
          message:'Withdraw success',
          withdrawAmount: req.body.amount,
          balance: result
        });      
        break;

      /**
       * Deposit money (Only accept amount which must be 100 times)
       * @param {Object} req - req.body must contains "acctNumber", "amount"
       * @param {Object} res - response appropriate json message with deposit amount and the account balance
       */
      case "deposit":
        if (!isAmountValid(req.body.amount)) {
          return res.status(400).json({
            title: 'Invalid deposit amount!',
            error: {message: 'Deposit amount must be 100 times'}
          });  
        }
        var result = await operation.deposit(req.body.acctNumber, req.body.amount);
        res.status(200).json({
          message:'Deposit success',
          depositAmount: req.body.amount,
          balance: result
        });
        break;

      /**
       * Transfer money (The transfer amount must greater than zero and daily transfer limit is $10000 )
       * @param {Object} req - req.body must contains "amount", "acctNumber", "transto"
       * @param {Object} res - response appropriate json message
       */
      case "transfer":
        if (!isTransAmountValid(req.body.amount)) {
          return res.status(400).json({
            title: 'Invalid transfer amount!',
            error: {message: 'Transfer amount must greater than 0'}
          });  
        }

        var result = await operation.transfer(req.body.acctNumber, req.body.transto, req.body.amount);
        if (result === "Invalid_owner") {
          return res.status(404).json({
            title: 'Target transfer account is invalid!',
            status: 'unsuccess'
          });  
        }

        if (result === "no_balance") {
          return res.status(400).json({
            title: 'No enough balance!',
            status: 'unsuccess'
          });  
        }

        if (result === "over_limit") {
          return res.status(400).json({
            title: 'Over Daily transfer limit ($10000)!',
            status: 'unsuccess'
          }); 
        }

        if (result === "unsuccess") {
          return res.status(400).json({
            status: result
          });
        }

        res.status(200).json({
          status: result
        });
        break;

      default:
          return res.status(400).json({
            title: 'Invalid operation type!',
            error: {message: 'The operation type is invalid'}
          });

    }

  } catch (e) {
    res.status(500).json({
        title: 'An error occurred',
        error: e
    });    
  }



});

module.exports = router;
