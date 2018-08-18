# Design pattern decisions

## Fail early and fail loud

I use a lot of modifiers that checks the roles of the users (role in : owner, adminToValidate, admin, storeOwnerToValidate, storeOwner, user). In those modifiers, `requires()` is used extensively to verify `msg.sender`'s role as well. The use of requires will throw an exception is the condition is not met. 

Moreover, in functions that needs some additional specific checks, i also use `require()` in the beginning of the function. 
For instance in the following function, which allow a user to purchase a item, i check within the function that :

* The store specified by the user is created
* There is enough remaining quantity of the demanded item
* The funds sent along with the transaction are enough to pay for the items

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

## Restricting access

Each function is either public (accessible by everyone) or has some restricting access depending on the role of the caller. Here follows as example the modifiers that checks for roles that i use all along the contract. 

* **Owner** :
  * m_isOwner (see below for details)
  * m_isNotOwner 
* **Admin** :
  * m_isAdmin 
  * m_isNotAdmin
* **Admin To Validate**
  * m_isAdminToValidate
  * m_isNotAdminToValidate
* **Store Owner To Validate**
  * m_isStoreOwnerToValidate
  * m_isNotStoreOwnerToValidate
* **Store Owner**
  * m_isStoreOwner
  * m_isNotStoreOwner
  

```solidity
modifier m_isOwner (address _address) {require(_address == owner); _;}
modifier m_isNotOwner (address _address) {require(_address != owner); _;}

modifier m_isAdmin(address _address) {require(isAdmin(_address)); _;}
modifier m_isNotAdmin(address _address) {require(!isAdmin(_address)); _;}

modifier m_isAdminToValidate(address _address) {require(isAdminToValidate(_address));_;}
modifier m_isNotAdminToValidate(address _address) {require(!isAdminToValidate(_address));_;}

modifier m_isStoreOwnerToValidate(address _address) {require(isStoreOwnerToValidate(_address));_;}
modifier m_isNotStoreOwnerToValidate(address _address) {require(!isStoreOwnerToValidate(_address));_;}

modifier m_isStoreOwner(address _address) {require(isStoreOwner(_address)); _;}
modifier m_isNotStoreOwner(address _address) {require(!isStoreOwner(_address)); _;}
```

## Auto depreciation and mortal 

I did not handle the **auto depreciation** of the contract. This belongs to the future possible enhancements. I choose to use the **mortal** so that the owner of the contract can `selfdestruct()`. 

Nevertheless, as the owner of the contract can activate the `kill()` function anytime, it gives him a lot (too much?) control of the current contract balance. Therefore it is a second-best option since : 

* It allows the contract owner to get control of the contract if something goes horribly wrong
* But, from the users/store owners stand point, it introduces an uncertainty on the recoverability of their funds/balances. 

## Pull over Push Payments

I used the Pull over Push Payment method. When a user wants to purchase an item, his balance is incremented and no external calls are performed :

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

When a store owner wants to cashout his balance, he calls a function to activate the funds transfer. If the external call to `transfer()` fails, then the store owner balance is not modified. 

```solidity
// Function for a storeowner to cash out
function storeOwnerCashOutBalance()
public
payable
m_isStoreOwner(msg.sender)
returns(uint) {
  require(storeCreated(msg.sender));
  require(storeOfOwner[msg.sender].balance > 0);
  storeOfOwner[msg.sender].balance = 0;
  msg.sender.transfer(storeOfOwner[msg.sender].balance);
  return storeOfOwner[msg.sender].balance;
}
```

## Circuit Breaker

I did not introduce **Circuit Breaker** into the contract. It is also a future possible enhancements. It would indeed be useful if there is some disagreement to resolve between users and store owners. The **admins** would be the only ones allowed to stop/pause a given set of functionalities. 

In case **Circuit Breaker** are introduce, one also has to define the new functionalities available only to the **admins** during the **stopped state**. 

## State Machine

To the best of my knowledge and understanding of the course, i did my best to implement a contract that allows to have a coherent and stable state. 

## Speed Bump

I did not introduce the **speed bump** functionalities. Indeed, the marketplace can have several or many store owners and several and many users. As a result, it is the type of applications with possibly quite a number of transactions as a whole.

Nevertheless, one could introduce a **speed bump** on a **per user basis** :

* A user would only be allowed to make x purchase per unit of time
* A store owner would be able to receive as many purchases as possible from several users
* A store owner would only be allowed to create items in store at the pace of y items per unit of time (it also enhances fair competition in the market by avoiding dominant store position by a store owner flooding items to his store)

Introduction of this kind of **speed bump** is a possible future enhancement and was not introduce in this version of the marketplace. 