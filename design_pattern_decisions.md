# Design pattern decisions


Most of the function implemented are view function with the purpose of retrieving data for front end.
All these function don't need a specific restriction. 
There is 2 functions that change the state of the blockchain. 

-> create Proof
This function would add an item to an object array linked to the user. 
Control on front end is done on the fields associated. i purposely don't pass the address of the owner as a paremeter on the function for not giving any chance to anyone to replace it , and create a  faulty proof.
msg.sender is called directly in the core of the function, hence each proof is associated to the owner.
We use require to make sure that no identical Hash can be used. If the IpfsHash belong to someone already, no one can use it anymore.  

-> Edit Tag
This function would add a tag to a proof. 
We make sure that the one modifying the tag associated to the proof is the owner of the proof using require /modifiers.


## Restricting access
I decided to use as less as possible restriction on functions. Just functions changing the state of the blockchain have been limited. 
Either for Logic reason (A proof can be used once only) or for security reason (No one should be able to add tag to your proofs / suicide function restricted to owner).


## Circuit Breaker
I added an emergency stop by implementing a suicide function. 
In the event of something going bad, only the owner can kill the contract.
We could also think about a "pause" mode activable by the owner for not allowing anyone to add more tags or proof untill reopened by the owner. 

## State Machine

To the best of my knowledge and understanding of the course, i did my best to implement a contract that allows to have a coherent and stable state. 

## Reflexions
I decided to go for the most simple implementation. A more complex way could have been done using the "Factory Contract" design pattern and have a factory deploying "child" contracts for each proof created. It would require more time, but i believe it would have been a cleaner way to do it. 