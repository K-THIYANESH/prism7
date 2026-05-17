// const IPFS = require('ipfs-api');

// // Configure IPFS to use Pinata
// const ipfs = new IPFS({
//    // mode: 'no-cors',
//   host: 'teal-tired-gerbil-315.mypinata.cloud',
//   port: 443,
//   protocol: 'https',
//   headers: {
//     // Add your Pinata API key and secret
//     pinata_api_key: '',
//     pinata_secret_api_key: ''
//   }
// });



const pinataSDK = require('@pinata/sdk'); 
const pinata = new pinataSDK({ pinataSecretApiKey: '',  pinataApiKey:''});


export default pinata;