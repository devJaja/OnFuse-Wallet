import React, { useState, useEffect, useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegCircleDot } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";
import { MdCallReceived } from "react-icons/md";
import { FaEthereum } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getBalance } from "../../utils/walletUtils";
import axios from "axios";
import { ethers } from "ethers";
import { ThemeContext } from "../Profile/Theme";

const networkColors = {
  Ethereum: "#627EEA",
  Sepolia: "#F7931A",
};

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState({
    name: "Ethereum",
    color: networkColors["Ethereum"],
  });
  const [networks, setNetworks] = useState([]);
  const [balance, setBalance] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [activeAccount, setActiveAccount] = useState(null);

  // Load networks
  useEffect(() => {
    const fetchedNetwork = [{ name: "Ethereum" }, { name: "Sepolia" }];
    const networksWithColors = fetchedNetwork.map((network) => ({
      ...network,
      color: networkColors[network.name] || "#000",
    }));
    setNetworks(networksWithColors);
  }, []);

  // Load ETH price in USD
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        setEthPrice(response.data.ethereum.usd);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };
    fetchEthPrice();
  }, []);

  // Load account from localStorage and listen for changes
  useEffect(() => {
    const loadAccount = () => {
      const storedAccounts = JSON.parse(localStorage.getItem("userAccounts"));
      if (storedAccounts && storedAccounts.length > 0) {
        setActiveAccount(storedAccounts[0]); // Set the first account as active
      } else {
        setActiveAccount(null);
      }
    };

    loadAccount(); // Load on mount

    // Listen for changes to localStorage (works across tabs)
    window.addEventListener("storage", loadAccount);

    return () => {
      window.removeEventListener("storage", loadAccount);
    };
  }, []);

  // Fetch balance whenever network or account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!activeAccount) {
        setBalance(0);
        return;
      }

      try {
        const network = selectedNetwork.name.toLowerCase();
        const address = activeAccount.publicAddress;

        const balanceBigNumber = await getBalance(network, address);
        const etherBalance = parseFloat(
          ethers.utils.formatEther(balanceBigNumber)
        );
        setBalance(etherBalance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [selectedNetwork, activeAccount]);

  // UI handlers
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectNetwork = (network) => {
    setSelectedNetwork(network);
    setIsDropdownOpen(false);
  };

  const ethBal = balance.toFixed(4);
  const dollarEquivalent = (balance * ethPrice).toFixed(2);

  return (
    <div className="flex flex-col items-center text-center mt-2 space-y-5">
      {/* Balance Row */}
      <div className="space-y-3 mb-6">
        <h1 className="text-xl">Available Balance</h1>
        <p>
          {ethBal} {selectedNetwork.name === "Ethereum" ? "ETH" : "SepoliaETH"}
        </p>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center justify-center space-x-4 rounded-full border border-primary-300 bg-white text-purple-700 w-40 py-1"
          >
            <FaRegCircleDot
              className="mr-2"
              style={{ color: selectedNetwork.color }}
            />
            <span>{selectedNetwork.name}</span>
            <IoIosArrowDown className="ml-2" />
          </button>

          {isDropdownOpen && (
            <ul className="absolute left-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
              {networks.map((network, index) => (
                <li
                  key={index}
                  onClick={() => selectNetwork(network)}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
                >
                  <FaRegCircleDot
                    className="mr-2"
                    style={{ color: network.color }}
                  />
                  <span>{network.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Transact Row */}
      <div className="flex space-x-8">
        <div className="flex flex-col items-center">
          <button
            className="rounded-full border-2 border-primary-900 p-3 flex items-center justify-center"
            onClick={() => navigate("/send-token")}
          >
            <BsSendFill size={20} className="text-primary-50" />
          </button>
          <span className="mt-1">Send</span>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="rounded-full border-2 border-primary-900 p-3 flex items-center justify-center"
            onClick={() => navigate("/receive-token")}
          >
            <MdCallReceived size={20} className="text-primary-50" />
          </button>
          <span className="mt-1">Receive</span>
        </div>
      </div>

      {/* Tokens Row */}
      <div>
        <div className="flex px-4">
          <h2 className="my-4">Tokens</h2>
        </div>
        <div
          className={`rounded-3xl w-[350px] h-screen mx-auto my-4 text-center p-2 ${
            theme === "light"
              ? "bg-[#18171C] text-white"
              : "bg-white text-black"
          }`}
        >
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center py-2 gap-2">
              <span className="border-2 border-primary-900 rounded-full p-1">
                <FaEthereum />
              </span>
              <div className="flex flex-col items-start">
                <h1 className="font-semibold">ETH</h1>
                <p>Ethereum</p>
              </div>
            </div>
            <div>
              <div className="flex flex-col items-start">
                <h1 className="font-semibold">{ethBal} ETH</h1>
                <p>${dollarEquivalent}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
