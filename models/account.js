var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true        
    },
    acctNumber: {
        type: Number,
        required: true,
        unique: true
    },
    identity: {
        type: String,
        maxlength: 8,
        minlength: 8,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    acctStatus: {
        type: String,
        enum: ['open', 'close'],
        default: 'open'
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
});

// schema.index({identity: 1, acctNumber: 1}, { unique : true });
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Account', schema);