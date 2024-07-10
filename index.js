import { ethers } from "ethers";
import promptSync from 'prompt-sync';
import 'dotenv/config';
import fs from 'fs';
import readline from 'readline';
import chalk from 'chalk';
import { log } from './utils/logger.js';
import { printName } from './utils/name.js';
import { bytecodeERC20 } from './config/bytecodeERC20.js';

const prompt = promptSync();

// Load network configuration
const networkConfig = JSON.parse(fs.readFileSync('./config/network.json', 'utf-8'));

// Function to select network
function selectNetwork(networkIndex) {
    const networkNames = Object.keys(networkConfig);
    const networkName = networkNames[networkIndex - 1];
    if (!networkName) {
        throw new Error(`Network with index ${networkIndex} not found in configuration`);
    }
    return networkConfig[networkName];
}

// Function to display available networks
function displayNetworks() {
    const networkNames = Object.keys(networkConfig);
    console.log(chalk.blueBright('Available Networks:'));
    networkNames.forEach((name, index) => {
        console.log(`${index + 1}: ${name}`);
    });
}

// Function to prompt user for input
function promptUser(question) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(chalk.blueBright(question), (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Function to add a new network
async function addNetwork() {
    const name = await promptUser('Enter Network Name, e.g., Zero Testnet: ');
    const rpcUrl = await promptUser('Enter RPC URL, e.g., https: ');
    const chainId = await promptUser('Enter Chain ID: ');

    if (networkConfig[name]) {
        throw new Error(`Network with name ${name} already exists`);
    }

    networkConfig[name] = {
        RPC_URL: rpcUrl,
        CHAIN_ID: chainId
    };

    fs.writeFileSync('./config/network.json', JSON.stringify(networkConfig, null, 2));
    console.log(chalk.greenBright('Network added successfully!'));
}

async function main() {
    printName();

    const action = await promptUser('Do you want to add a new network? (y/n): ');

    if (action.toLowerCase() === 'y') {
        await addNetwork();
    }

    // Display and select network
    displayNetworks();
    const networkIndex = parseInt(await promptUser('Select Network by Number: '), 10);
    const { RPC_URL, CHAIN_ID } = selectNetwork(networkIndex);

    // Load private keys from environment variables
    let privateKeys = process.env.PRIVATE_KEY;
    if (!privateKeys) {
        throw new Error('PRIVATE_KEY not set in .env file');
    }

    // Parse private keys as array
    privateKeys = JSON.parse(privateKeys);

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    async function deploySC(RPC_URL, CHAIN_ID) {

        const tokenName = parseInt(await promptUser('Enter the token name: '), 10);
        const tokenSymbol = parseInt(await promptUser('Enter the token symbol: '), 10);
        const mintAmount = parseInt(await promptUser('Enter the token supply: '), 10);

        const provider = new ethers.JsonRpcProvider(RPC_URL);

        for (const privateKey of privateKeys) {
            const wallet = new ethers.Wallet(privateKey, provider);
            try {
                const balance = await provider.getBalance(wallet.address);
                log('DEBUG', `Current ETH balance of ${wallet.address}: ${ethers.formatEther(balance)} ETH`);
                log('INFO', `Starting deploy contract from wallet ${wallet.address}`);
                await delay(1000);

                const amountToMint = BigInt(mintAmount) * 10n ** 18n;

                const abiERC20 = [
                    "constructor(string memory name_, string memory symbol_)",
                    "function name() view returns (string)",
                    "function symbol() view returns (string)",
                    "function totalSupply() view returns (uint256)",
                    "function balanceOf(address) view returns (uint)",
                    "function transfer(address to, uint256 amount) external returns (bool)",
                    "function mint(uint amount) external",
                ];

                const factoryERC20 = new ethers.ContractFactory(abiERC20, bytecodeERC20, wallet);

                async function deployContract() {
                    try {
                        log('INFO', 'Processing Deploy the ERC20 token contract');
                        const contractERC20 = await factoryERC20.deploy(tokenName, tokenSymbol);
                        log('SUCCESS', `Contract Address: ${contractERC20.target}`);
                        log('INFO', 'Wait for contract deployment on the blockchain');
                        await contractERC20.waitForDeployment();
                        let tx = await contractERC20.mint(amountToMint);
                        await tx.wait();
                        log('DEBUG', 'Contract deployed on the blockchain');
                        log('SUCCESS', `Contract Name: ${await contractERC20.name()}`);
                        log('SUCCESS', `Contract Symbol: ${await contractERC20.symbol()}`);
                        log('SUCCESS', `Total token supply: ${await contractERC20.totalSupply()}`);
                        log('DEBUG', `Completed`);
                    } catch (error) {
                        log('ERROR', `Deployment failed: ${error.message}`);
                    }
                }

                await deployContract();
            } catch (error) {
                log('ERROR', `Error with wallet ${wallet.address}: ${error.message}`);
            }
        }
    }

    await deploySC(RPC_URL, CHAIN_ID);
}

// Function to wait for a specified number of milliseconds
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(console.error);
