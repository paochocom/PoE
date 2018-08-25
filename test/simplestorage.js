var SimpleStorage = artifacts.require("SimpleStorage.sol");

contract('SimpleStorage', function(accounts) {

const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]


 //Test 1 : Create a proof and verify the numberof proofs created by the user
it("should create a proof and validate creation", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    await simpleStorageInstance.createProof("TestHash", "TestName", 123, {from: owner})
    
    const countproof = await simpleStorageInstance.getProofsCount({from: owner});
    console.log(countproof.toNumber());
    //1 proof created by user. Result should equal 1
    assert.equal(countproof.toNumber(), 1);

  });

 //Test 2 : Create a proof and verify the number of proofs created by this user
it("should create a 2nd proof and validate creation", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    await simpleStorageInstance.createProof("TestHash2", "TestName2", 123, {from: alice})
	await simpleStorageInstance.createProof("TestHash3", "TestName3", 123, {from: alice})
    
    const countproof = await simpleStorageInstance.getProofsCount({from: alice});

    console.log(countproof.toNumber());
    //2 proof created by user. Result should equal 2
    assert.equal(countproof.toNumber(), 2);

  });


 //Test 3 : Should calculate the total number of proof available in the system
it("Should validate the total number of proofs created", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();
    
    const countproof = await simpleStorageInstance.getTotalProofs();

    console.log(countproof.toNumber());
    //3 proof have been created by 2 users. Result should equal to 3
    assert.equal(countproof.toNumber(), 3);

  });

//Test 4 : Verify which user is associated with a proof
it("should test the 1st proof ownership", async () => {

    const simpleStorageInstance = await SimpleStorage.deployed();
    //Verify which user owns the proof "TestHash"
    const ownerofproof = await simpleStorageInstance.getUser.call("TestHash")

    console.log(ownerofproof);
    //The owner of the proof should be the first account (owner)
    assert.equal(ownerofproof, accounts[0]) ;

  });

//Test 5 : Verify which user is associated with a proof
it("should test the 2nd proof ownership", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();
    //Verify which user owns the proof "TestHash2"
    const ownerofproof = await simpleStorageInstance.getUser.call("TestHash2")

    console.log(ownerofproof);
    //The owner of the proof should be the second account (Alice)
    assert.equal(ownerofproof, accounts[1]) ;

  });

//Test 6 : adding a tag to a proof
it("should add a tag to a proof", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();
    /*Associating user proofs with tags. Only user have the right to do this.
    If you want to raise an error, the associate Tags function should be called on a proof not belonging by the caller*/
    await simpleStorageInstance.associateTags("TestTag", "TestHash", {from: owner});
    await simpleStorageInstance.associateTags("TestTag", "TestHash2", {from: alice});
    const countproof = await simpleStorageInstance.retrieveTags("TestTag", {from: owner});
    
    console.log(countproof.toNumber());
    //Looking for the number of proofs with the tag "TestTag" associated. Answer should be 2.
    assert.equal(countproof.toNumber(), 2);

  });

});
