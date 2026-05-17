class BlockchainClient {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.contract = null;
        this.isConnected = false;
    }

    async init() {
        console.log("Initializing Blockchain Client...");
        if (typeof window.ethers === 'undefined') {
            console.error("Ethers.js not found. Please include it in index.html");
            return false;
        }

        try {
            // Connect to local Hardhat node
            this.provider = new window.ethers.providers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);

            // Get network to verify connection
            const network = await this.provider.getNetwork();
            console.log(`Connected to network: ${network.chainId}`);

            if (network.chainId.toString() !== BLOCKCHAIN_CONFIG.networkId) {
                console.warn(`Network mismatch. Expected ${BLOCKCHAIN_CONFIG.networkId}, got ${network.chainId}`);
            }

            // Create contract instance (read-only without signer, but we'll try to get signer from provider if possible, 
            // though JsonRpcProvider usually has a signer for the first account)
            this.signer = this.provider.getSigner();
            this.contract = new window.ethers.Contract(
                BLOCKCHAIN_CONFIG.address,
                BLOCKCHAIN_CONFIG.abi,
                this.signer
            );

            this.isConnected = true;
            this.updateUIStatus("ACTIVE (User Node)", "var(--accent-success)");
            return true;
        } catch (error) {
            console.error("Failed to connect to blockchain:", error);
            this.isConnected = false;
            this.updateUIStatus("CONNECTION FAILED", "var(--accent-danger)");
            return false;
        }
    }

    updateUIStatus(statusText, color) {
        // Find all blockchain status elements in module cards
        const statusElements = document.querySelectorAll('.blockchain-status');
        statusElements.forEach(el => {
            el.innerHTML = `>> BLOCKCHAIN: ${statusText}`;
            el.style.color = color;
        });
    }

    async getEvidenceCount() {
        if (!this.isConnected) return 0;
        try {
            const count = await this.contract.getPatCount();
            return count.toString();
        } catch (e) {
            console.error("Error fetching evidence count:", e);
            return 0;
        }
    }

    async addEvidence(crimeId, exhibitName, desc, timestamp, ipfsHash) {
        if (!this.isConnected) return null;
        try {
            const tx = await this.contract.addReport(crimeId, exhibitName, desc, timestamp, ipfsHash);
            await tx.wait();
            return tx.hash;
        } catch (e) {
            console.error("Error adding evidence:", e);
            throw e;
        }
    }
}

// Global instance
window.blockchainClient = new BlockchainClient();
