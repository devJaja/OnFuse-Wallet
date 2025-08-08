import { ethers } from 'ethers';

const ALCHEMY_RPC = {
  ethereum: "https://eth-mainnet.g.alchemy.com/v2/67Zq93zmSQZhj2zY_hnsw",
  sepolia: "https://eth-sepolia.g.alchemy.com/v2/67Zq93zmSQZhj2zY_hnsw",
};

//  Generate mnemonic
export function generateMnemonic() {
  const randomEntropyBytes = ethers.utils.randomBytes(16);
  return ethers.utils.entropyToMnemonic(randomEntropyBytes);
}

// Create HD Wallet from mnemonic
export function createHdWallet() {
  const mnemonic = generateMnemonic();
  const hdWallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
  return hdWallet;
}

// Create derived child wallets and store in localStorage
// export function createHdWalletChild() {
//      const HdWallet = createHdWallet();

//   let childWallets = localStorage.getItem("childWallets");
//   if (childWallets) {
//     childWallets = JSON.parse(childWallets);
//     const newPath = "m/0/" + (childWallets.length + 1);
//     childWallets.push(HdWallet.derivePath(newPath));
//   } else {
//     childWallets = [HdWallet.derivePath(HdWallet.path + "/0/1")];
//   }

//   localStorage.setItem("childWallets", JSON.stringify(childWallets));
//   return true;
// }

export function createHdWalletChild() {
  const HdWallet = createHdWallet(); // Generate master HD wallet

  // Derive first standard Ethereum child: m/44'/60'/0'/0/0
  const child = HdWallet.derivePath("m/44'/60'/0'/0/0");

  // Store private key of derived child in localStorage for later use
  localStorage.setItem("privateKey", child.privateKey);

  // Optional: also store a list of derived wallets
  let childWallets = localStorage.getItem("childWallets");
  if (childWallets) {
    childWallets = JSON.parse(childWallets);
    childWallets.push(child.address);
  } else {
    childWallets = [child.address];
  }

  localStorage.setItem("childWallets", JSON.stringify(childWallets));

  return {
    address: child.address,
    privateKey: child.privateKey,
    mnemonic: HdWallet.mnemonic.phrase,
  };
}


//  Get ETH balance
// export async function getBalance(network, address) {
//   const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC[network]);
//   try {
//     const balance = await provider.getBalance(address);
//     console.log(`Balance in Wei: ${balance.toString()}`);
//     return balance;
//   } catch (error) {
//     console.error(`Error fetching balance: ${error}`);
//     throw error;
//   }
// }

export async function sendTransaction(amount, receiver, network = 'sepolia') {
  try {
    // Get private key from localStorage (you should encrypt this in production)
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) {
      throw new Error("Private key not found. Please import your wallet first.");
    }

    // Validate inputs
    if (!amount || parseFloat(amount) <= 0) {
      throw new Error("Invalid amount");
    }

    if (!ethers.utils.isAddress(receiver)) {
      throw new Error("Invalid receiver address");
    }

    // Set up provider and wallet
    const rpcUrl = ALCHEMY_RPC[network];
    if (!rpcUrl) {
      throw new Error(`Unsupported network: ${network}`);
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Sending from wallet address:", wallet.address);
    console.log("Network:", network);

    // Check balance before sending
    const balance = await wallet.getBalance();
    const amountWei = ethers.utils.parseEther(amount);
    
    if (balance.lt(amountWei)) {
      throw new Error("Insufficient balance");
    }

    // Get current gas price and estimate gas limit
    const gasPrice = await provider.getGasPrice();
    const gasLimit = ethers.BigNumber.from("21000"); // Standard ETH transfer
    
    // Calculate total cost (amount + gas fees)
    const gasCost = gasPrice.mul(gasLimit);
    const totalCost = amountWei.add(gasCost);
    
    if (balance.lt(totalCost)) {
      throw new Error("Insufficient balance for transaction + gas fees");
    }

    // Get network chain ID
    const chainId = network === 'sepolia' ? 11155111 : 1;

    // Build transaction
    const tx = {
      to: receiver,
      value: amountWei,
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      nonce: await provider.getTransactionCount(wallet.address, 'pending'),
      chainId: chainId,
    };

    console.log("Transaction details:", {
      to: tx.to,
      value: ethers.utils.formatEther(tx.value),
      gasPrice: ethers.utils.formatUnits(tx.gasPrice, 'gwei'),
      gasLimit: tx.gasLimit.toString(),
      nonce: tx.nonce,
      chainId: tx.chainId
    });

    // Send transaction
    const txResponse = await wallet.sendTransaction(tx);
    console.log("Transaction sent:", txResponse.hash);

    // Wait for confirmation (optional - you can remove this for faster UX)
    console.log("Waiting for confirmation...");
    const receipt = await txResponse.wait(1); // Wait for 1 confirmation
    console.log("Transaction confirmed:", receipt);

    return {
      success: true,
      hash: txResponse.hash,
      receipt,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
      value: ethers.utils.formatEther(amountWei)
    };

  } catch (error) {
    console.error("Transaction failed:", error);
    
    // Handle specific error types
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error("Insufficient funds for transaction");
    } else if (error.code === 'NONCE_EXPIRED') {
      throw new Error("Transaction nonce expired. Please try again.");
    } else if (error.code === 'REPLACEMENT_UNDERPRICED') {
      throw new Error("Transaction underpriced. Please increase gas price.");
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error("Network error. Please check your connection.");
    }

    throw error;
  }
}

