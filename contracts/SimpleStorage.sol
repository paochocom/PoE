pragma solidity ^0.4.24;
//pragma experimental ABIEncoderV2;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
//import "github.com/OpenZeppelin/zeppelin-solidity/contracts/ownership/Ownable.sol";


contract SimpleStorage is Ownable{
  // define ipfsHash
  string ipfsHash;

  // Add a variable called Proofcount to count how much Proof globally
  uint ProofCount;

  // A mapping for storing all the proofs
  mapping (uint => Proof) public Proofs;
  // A mapping for matching hashes and index
  mapping (bytes32 => uint) public Hashes;
  
  //array of uint for keeping track of proof created
  uint256[] ProofTable; 

  // Add a mapping that does the correspondance between users and proofs they did
  mapping (address => Proof[]) public ProofList;

  // Add a mapping that does the correspondance between proofs and the users
  mapping (bytes32 => address) public UserList;

  //create a  correspondance between tag and ipfshhash
  mapping (bytes32 => string[]) public TagTable;

 event ProofAssociated(address ownerHash, string ipfsHash);

/* Implementation of design pattern / Circuit Breaker
Modifier for owner actions*/
modifier ownerRestricted {
      require(owner == msg.sender);
      _;
   } 

// Function for killing the contract
   function destroyContract() public{
     require(owner == msg.sender);
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

//Function for creating a proof in the blockchain
  function createProof(string _ipfsHash, string _name, uint256 _time) public returns (uint) {
      //You can only create a proof if the ipfsHash is unique
      require(getUser(_ipfsHash)==0);
      Proof memory prooftemp = Proof({
            countdocs: ProofList[msg.sender].length,
            ipfsHash : _ipfsHash,
            name : _name,
            time: _time,
            owner:msg.sender
        });
      //We add the proof to the proof list of a user
      ProofList[msg.sender].push(prooftemp);
      // We increment the total number of proofs uploaded
      ProofCount+=1;
      //We add the proof in the general list of proofs
      Proofs[ProofCount]=prooftemp;
      //We add the bytes of the hash with the corresponding index in a mapping
      Hashes[keccak256(abi.encode(_ipfsHash))]=ProofCount;
      // We add the user in the mapping for keeping proofs owner
      UserList[keccak256(abi.encode(_ipfsHash))] = msg.sender;
      //We return the total number of proofs of user
      return  ProofList[msg.sender].length;
  }
  
//Function for getting all the informations about a proof
  function getProof(uint256 index) public view returns (uint256, string , string, uint256 , address) {
         return (ProofList[msg.sender][index].countdocs, ProofList[msg.sender][index].ipfsHash, ProofList[msg.sender][index].name, ProofList[msg.sender][index].time, ProofList[msg.sender][index].owner);
         
}

//Function for getting the count of all the proofs of a user
  function getProofsCount() public view returns (uint) {
      return(ProofList[msg.sender].length);
  }

//Function for getting the count of all the proofs
  function getTotalProofs() public view returns (uint) {
      return(ProofCount);
  }

//Function for retrieving the ID of the owner of the proof
  function getUser(string finduser) public view returns (address) {
      return(UserList[keccak256(abi.encode(finduser))]);
  }

//Function for retrieving the ID of a  proof with the string
  function getIndex(string ipfshash) public view returns (uint) {
      return(Hashes[keccak256(abi.encode(ipfshash))]);
  }

//Function for retrieving the timestamp of a  proof with the ID
  function getTimeStamp(uint id) public view returns (uint256) {
      return(Proofs[id].time);
  }  

//Function associate tag with IPFShash
  function associateTags(bytes32 tag, string ipfshash) public returns (bool) {
    //We verify that only the owner of the proof can add a tag
      require(getUser(ipfshash) == msg.sender);
      TagTable[tag].push(ipfshash);
        return true;
  }

  
  //Function To retrieve the number of proofs tagged 
  function retrieveTags(bytes32 tag) public view returns (uint256) {
     uint256 TagCount = TagTable[tag].length;
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