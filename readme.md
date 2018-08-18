# Proof of Existence Platform
A Dapp allowing users to upload file for the IPFS and associate with their identity on the ethereum blockchain.
This service integrates Uport Authentification. 
A user can also validate the ownership of a document by using the service and finding which adress is linked to which document.

## Requirements
To run this demo locally you will need:
Truffle
Metamask
React


## Setup

* `git clone https://user.id@innersource.accenture.com/scm/et-si-bc/blockchain-academy-ethereum-platform.git`
* `cd blockchain-academy-ethereum-platform/`
* `npm install`
* (Optional) `npm install truffle -g`
  

## Building and the frontend

1. 'truffle develop` to start a test blockchain instance 
2. First run truffle compile, then truffle migrate.
3. Then run `npm run start` to build the app via webpack and serve it on http://localhost:8080

## How to Use
Install and setup an account with Uport.
Login via Uport and you will end up on the dashboard.
On the dashboard you will display all the documents associated with your ID, if ever you already uploaded some.
If that's not the case you can start uploading your first document. 
Once uploaded the page refresh and show your document.
You have a button next to each document to share / send the proof ot the document to someone.
This will send a mail to the users with a link to the platform to validate the adress linked to that document.

You can also verify who else did upload which document. 

## Common Errors