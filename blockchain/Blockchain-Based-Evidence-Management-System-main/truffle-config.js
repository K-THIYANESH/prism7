// const path = require("path");
// var HDWalletProvider = require('./client/node_modules/truffle-hdwallet-provider');

// var infura_apikey = "";
// var mnemonic = "";

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 7545,
//       network_id: "*" // Match any network id
//     },
//     sepolia: { 
//       provider: () => new HDWalletProvider(mnemonic, "https://sepolia.infura.io/v3/" + infura_apikey),
//       network_id: 11155111, // Sepolia network ID
//       gas: 3000000,
//       gasPrice: 10000000000,
//       networkCheckTimeout: 1000000,
//       timeoutBlocks: 200, // number of blocks before a deployment times out
//       skipDryRun: true
//     }
//   },
//   contracts_build_directory: path.join(__dirname, "client/src/contracts")
// };



const path = require("path");
const HDWalletProvider = require('./client/node_modules/truffle-hdwallet-provider'); // Update to use the correct package

const alchemy_apikey = ""; // Replace with your Alchemy API key
const mnemonic = ""; // Replace with your MetaMask mnemonic

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", 
      port: 7545,
      network_id: "*" // Match any network id
    },
    sepolia: { 
      provider: () => new HDWalletProvider(mnemonic, `your alchemy sepolia endpoint`),
      network_id: 11155111, // Sepolia network ID
      gas: 3000000,
      gasPrice: 10000000000,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 500, // Number of blocks before a deployment times out
      skipDryRun: true
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};
// command to run contact: truffle migrate --network sepolia --reset    