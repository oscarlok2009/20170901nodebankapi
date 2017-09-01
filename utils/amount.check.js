// check amount is number, value must be 100 500 1000

var isAmountValid = (amount) => {
    return (typeof(amount) === "number" && (amount % 100) === 0) ? true : false;
}

var isTransAmountValid = (amount) => {
    return (typeof(amount) === "number" && amount > 0) ? true : false;
}

module.exports = {isAmountValid, isTransAmountValid}