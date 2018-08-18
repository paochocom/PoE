# Avoiding Common Attacks

## Logic bugs & Recursion

### Logic bugs

I wrote 5 tests Truffle framework. 
Some in Javascript some in solidity
Can be found at  `../truffle/test/`

### Reentrancy calls 

When the contract's functions call an external function, it is : 

* either a function that is implemented within the contract. I did not used recursive functions. An the power to make those function calls fail stays within the contract. 
* or functions external to the contracts : 
  * `push()` to add a new element in a list
  * `selfdestruct()` to destruct the contract and transfer all the funds to the owner
  * `transfer()` to transfer some ether. Here the control of whether the external call succeed rely on the recipient end. That is why, in the function for a store owner to cash out his balance, i handle all internal variables before calling the transfer. See code bellow : 
  ```solidity

## Integer Arithmetic Overflow

In the function that a user call to purchase an item, i check for interger aritmetic overflow

```solidity
// Function for user to purchase an item
function userPurchaseItemFromStore(address _storeOwner, uint _item_idx, uint _qty)
public
payable
m_isNotOwner(msg.sender)
m_isNotAdmin(msg.sender)
m_isNotStoreOwner(msg.sender)
returns(uint) {
  require(storeCreated(_storeOwner));
  require(storeOfOwner[_storeOwner].itemIdList[_item_idx].qty >= _qty);
  require(msg.value >= storeOfOwner[_storeOwner].itemIdList[_item_idx].price * _qty);
  require(storeOfOwner[_storeOwner].balance + msg.value >= storeOfOwner[_storeOwner].balance); // Check for overflow
  storeOfOwner[_storeOwner].itemIdList[_item_idx].qty -= _qty;
  storeOfOwner[_storeOwner].balance += msg.value;
  return storeOfOwner[_storeOwner].itemIdList[_item_idx].qty;
}
```

## Poison Data

Data are passed along on several occasions : 

* When the owner of the contract validates/removes admins
* When an admin validates/removes store owners
* When a store owner adds an item to his store
* When a user purchase an item from a store

I do not perform deep checks (at least on the format/size/type) on what is received via the argument of contract function calls. I just check that the value of the parameters obey a set of rules in terms of functionalities. 
For instance, i do not check length of strings. 
It will be in the high priority for possible future enhancements.

## Exposure

### Exposed Functions

I payed attention to the accessibility of the functions according to the role of the `msg.sender`. See `./design_pattern_decisions.md` in the section *Restricting access*. 

### Exposed secrets

Here, nothing has to be kept secret and all can be store onto the blockchain. 

## Miner vulnerabilities
All timestamps used are only for information. Nothing is used for internal logics.

## `tx.origin` & Gas limit
'msg sender' is used all the way. tx.origin is considered as deprecated.