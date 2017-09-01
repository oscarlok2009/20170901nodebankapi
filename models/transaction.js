var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var schema = new Schema({
    trans_type: {
        type: String,
        enum: ['withdraw', 'deposit', 'transfer', 'charge'],
        required: true
    },
    amount: {
        type: Number,
        required: true        
    },
    target_acct: {
        type: Number,
        required: true
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    createdAt: {
        type: Number,
        default: moment.valueOf()
    }
});

module.exports = mongoose.model('Transaction', schema);