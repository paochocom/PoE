module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      //If you want to test on truffle develop keep port 9545
      //port: 9545,
      //If you want to test with ganache deactivate port 9545 and activate port 8545
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "https://rinkeby.infura.io/v3/8d83087702d34363a262ee0dbb295433", // Connect to geth on the specified
      from: "0xf17f52151ebef6c7334fad080c5704d77216b732", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
  }
};