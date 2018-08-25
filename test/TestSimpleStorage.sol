pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

    event test_value(address value1);

   //Test 1 :  Validating the correct creation of a proof
  function testItStoresAValue() public {
    //We create a first proof and validate the return ( in this case 1 the number of proof created by the user)
    var countproof = simpleStorage.createProof("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG", "TestPicture", 1534324966);
    Assert.equal(countproof,1, 'It should show a correct creation of a proof.');

    //We create a second proof and validate the return ( in this case 2 the number of proof created by the user)
    var countproof2 = simpleStorage.createProof("TestHash", "TestName", 123);
    Assert.equal(countproof2,2, 'It should show a correct creation for the second proof.');

  }



//Verify the value of the ipfsHash
  function testValueVerification() public {
    //call the contract function for getting all the proofs data
    var (a, b, c, d, e) = simpleStorage.getProof(0);
    //comparing the ipfsHash of the proof created in previous function with the result of proof 0
    var test = compareStrings("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",b);
    //comparing the name of the proof created in previous function with the result of proof 0
    var testname = compareStrings("TestPicture",c);

    //Validate our assertions.
	Assert.isTrue(test, 'It should store the correct IPFSHash for first proof.');
  Assert.isTrue(test, 'It should store the correct Name for first proof.');

	var (a2, b2, c2, d2, e2) = simpleStorage.getProof(1);
  //comparing the ipfsHash of the proof created in previous function with the result of proof 1
  var test2 = compareStrings("TestHash",b2);
  //comparing the name of the proof created in previous function with the result of proof 0
  var testname2 = compareStrings("TestName",c2);

  //Validate our assertions.
	Assert.isTrue(test2, 'It should store the correct IPFSHash for value 2.');
  }


  //function for comparing strings by hashing them with solidty native hash function. 
  function compareStrings (string a, string b) view returns (bool){
       return keccak256(a) == keccak256(b);
   }

}
