Public Accessible URL
=====================

- Deployed in Heroku URL (Bank API gateway): https://tranquil-crag-38598.herokuapp.com/
    - [Attention]: **First loading time** may be more than 15 seconds (The server need to wake up, because it will sleep when the serives no longer use)

- Open and close account: https://tranquil-crag-38598.herokuapp.com/account

- Account Operation(View Balance, Withdraw, Deposit, Transfer) : https://tranquil-crag-38598.herokuapp.com/account/operation

- Please follow the following API doc to test the program in local server or public url

Setup Project Step
===================================

Build project locally (If test in public URL, skip this part)
-------------------------------------------------------------
- Install the MongoDB(This project is using the latest version 3.4.6) [MongoDB@3.4.6](https://www.mongodb.com/download-center?jmp=homepage#community)
    - Launch the server in your local machine with port **27017**

- Install the latest Version NodeJS (8.4.0) [NodeJS@8.4.0](https://nodejs.org/en/)

- Clone this repo

- Run node command
```
npm install
```

- Start the Node application
```
npm start
```

API doc 
=======

- Please install [Postman](https://www.getpostman.com/) or other api testing tools for your testing

- **Create account**
    - URL: https://tranquil-crag-38598.herokuapp.com/account
    - Request Method: POST
    - Header: Content-Type application/json
    - Required Input body: ["firstName", "lastName", "accountNumber", "identity"]
    - Notice:
        - Account number will auto generated which state in the response json
        - Please copy the account number for further testing 

- Request Body Example:
```
{
"firstName": "Oscar",
"lastName":	"Lok",
"identity": "Y1234567"
}
```

- **Close account**
    - URL: https://tranquil-crag-38598.herokuapp.com/account/(:acctNumber)
    - Request Method: PATCH
    - Request Params: account Number
    - Header: Content-Type application/json
    - Required Input body: ["status"] 
    - Notice:
        - Status only have two options ["open", "close"]

- Request Body Example:
```
{
"status": "close"
}
```

- **View balance**
    - URL: https://tranquil-crag-38598.herokuapp.com/account/operation
    - Request Method: POST
    - Header: Content-Type application/json
    - Required Input body: ["type", "acctNumber"] 
    - Notice:
        - Type is the operation type

- Request Body Example:
```
{
"type": "view",
"acctNumber": "735000000001"
}
```

- **Deposit**
    - URL: https://tranquil-crag-38598.herokuapp.com/account/operation
    - Request Method: POST
    - Header: Content-Type application/json
    - Required Input body: ["type", "acctNumber", "amount"] 
    - Notice:
        - Type is the operation type
        - Amount must be greater than 100 and is 100 multiple

- Request Body Example:
```
{
"type": "deposit",
"acctNumber": "735000000001",
"amount": 100
}
```

- **Withdraw**
    - URL: https://tranquil-crag-38598.herokuapp.com/account/operation
    - Request Method: POST
    - Header: Content-Type application/json
    - Required Input body: ["type", "acctNumber", "amount"] 
    - Notice:
        - Type is the operation type
        - Account status must not be closed, otherwise the transaction will not be accepted
        - Amount must be greater than 100 and is 100 multiple
        - Account balance must be more than or equal to 100, otherwise the transaction will not be accepted

- Request Body Example:
```
{
"type": "withdraw",
"acctNumber": "735000000001",
"amount": 100
}
```

- **Transfer**
    - URL: https://tranquil-crag-38598.herokuapp.com/account/operation
    - Request Method: POST
    - Header: Content-Type application/json
    - Required Input body: ["type", "acctNumber", "transto", "amount"] 
    - Notice:
        - Type is the operation type
        - Account status must not be closed, otherwise the transaction will not be accepted
        - Amount must be greater than 0
        - Account balance must be greater than 0, otherwise the transaction will not be accepted
        - If account over the daily transfer limit ($10000), transaction will not be accepted

- Same Owner Request Body Example:
```
{
"type": "transfer",
"acctNumber": "735000000001",
"transto": "286000000002",
"amount": 100
}
```

- Diff Owner Request Body Example:
```
{
"type": "transfer",
"acctNumber": "735000000001",
"transto": "103000000003",
"amount": 100
}
```