export async function getBalance(network, address) {
  try {
    const rpcUrl = ALCHEMY_RPC[network];
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    return await provider.getBalance(address);
  } catch (error) {
    console.error("Error getting balance:", error);
    throw error;
  }
}

// Hex to decimal
export function hexToDecimal(hex) {
  return parseInt(hex, 16);
}

//  Sign TX (basic)
export async function signTX(data) {
  const privateKey = localStorage.getItem("privateKey");
  if (!privateKey) throw new Error("Private key not found");

  const signer = new ethers.Wallet(privateKey);
  return await signer.signTransaction(data);
}

//  Sign TX with gas fields + nonce (advanced)
export async function signTX2(data) {
  const privateKey = localStorage.getItem("privateKey");
  if (!privateKey) throw new Error("Private key not found");

  const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC[network]);
  const wallet = new ethers.Wallet(privateKey, provider);

  const txData = {
    ...data,
    nonce: await provider.getTransactionCount(wallet.address),
    gasLimit: ethers.utils.hexlify(21000),
    gasPrice: await provider.getGasPrice(),
    chainId: 11155111, 
  };

  return await wallet.signTransaction(txData);
}


// export async function sendTransaction(amount, receiver) {

//   const privateKey = localStorage.getItem("privateKey");
//   if (!privateKey) throw new Error("Private key not found");

//   const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC.sepolia); 
//   const wallet = new ethers.Wallet(privateKey, provider);

//   const tx = {
//     to: receiver,
//     value: ethers.utils.parseEther(amount),
//     gasLimit: 21000,
//     gasPrice: await provider.getGasPrice(),
//     nonce: await provider.getTransactionCount(wallet.address),
//     chainId: network === 'sepolia' ? 11155111 : 1, // fallback for mainnet
//   };

//   try {
//     const txResponse = await wallet.sendTransaction(tx);
//     console.log("Transaction sent:", txResponse);
//     const receipt = await txResponse.wait();
//     console.log("Transaction mined:", receipt);

//     return {
//       success: true,
//       hash: txResponse.hash,
//       receipt,
//     };
//   } catch (error) {
//     console.error("Error sending transaction:", error);
//     return {
//       success: false,
//       error: error.message || "Unknown error",
//     };
//   }
// }

// export async function sendTransaction(amount, receiver) {
// //   const privateKey = localStorage.getItem("privateKey");
// //   if (!privateKey) throw new Error("Private key not found");
//     const privateKey = "0x7016a068b9602cbab81958783909ab5ed86bb02aa50cf7c106ab70ac8b6afea4";

//   const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC.sepolia);
//   const wallet = new ethers.Wallet(privateKey, provider);

//   console.log("Sending from wallet address:", wallet.address);

//   const tx = {
//     to: receiver,
//     value: ethers.utils.parseEther(amount),
//     gasLimit: 21000,
//     gasPrice: await provider.getGasPrice(),
//     nonce: await provider.getTransactionCount(wallet.address),
//     chainId: network === 'sepolia' ? 11155111 : 1,
//   };

//   try {
//     const txResponse = await wallet.sendTransaction(tx);
//     console.log("Transaction sent:", txResponse);
//     const receipt = await txResponse.wait();
//     console.log("Transaction mined:", receipt);

//     return {
//       success: true,
//       hash: txResponse.hash,
//       receipt,
//     };
//   } catch (error) {
//     console.error("Error sending transaction:", error);
//     return {
//       success: false,
//       error: error.message || "Unknown error",
//     };
//   }
// }

export async function estimateGas(network, from, to, amount) {
  try {
    const rpcUrl = ALCHEMY_RPC[network];
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    const gasEstimate = await provider.estimateGas({
      from: from,
      to: to,
      value: ethers.utils.parseEther(amount)
    });
    
    return gasEstimate;
  } catch (error) {
    console.error("Error estimating gas:", error);
    // Return default gas limit for ETH transfers
    return ethers.BigNumber.from("21000");
  }
}

//  Send signed TX using default signer (cleaned)
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

// Alternate version with static privateKey (dev)
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