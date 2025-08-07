import { ethers } from 'ethers';

// 🔐 Alchemy RPC config (replace with your real keys)
const ALCHEMY_RPC = {
  ethereum: "https://eth-mainnet.g.alchemy.com/v2/67Zq93zmSQZhj2zY_hnsw",
  sepolia: "https://eth-sepolia.g.alchemy.com/v2/67Zq93zmSQZhj2zY_hnsw",
};

// 📜 Generate mnemonic
export function generateMnemonic() {
  const randomEntropyBytes = ethers.utils.randomBytes(16);
  return ethers.utils.entropyToMnemonic(randomEntropyBytes);
}

// 🔐 Create HD Wallet from mnemonic
export function createHdWallet() {
  const mnemonic = generateMnemonic();
  const hdWallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
  return hdWallet;
}

// 👶 Create derived child wallets and store in localStorage
export function createHdWalletChild() {
  const HdWallet = createHdWallet(); // you were referencing undefined HdWallet before

  let childWallets = localStorage.getItem("childWallets");
  if (childWallets) {
    childWallets = JSON.parse(childWallets);
    const newPath = "m/0/" + (childWallets.length + 1);
    childWallets.push(HdWallet.derivePath(newPath));
  } else {
    childWallets = [HdWallet.derivePath(HdWallet.path + "/0/1")];
  }

  localStorage.setItem("childWallets", JSON.stringify(childWallets));
  return true;
}

// 📦 Get ETH balance
export async function getBalance(network, address) {
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC[network]);
  try {
    const balance = await provider.getBalance(address);
    console.log(`Balance in Wei: ${balance.toString()}`);
    return balance;
  } catch (error) {
    console.error(`Error fetching balance: ${error}`);
    throw error;
  }
}

// 🔢 Hex to decimal
export function hexToDecimal(hex) {
  return parseInt(hex, 16);
}

// 🖋️ Sign TX (basic)
export async function signTX(data) {
  const privateKey = localStorage.getItem("privateKey");
  if (!privateKey) throw new Error("Private key not found");

  const signer = new ethers.Wallet(privateKey);
  return await signer.signTransaction(data);
}

// 🖋️ Sign TX with gas fields + nonce (advanced)
export async function signTX2(data) {
  const privateKey = localStorage.getItem("privateKey");
  if (!privateKey) throw new Error("Private key not found");

  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC.sepolia);
  const wallet = new ethers.Wallet(privateKey, provider);

  const txData = {
    ...data,
    nonce: await provider.getTransactionCount(wallet.address),
    gasLimit: ethers.utils.hexlify(21000),
    gasPrice: await provider.getGasPrice(),
    chainId: 11155111, // Sepolia
  };

  return await wallet.signTransaction(txData);
}

// 🚀 Send TX (basic)
export async function sendTransaction(amount, receiver) {
  const privateKey = localStorage.getItem("privateKey");
  if (!privateKey) throw new Error("Private key not found");

  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC.sepolia);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = {
    to: receiver,
    value: ethers.utils.parseEther(amount),
    gasLimit: 21000,
    gasPrice: await provider.getGasPrice(),
    nonce: await provider.getTransactionCount(wallet.address),
    chainId: 11155111,
  };

  try {
    const txResponse = await wallet.sendTransaction(tx);
    console.log("Transaction sent:", txResponse);
    const receipt = await txResponse.wait();
    console.log("Transaction mined:", receipt);
    return true;
  } catch (error) {
    console.error("Error sending transaction:", error);
    return false;
  }
}

// 📨 Send signed TX using default signer (cleaned)
export async function sendTX(data) {
  const privateKey = localStorage.getItem("privateKey");
  if (!privateKey) throw new Error("Private key not found");

  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC.sepolia);
  const signer = new ethers.Wallet(privateKey, provider);

  try {
    const txResponse = await signer.sendTransaction(data);
    console.log("Transaction sent:", txResponse);
    const receipt = await txResponse.wait();
    console.log("Transaction mined:", receipt);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

// 📨 Alternate version with static privateKey (dev)
export async function sendTX2(data) {
  const privateKey = "0x7016a068b9602cbab81958783909ab5ed86bb02aa50cf7c106ab70ac8b6afea4";
  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC.sepolia);
  const signer = new ethers.Wallet(privateKey, provider);

  try {
    const txResponse = await signer.sendTransaction(data);
    console.log("Transaction sent:", txResponse);
    const receipt = await txResponse.wait();
    console.log("Transaction mined:", receipt);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}
