# TOOLS FOR DEPLOYING SMART CONTRACTS
![logo](./utils/smart-contract.png)
## Description
This script is designed to create or deploy ERC20 smart contracts. It mirrors the smart contract creation process in RemixIDE, providing an easy method to deploy ERC20 tokens on EVM-compatible networks.

## Preparation
Make sure you have NodeJS installed. If not, you can install it [install here](https://nodejs.org/en/download/package-manager/current)

## Features
- **Functionality**: Deploy ERC20 Smart Contracts.
- **Network Support**: Compatible with all EVM networks, including Testnet and Mainnet. If you want to add an EVM Network, just enter the RPC and CHAIN-ID
- **Wallet Support**: Supports multiple wallets.
- **Tool Options**:
1. `index.js` for customized ERC20 data.
2. `main.js` for random ERC20 data.

## Installation
### Clone Repository
First, clone the repository:
```
git clone https://github.com/PrastianHD/smart-contract.git
cd smart-contract
```

### Install Dependencies
Next, install the required dependencies:
```
npm install
```

### Private Key Configuration
Create a .env file in the project root directory:
```
PRIVATE_KEY=["your_private_key", "your_private_key"]
```
Replace `"your_private_key"` with your actual private key.

### Running the Script
### Mode 1: Customize ERC20 Token
To deploy a smart contract with custom token details, run:
```
node index.js
```
- Enter Token Name
- Enter Token Symbol
- Enter Total Supply

### Mode 2: Random ERC20 Token
To deploy a smart contract with randomly generated token details
```
node main.js
```
- Enter Transaction Amount
- Automatically create ERC20 from `token.json` data
- ERC20 data will be selected randomly.

### GIVE ME A START

- Don't Forget to Click `STAR` on this reposity
- Don't Forget to `FORK` this Reposity
