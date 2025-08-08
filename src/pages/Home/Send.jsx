import React, { useState, useEffect, useContext } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineQrcode } from "react-icons/ai";
import blockies from "ethereum-blockies";
import jsQR from "jsqr";
import { sendTransaction, getBalance } from "../../utils/walletUtils";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RotatingLines } from 'react-loader-spinner';
import { ThemeContext } from "../Profile/Theme";

const Send = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [balance, setBalance] = useState("0");
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [gasPrice, setGasPrice] = useState("0.001");
  const [network] = useState('sepolia'); // You can make this dynamic
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Load user accounts from localStorage
  useEffect(() => {
    const getUserAccounts = () => {
      const savedAccounts = localStorage.getItem('userAccounts');
      if (savedAccounts) {
        const accountsData = JSON.parse(savedAccounts);
        // Generate Blockies avatar for each account if not present
        const updatedAccounts = accountsData.map((account) => ({
          ...account,
          profilePicUrl: account.profilePicUrl || blockies.create({ seed: account.publicAddress }).toDataURL(),
        }));
        setAccounts(updatedAccounts);
        if (updatedAccounts.length > 0) {
          setSelectedAccount(updatedAccounts[0]);
          fetchBalance(updatedAccounts[0].publicAddress);
        }
      }
    };
    getUserAccounts();
  }, []);

  // Fetch real balance for selected account
  const fetchBalance = async (address) => {
    if (!address) return;
    
    setLoadingBalance(true);
    try {
      const balanceWei = await getBalance(network, address);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(6));
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Failed to fetch balance");
      setBalance("0");
    } finally {
      setLoadingBalance(false);
    }
  };

  // Estimate gas price (you can enhance this with real gas estimation)
  useEffect(() => {
    const estimateGas = async () => {
      try {
        // You can implement real gas estimation here
        // For now, using a reasonable default
        setGasPrice("0.001");
      } catch (error) {
        console.error("Error estimating gas:", error);
        setGasPrice("0.001");
      }
    };
    estimateGas();
  }, [network]);

  const handleSend = async () => {
    // Comprehensive validation
    if (!inputAmount) {
      toast.error("Please enter an amount");
      return;
    }
    
    if (!inputAddress) {
      toast.error("Please enter a recipient address");
      return;
    }
    
    if (parseFloat(inputAmount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    
    if (!ethers.utils.isAddress(inputAddress)) {
      toast.error("Invalid Ethereum address");
      return;
    }
    
    if (parseFloat(inputAmount) > parseFloat(balance)) {
      toast.error("Insufficient balance");
      return;
    }

    // Check if user has enough for gas fees
    const totalNeeded = parseFloat(inputAmount) + parseFloat(gasPrice);
    if (totalNeeded > parseFloat(balance)) {
      toast.error("Insufficient balance for transaction + gas fees");
      return;
    }

    if (!selectedAccount) {
      toast.error("No account selected");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending transaction:", {
        amount: inputAmount,
        to: inputAddress,
        from: selectedAccount.publicAddress,
        network: network
      });

      const result = await sendTransaction(inputAmount, inputAddress, network);
      
      if (result && result.success) {
        toast.success("Transaction sent successfully!");
        console.log("Transaction details:", result);
        
        // Show transaction hash
        if (result.hash) {
          toast.info(`Transaction Hash: ${result.hash.slice(0, 10)}...`);
        }
        
        // Reset form
        setInputAmount("");
        setInputAddress("");
        
        // Refresh balance after successful transaction
        setTimeout(() => {
          fetchBalance(selectedAccount.publicAddress);
        }, 2000);
        
        // Navigate to success page or transaction history
        navigate("/send-receive");
        
      } else {
        toast.error("Transaction failed");
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      toast.error(error.message || "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectAccount = (account) => {
    setSelectedAccount(account);
    setIsDropdownOpen(false);
    fetchBalance(account.publicAddress);
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        const img = new Image();
        img.src = imageDataUrl;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          const imageData = context.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, img.width, img.height, {
            inversionAttempts: "dontInvert",
          });
          if (code) {
            const qrData = code.data;
            // Try to extract Ethereum address from QR code
            const addressMatch = qrData.match(/(0x[a-fA-F0-9]{40})/);
            if (addressMatch) {
              setInputAddress(addressMatch[1]);
              toast.success("Address extracted from QR code");
            } else {
              toast.error("No valid Ethereum address found in QR code");
            }
          } else {
            toast.error("No QR code found in the image");
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setInputAmount("");
    setInputAddress("");
    setLoading(false);
  };

  const handleMaxAmount = () => {
    if (parseFloat(balance) > 0) {
      // Leave some ETH for gas fees
      const maxAmount = Math.max(0, parseFloat(balance) - parseFloat(gasPrice)).toFixed(6);
      setInputAmount(maxAmount);
    }
  };

  return (
    <div className="flex flex-col items-center text-center mt-5 space-y-8">
      {/* Header */}
      <div className="w-72">
        <h1 className="text-2xl font-bold mb-2">Send ETH</h1>
        <p className="text-gray-400 text-sm">Transfer Ethereum to another address</p>
      </div>

      {/* From Section */}
      <div className="space-y-2 w-72">
        <h1 className="text-start ml-6">From</h1>
        <button
          className="flex items-center rounded-full border-2 text-sm w-full h-12 px-3"
          onClick={toggleDropdown}
        >
          <div className="flex items-center space-x-2 flex-1">
            <img
              src={selectedAccount ? selectedAccount.profilePicUrl : ""}
              alt="profile picture"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex flex-col items-start flex-1">
              <span className="font-medium">
                {selectedAccount ? selectedAccount.name : "Select Account"}
              </span>
              <span className="text-gray-500 text-xs">
                {selectedAccount ? truncateAddress(selectedAccount.publicAddress) : ""}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium">
                {loadingBalance ? "..." : `${balance} ETH`}
              </span>
              {isDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="mt-2 bg-primary-900 border rounded-md shadow-lg w-full">
            {accounts.map((account, index) => (
              <button
                key={index}
                className="flex justify-between items-center w-full px-3 py-2 hover:bg-primary-400"
                onClick={() => selectAccount(account)}
              >
                <div className="flex items-center">
                  <img
                    src={account.profilePicUrl}
                    alt="profile picture"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-gray-400 text-xs">
                      {truncateAddress(account.publicAddress)}
                    </span>
                  </div>
                </div>
                <span className="text-sm">{account.balance || "0.000"} ETH</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Amount Section */}
      <div className="space-y-2 w-72">
        <div className="flex justify-between items-center">
          <h1 className="text-start ml-6">Amount</h1>
          <button 
            onClick={handleMaxAmount}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors mr-6"
          >
            Max
          </button>
        </div>
        <div className="relative flex items-center">
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="border-2 border-gray-300 bg-transparent rounded-full text-sm p-3 w-full pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
            step="0.000001"
            min="0"
          />
          <div className="absolute right-4 text-gray-400 text-sm">
            ETH
          </div>
        </div>
        {inputAmount && (
          <p className="text-xs text-gray-400 ml-6">
            ≈ ${(parseFloat(inputAmount) * 2000).toFixed(2)} USD
          </p>
        )}
      </div>

      {/* To Section */}
      <div className="space-y-1 w-72">
        <h1 className="text-start ml-6">To</h1>
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            className="border-2 border-gray-300 bg-transparent rounded-full text-sm p-3 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0x742d35Cc6464C4532C87B8D59b5E93725D2c4e7F"
          />
          <label
            htmlFor="qr-upload"
            className="absolute right-3 text-gray-400 cursor-pointer hover:text-purple-400 transition-colors"
          >
            <AiOutlineQrcode className="text-xl mr-3" />
            <input
              id="qr-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Transaction Summary */}
      {inputAmount && inputAddress && selectedAccount && (
        <div className="w-72 p-4 border-2 border-gray-300 rounded-xl">
          <h3 className="text-sm font-medium mb-3">Transaction Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">From:</span>
              <span>{truncateAddress(selectedAccount.publicAddress)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">To:</span>
              <span>{truncateAddress(inputAddress)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Amount:</span>
              <span>{inputAmount} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Fee:</span>
              <span>~{gasPrice} ETH</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{(parseFloat(inputAmount) + parseFloat(gasPrice)).toFixed(6)} ETH</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <RotatingLines
          visible={true}
          height="50"
          width="50"
          color="#8b06e9"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      )}

      {/* Action Buttons */}
      <div className="w-full gap-4 px-6 flex flex-col-reverse items-center justify-center">
        <button 
          className={`hover:bg-slate-200 hover:text-primary-50 ${
            theme === "light" 
              ? "border border-primary-300 text-primary-300" 
              : "border border-primary-300 text-white"
          } w-full py-2 rounded-full`}
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 w-full mx-3 py-3 rounded-full border border-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={loading || !inputAmount || !inputAddress || !selectedAccount || parseFloat(balance) === 0}
        >
          {loading ? 'Processing...' : 'Send Transaction'}
        </button>
      </div>

      {/* Help Text */}
      <div className="w-72 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <h4 className="text-sm font-medium mb-2">💡 Important</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Verify recipient address carefully</li>
          <li>• Transactions are irreversible</li>
          <li>• Network: {network.charAt(0).toUpperCase() + network.slice(1)}</li>
          <li>• Keep some ETH for future gas fees</li>
        </ul>
      </div>
    </div>
  );
};

export default Send;