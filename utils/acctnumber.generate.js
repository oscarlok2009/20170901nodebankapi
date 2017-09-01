var rn = require('random-number');

var gen = rn.generator ({
    min:  100, 
    max:  999, 
    integer: true
});

var acctgen = (acctcount) => {
    var userlimit = 1000000000;
    var acctNumber = gen() * userlimit + acctcount;

    return acctNumber;
}

module.exports = {acctgen};