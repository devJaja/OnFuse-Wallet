import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import blockies from "ethereum-blockies";
import { generateMnemonic, createHdWallet } from "../utils/walletUtils";
import ThemeBtn from "../components/themeBtn/ThemeBtn";
import { toast } from "react-toastify";

const CreatePassword = () => {
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();

  // Handle checkbox
  const handleCheckbox = (e) => {
    setIsChecked(e.target.checked);
  };

  // Toggle functions for password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleImportWallet = () => {
    if (isChecked) {
      navigate('/import-wallet'); 
    } else {
      alert('Please agree to the terms first.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
  
    if (password !== confirmPassword) {
      toast("Passwords do not match");
      return;
    }
  
    if (!isChecked) {
      toast("Please agree to the terms first.");
      return;
    }
  
    try {
      const HdWallet = createHdWallet();
      const Mnemonic= HdWallet.mnemonic.phrase;
      const address = HdWallet.address;
      const PrivateKey = HdWallet.privateKey;
      const publicKey= HdWallet.publicKey;

      //Save to local Storage
      localStorage.setItem('mnemonic', Mnemonic);
      localStorage.setItem("address", address)
      localStorage.setItem("privateKey", PrivateKey)
      localStorage.setItem("PublicKey", publicKey)

      // Example account data
      let accounts = [
        { name: "Account 1", publicAddress: address, profilePicUrl: blockies.create({ seed: address }).toDataURL() }
      ];
      
      localStorage.setItem('userAccounts', JSON.stringify(accounts));

      
      
      navigate("/secret-recovery", {
        state: { mnemonic: Mnemonic }
      });
    } catch (err) {
      console.error("Error creating new wallet", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full flex justify-end px-4 items-end">
        <ThemeBtn />
      </div>
      {/* Row One */}
      <div className="text-center ">
        <h1 className="text-xl mb-2">Create Password</h1>
        <p className="text-sm m-5">
          This password will unlock your Onfuse wallet only on this device.
          Onfuse cannot recover this password.
        </p>
      </div>

      {/* Row Two */}
      <div className="space-y-4">
        <div className="relative flex items-center w-[300px]">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            className="border-2 border-gray-300 bg-transparent rounded-full px-4  text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Password (8 characters min)"
          />
          <div
            className="absolute right-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <IoEyeOffOutline className="text-white" />
            ) : (
              <IoEyeOutline className="text-white" />
            )}
          </div>
        </div>

        <div className="relative flex items-center w-[300px]">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state
            className="border-2 border-gray-300 bg-transparent rounded-full  px-4 text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
          />
          <div
            className="absolute right-3 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <IoEyeOffOutline className="text-white" />
            ) : (
              <IoEyeOutline className="text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Row Three */}
      <div className="flex flex-col items-center space-y-3">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex items-center space-x-1">
          <input
            type="checkbox"
            className="w-5 h-5 ml-5"
            onChange={handleCheckbox}
          />
          <p className="text-sm  p-6">
            I understand that Onfuse cannot recover this password for me.{" "}
            <span className="text-purple-500 underline">Learn more</span>
          </p>
        </div>
        <button
          className="bg-[#5865F2] bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 w-[250px] py-2 rounded-full border border-white"
          onClick={handleSubmit}
        
        >
          Create a new wallet
        </button>
        <p className="text-gray-500 text-[12px] underline cursor-pointer" onClick={handleImportWallet}>
          I already have an account
        </p>
      </div>
    </div>
  );
};

export default CreatePassword;
