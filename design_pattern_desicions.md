# Design pattern decisions


Most of the function implemented are view function with the purpose of getting data.
All these function don't need a specific restriction. 
There is 2 functions that change the state of the blockchain. 

-> create Proof
This function would add an item to an object array linked to the user. 
Control on front end is done on the fields associated. i purposely don't pass the address of the owner as a paremeter on the function for not giving any chance to anyone to replace it , and creat ea  faulty proof.
msg.sender is called directly in the core of the function, hence each proof is associated to the owner. 

-> Edit Tag
This function would add a  tag toa  proof. we use modifiers to make sure that the one modifying the tag associated to the proof is the owner of the proof.


## Restricting access

Each function is either public (accessible by everyone) or has some restricting access depending on the role of the caller. Here follows as example the modifiers that checks for roles that i use all along the contract. 
```

## Auto depreciation and mortal 

There is a suicide function implemented in the event of something going bad. the owner can kill the contract.

## Circuit Breaker
There is also a function that would lock all possible upload or addition of proof with tags. 
This can be called by the owner of the contract. It can be a  preventive measure before killing the contract. 

## State Machine

To the best of my knowledge and understanding of the course, i did my best to implement a contract that allows to have a coherent and stable state. 
