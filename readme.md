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

* `git clone https://github.com/paochocom/PoE.git`
* `cd PoE/`
* `npm install`
* (Optional) `npm install truffle -g`
  

## Building and the frontend

1. 'truffle develop` to start a test blockchain instance 
2. First run truffle compile, then truffle migrate. If ever you have an error when migrating, delete the 'build' folder and relaunch migration.
3. Open a new terminal. Then run `npm run start` to build the app via webpack and serve it on http://localhost:3000

## How to Use
Install and setup an account with Uport. It will be necessary for login.
Login via Uport and you will end up on your dashboard.

1. The Dashboard
It contains the list of all the proof you already uploaded to IPFS, and a form for submitting your proof of existence.
Once uploaded the page refresh and show your document.

2. Verify a proof
This is the interface where you can validate the link between a proof and a user. By entering the hash of a document, it will show you which address is linked to that document

3. Tag Search engine
This is the interface where you can browse on all the proof submited by tag. You can search for a specific tag and the results will display.

## Common Errors