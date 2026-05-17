const Web3 = require('web3');
const HDWalletProvider = require('./client/node_modules/truffle-hdwallet-provider');

const alchemy_apikey = "YnoHqm4t-n_DxIAq6L8VD25vtp-6E-FO";
const mnemonic = "grain alarm analyst program net spoon board fatal super spice dwarf bar";

const provider = new HDWalletProvider(mnemonic, `https://eth-sepolia.alchemyapi.io/v2/${alchemy_apikey}`);
const web3 = new Web3(provider);

web3.eth.getBlockNumber()
  .then(blockNumber => {
    console.log("Connected to Sepolia network. Current block number:", blockNumber);
  })
  .catch(error => {
    console.error("Error connecting to Sepolia network:", error);
  })
  .finally(() => {
    provider.engine.stop(); // Ensure the provider is stopped to prevent hanging
  });
