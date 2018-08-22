# Avoiding Common Attacks

## Logic bugs & Recursion

### Logic bugs

I wrote 5 tests Truffle framework. 
Some in Javascript some in solidity
Can be found at  `../truffle/test/`

### Reentrancy calls 

When the contract's functions call an external function, it is : 

* either a function that is implemented within the contract. 
* avoiding the usage of call.value to send instead.  
* or functions external to the contracts : 
  * `selfdestruct()` to destruct the contract


### Timestamp Dependence
TimeStamp is being recorded but called directly from the front end to avoid any possible manipulation on blockchain level.. 

## Integer Arithmetic Overflow
There is no possibility for a user to overflow.
Only arithmetic operation done is an addition to count the number of proof recorded. As mentionned in the documentation "If a user can increment by only 1 at a time, you are probably also safe because there is no feasible way to reach this limit.".

## Poison Data

Data are passed along on several occasions : 
* When the owner inputs a proof
* When a owner edit/create a tag
* When the owner enters a hash for verifying the proofs. 
* When the owner use the tag search engine

There is front end checks as for the lenght of the string for every field. 
Regarding the ipfsHash sent back when uploading the proof to IPFS, it is controlled to make sure the length of the IPFSHash doesn't exceed what's possible 

Parameters are controled in terms of logic. 


## Exposure

### Exposed Functions
Most of the function used on this project are 'view' types and won't change the status of the blockchain.
For the few functions that do, i paid attention to the role of the user and what he can do. 
Msg.sender can edit his own proof tag, but can't access other for example. 

### Exposed secrets
Here, nothing has to be kept secret and all can be store onto the blockchain. 

## `tx.origin` & Gas limit
'msg sender' is used all the way. tx.origin is considered as deprecated.