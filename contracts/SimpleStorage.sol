pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
//import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";


contract SimpleStorage is Ownable{
  // define ipfsHash
  string ipfsHash;

   // set owner 
  address owner;

  // Add a variable called Proofcount to count how much Proof per user 
  uint ProofCount;

  // A mapping for storing all the proofs
  mapping (uint => Proof) public Proofs;

  //array of uint for keeping track of proof created
  uint256[] ProofTable; 

  // Add a mapping that does the correspondance between users and proofs they did
  mapping (address => Proof[]) public ProofList;
  mapping (bytes32 => address) public UserList;
  //create a  correspondance between tag and ipfshhash
  mapping (bytes32 => string[]) public TagTable;

 event ProofAssociated(address ownerHash, string ipfsHash);
 event ProofHash(string p);


/* Implementation of design pattern / Circuit Breaker
Modifier for owner actions*/
modifier ownerRestricted {
      require(owner == msg.sender);
      _;
   } 

// Function for killing the contract
   function destroyContract() private ownerRestricted {
     selfdestruct(owner);
   }

/** @dev Proof is the struct keeping info of each doc
      * @countdocs the id of the doc
      * @ipfsHash the hash of the doc from IPFS
      * @name the name of the file
      * @time the timestamp of the doc
      * @owner the adress of the owner of the doc
      */
struct Proof {
        uint256 countdocs; 
        string ipfsHash;
        string name;
        uint256 time;
        address owner;
    }

//A struct use for the users    
struct User{
    address owner;
}

//A standard function for setting an ipfsHash
  function set(string x) public {
    ipfsHash = x;
  }

//A function for associating standard documents to a user
function fill_map() public returns (uint){
    //Definintion of first test document
    Proof memory proof1 = Proof({
            countdocs: ProofTable.length,
            ipfsHash : "test",
            name : "testname",
            time: 123,
            owner:msg.sender
        });
    ProofTable.push(ProofTable.length);
    Proofs[ProofTable.length]=proof1;

    //Definintion of second test document    
    Proof memory proof2 = Proof({
            countdocs: ProofTable.length,
            ipfsHash : "1",
            name : "2",
            time: 321,
            owner:msg.sender
        });

    ProofTable.push(ProofTable.length);
    Proofs[ProofTable.length]=proof2;
    
   //test for adding a proof for a user
    ProofList[msg.sender].push(proof1);
    ProofList[msg.sender].push(proof2);

    //Sends back the lenght of the ProofList mapping for the user
    return ProofList[msg.sender].length;

  }

//Function to retrieve the owner of a doc from the IPFSHash  
  function get() public view returns (string) {
    return ipfsHash;
  }

//Function for creating a proof in the blockchain
  function createProof(string _ipfsHash, string _name, uint256 _time) returns (uint) {
      Proof memory prooftemp = Proof({
            countdocs: ProofList[msg.sender].length,
            ipfsHash : _ipfsHash,
            name : _name,
            time: _time,
            owner:msg.sender
        });
      ProofList[msg.sender].push(prooftemp);
      Proofs[ProofList[msg.sender].length]=prooftemp;
      ProofCount = ProofList[msg.sender].length;
      UserList[keccak256(abi.encode(_ipfsHash))] = msg.sender;
      return  ProofCount;
  }
  
//Function for getting all the proofs from a user
function getProofs() public returns (address) {
    for (uint i = 0; i < ProofList[msg.sender].length; i++) {
            emit ProofHash(ProofList[msg.sender][i].ipfsHash);
        }
        i=i-1;
        return(ProofList[msg.sender][1].owner);
  }

//Function for getting all the informations about a proof
  function getProof(uint256 index) public view returns (uint256, string , string, uint256 , address ) {
         return (Proofs[index].countdocs, Proofs[index].ipfsHash, Proofs[index].name, Proofs[index].time, Proofs[index].owner);
}

//Function for getting the count of all the proofs of a user
  function getProofsCount() public view returns (uint) {
      return(ProofList[msg.sender].length);
  }

//Function for retrieving the ID of the owner of the proof
  function getUser(string finduser) public view returns (address) {
      return(UserList[keccak256(abi.encode(finduser))]);
  }

//Function associate tag with IPFShash
  function associateTags(bytes32 tag, string ipfshash) public returns (bool) {
      TagTable[tag].push(ipfshash);
        return true;
  }

//  function associateTags(string tag, string ipfshash) public returns (bool) {
//      TagTable[keccak256(abi.encode(tag))].push(keccak256(abi.encode(ipfshash)));
//        return true;
//  }  

  //Function associate tag with IPFShash
  function retrieveTags(bytes32 tag) public view returns (uint256) {
      //TagTable[keccak256(abi.encode(tag))].push(keccak256(abi.encode(ipfshash))
     uint256 TagCount = TagTable[tag].length;
    // bytes32 testname = TagTable[keccak256(abi.encode(tag))][1];
        return (TagCount);
  } 

   //Function retrieve picturesHash from tag
//  function retrieveHashFromTag(string tag, uint i) public view returns (bytes32) {
      //TagTable[keccak256(abi.encode(tag))].push(keccak256(abi.encode(ipfshash))
     //uint256 TagCount = TagTable[keccak256(abi.encode(tag))].length;
//     bytes32 hashValue = TagTable[keccak256(abi.encode(tag))][1];
//        return (hashValue);
//  }

   //Function retrieve picturesHash from tag
  function retrieveHashFromTag(bytes32 tag, uint i) public view returns (string) {
      //TagTable[keccak256(abi.encode(tag))].push(keccak256(abi.encode(ipfshash))
     //uint256 TagCount = TagTable[keccak256(abi.encode(tag))].length;
     string hashValue = TagTable[tag][i];
        return (hashValue);
  }

  /** @dev transfer contract to another owner */
    function _transferOwnership(address _newOwner) internal {
        require(_newOwner != address(0));
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

}