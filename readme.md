# Proof of Existence Platform
A Dapp allowing users to upload file on the IPFS and associate with their identity on the ethereum blockchain.
A user can also verify the ownership of a document by using the service and finding which adress is linked to which document and when it was uploaded.
This service integrates Uport Authentification. 

## Requirements
To run this demo locally you will need:
-> Truffle
-> Metamask
-> React for frontEnd


## Setup

* `git clone https://github.com/paochocom/PoE.git`
* `cd PoE/`
* `npm install`
* (Optional) `npm install truffle -g`
(if React not installed)
* sudo apt-get install nodejs npm  
* npm init -y
* npm install webpack --save
* npm install webpack-dev-server --save
* npm install react --save

## Building and the frontend

1. 'truffle develop` to start a test blockchain instance 
2. First run truffle compile, then truffle migrate. If ever you have an error when migrating, delete the 'build' folder and relaunch migration.
3. Open a new terminal. Then run `npm run start` to build the app via webpack and serve it on http://localhost:3000

## How to Use
Install Uport on your phone. It will be necessary for login.
When you arrive on the homepage, click on Login with Uport and you'll be prompted a QRcode. Open your Uport App on your phone, scan the code and you'll be logged in and redirected to the Dashboard.

1. The Dashboard
It contains the list of all the proof you already uploaded to IPFS, and a form for submitting new proofs.
Clicking on adding a proof you can choose an image to add. You can add a tag if you want to this image
Once uploaded the page refresh and show your document. (carefull there'll be 2 metamask confirmation. 1 for adding the prood / 1 for adding the tag))
On top of every proof, you have a link for adding a tag.

2. Verify a proof
This is the interface where you can validate the link between a proof and a user. By entering the hash of a document, it will show you which address is linked to which document and when the document was uploaded.

3. Tag Search engine
This is the interface where you can browse on all the proof submited by tag. You can search for a specific tag and the results will display with the corresponding hash.

## Troubleshooting
In case the migration doesn't work. Make sure to delete the build directory and to migrate again. It can cause problem whenever there is already a build folder present.
In some machines, Metamask would reject every transaction when connected to ganache-cli.
If that's the case, you can comment line 6 and uncomment line 8 from truffle.js. 
Then run 'truffle develop' and it should work fine.  