import contractAddresses from "../contracts/contract-addresses.json";
import SimpleStorageArtifact from "../contracts/contracts/SimpleStorage.sol/SimpleStorage.json";
import ForensicContractArtifact from "../contracts/contracts/ForensicContract.sol/ForensicContract.json";

export const getContractInstance = async (web3, contractName) => {
    const networkId = await web3.eth.net.getId();

    // Hardhat uses chainId 1337 by default for local development
    // We check against the networkId in our saved addresses
    if (networkId.toString() !== contractAddresses.networkId && networkId.toString() !== "31337") {
        console.warn(`Network mismatch: current=${networkId}, expected=${contractAddresses.networkId}`);
    }

    const address = contractAddresses[contractName];
    if (!address) {
        throw new Error(`Contract address for ${contractName} not found`);
    }

    let abi;
    if (contractName === "SimpleStorage") {
        abi = SimpleStorageArtifact.abi;
    } else if (contractName === "ForensicContract") {
        abi = ForensicContractArtifact.abi;
    } else {
        throw new Error(`Unknown contract: ${contractName}`);
    }

    return new web3.eth.Contract(abi, address);
};
