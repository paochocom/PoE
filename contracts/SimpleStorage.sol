pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
//import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";


contract SimpleStorage is Ownable{
  // define ipfsHash
  string ipfsHash;

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
event debug(bool destroyed);
event debug2(address destroyed);

/* Implementation of design pattern / Circuit Breaker
Modifier for owner actions*/
modifier ownerRestricted {
      require(owner == msg.sender);
      _;
   } 

// Function for killing the contract
   function destroyContract() public{
     require(owner == msg.sender);
     debug(true);
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

//Function to retrieve the owner of a doc from the IPFSHash  
  function get() public view returns (string) {
    return ipfsHash;
  }

//Function for creating a proof in the blockchain
  function createProof(string _ipfsHash, string _name, uint256 _time) public returns (uint) {
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
    //Onlyowner of the proof can add a tag
      require(getUser(ipfshash) == msg.sender);
      TagTable[tag].push(ipfshash);
        return true;
  }

  //Function associate tag with IPFShash
  function retrieveTags(bytes32 tag) public view returns (uint256) {
      //TagTable[keccak256(abi.encode(tag))].push(keccak256(abi.encode(ipfshash))
     uint256 TagCount = TagTable[tag].length;
    // bytes32 testname = TagTable[keccak256(abi.encode(tag))][1];
        return (TagCount);
  } 

   //Function retrieve picturesHash from tag
  function retrieveHashFromTag(bytes32 tag, uint i) public view returns (string) {
        return (TagTable[tag][i]);
  }

  /** @dev transfer contract to another owner */
    function _transferOwnership(address _newOwner) internal {
        require(_newOwner != address(0));
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

}