const BLOCKCHAIN_CONFIG = {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    networkId: "1337",
    rpcUrl: "http://127.0.0.1:8545",
    abi: [
        {
            "constant": true,
            "inputs": [],
            "name": "getPatCount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_crime_id",
                    "type": "uint256"
                },
                {
                    "name": "_exhibit_name",
                    "type": "string"
                },
                {
                    "name": "_desc",
                    "type": "string"
                },
                {
                    "name": "_timestamp",
                    "type": "string"
                },
                {
                    "name": "_ipfsHash",
                    "type": "string"
                }
            ],
            "name": "addReport",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "getPat",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "string"
                },
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "crime",
            "outputs": [
                {
                    "name": "crime_id",
                    "type": "uint256"
                },
                {
                    "name": "exhibit_name",
                    "type": "string"
                },
                {
                    "name": "desc",
                    "type": "string"
                },
                {
                    "name": "timestamp",
                    "type": "string"
                },
                {
                    "name": "ipfsHash",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
};
