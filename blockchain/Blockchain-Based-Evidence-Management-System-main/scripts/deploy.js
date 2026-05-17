const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("Starting deployment...");

    // Deploy ForensicContract
    const ForensicContract = await hre.ethers.getContractFactory("ForensicContract");
    const forensicContract = await ForensicContract.deploy();
    await forensicContract.waitForDeployment();
    const forensicAddress = await forensicContract.getAddress();
    console.log("ForensicContract deployed to:", forensicAddress);

    // Deploy SimpleStorage
    const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();
    const storageAddress = await simpleStorage.getAddress();
    console.log("SimpleStorage deployed to:", storageAddress);

    // Deploy Migrations
    const Migrations = await hre.ethers.getContractFactory("Migrations");
    const migrations = await Migrations.deploy();
    await migrations.waitForDeployment();
    const migrationsAddress = await migrations.getAddress();
    console.log("Migrations deployed to:", migrationsAddress);

    // Save the addresses to a file that the frontend can read
    const addresses = {
        ForensicContract: forensicAddress,
        SimpleStorage: storageAddress,
        Migrations: migrationsAddress,
        networkId: (await hre.ethers.provider.getNetwork()).chainId.toString()
    };

    const outputDir = path.join(__dirname, "../client/src/contracts");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(outputDir, "contract-addresses.json"),
        JSON.stringify(addresses, null, 2)
    );

    console.log("\nAddresses saved to client/src/contracts/contract-addresses.json");
    console.log("Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
