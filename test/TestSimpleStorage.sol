pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

    event test_value(address value1);
   //Test 1 :  Validating the correct creation of a proof
  function testItStoresAValue() public {
    //call the contract function for creating proof
    //var countproof = simpleStorage.createProof("TestHash", "TestName", 123);
    var countproof = simpleStorage.createProof("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG", "TestPicture", 1534324966);
    Assert.equal(countproof,1, 'It should show a correct creation of a proof.');

    var countproof2 = simpleStorage.createProof("TestHash", "TestName", 123);
    Assert.equal(countproof2,2, 'It should show a correct creation of a proof.');
    //verify the name of the proof
//    var test = compareStrings("testvalue","testvalue");
    
 //   Assert.isTrue(test, 'It should store the value testvalue.');
  }



//Verify the correct hash is being stored
  function testValueVerification() public {
    //call the contract function for getting proofs data
    var (a, b, c, d, e) = simpleStorage.getProof(1);
    var test = compareStrings("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",b);
    //verify the name of the proof
	Assert.isTrue(test, 'It should store the correct IPFSHash for value 1.');

	var (a2, b2, c2, d2, e2) = simpleStorage.getProof(2);
    var test2 = compareStrings("TestHash",b2);
    //verify the name of the proof
	Assert.isTrue(test2, 'It should store the correct IPFSHash for value 2.');
  }


  //function for comparing strings by hashing them with solidty native hash function. 
  function compareStrings (string a, string b) view returns (bool){
       return keccak256(a) == keccak256(b);
   }

}
