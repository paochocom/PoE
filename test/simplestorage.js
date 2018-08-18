var SimpleStorage = artifacts.require("SimpleStorage.sol");

contract('SimpleStorage', function(accounts) {

const owner = accounts[0]
    const alice = accounts[1]
    const bob = accounts[2]


 //Test 1 : Create a proof and verify the name of the proof
it("should create a proof and validate creation", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    await simpleStorageInstance.createProof("TestHash", "TestName", 123, {from: owner})
    
    const countproof = await simpleStorageInstance.getProofsCount({from: owner});
    //countproof = countproof.toNumber();
    console.log(countproof.toNumber());
    assert.equal(countproof.toNumber(), 1);

  });

//Test 2 : Create a second proof and validate how many proof are used
it("should create a 2nd proof and validate creation", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    await simpleStorageInstance.createProof("TestHash2", "TestName2", 123, {from: alice})
	await simpleStorageInstance.createProof("TestHash3", "TestName3", 123, {from: alice})
    
    const countproof = await simpleStorageInstance.getProofsCount({from: alice});
    //countproof = countproof.toNumber();
    console.log(countproof.toNumber());
    assert.equal(countproof.toNumber(), 2);

  });


//Test 3 : Verify which user is associated with a proof
it("should test the 2nd proof ownership", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    const ownerofproof = await simpleStorageInstance.getUser.call("TestHash")
 //   const countproof = await simpleStorageInstance.getProofsCount({from: owner});
    //countproof = countproof.toNumber();
    console.log(ownerofproof);
    assert.equal(ownerofproof, accounts[0]) ;

  });

//Test 3 : Verify which user is associated with a proof
it("should test the 1st proof ownership", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    const ownerofproof = await simpleStorageInstance.getUser.call("TestHash2")
 //   const countproof = await simpleStorageInstance.getProofsCount({from: owner});
    //countproof = countproof.toNumber();
    console.log(ownerofproof);
    assert.equal(ownerofproof, accounts[1]) ;

  });

});
