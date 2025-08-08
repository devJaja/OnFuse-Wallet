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
  const [passwordStrength, setPasswordStrength] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (!hasUpperCase) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!hasLowerCase) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!hasNumbers) {
      errors.push("Password must contain at least one number");
    }
    
    if (!hasSpecialChar) {
      errors.push("Password must contain at least one special character");
    }
    
    // Calculate strength
    let strength = "";
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, password.length >= 12].filter(Boolean).length;
    
    if (password.length === 0) {
      strength = "";
    } else if (score < 3) {
      strength = "Weak";
    } else if (score < 4) {
      strength = "Medium";
    } else {
      strength = "Strong";
    }
    
    return { errors, strength, isValid: errors.length === 0 };
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword) {
      const validation = validatePassword(newPassword);
      setValidationErrors(validation.errors);
      setPasswordStrength(validation.strength);
    } else {
      setValidationErrors([]);
      setPasswordStrength("");
    }
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // Handle checkbox
  const handleCheckbox = (e) => {
    setIsChecked(e.target.checked);
    // Clear error message when checkbox is checked
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // Toggle functions for password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleImportWallet = () => {
    if (isChecked) {
      navigate('/import-wallet'); 
    } else {
      setErrorMessage('Please agree to the terms first.');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setErrorMessage("");
    
    // Validate password
    const passwordValidation = validatePassword(password);
    
    if (!passwordValidation.isValid) {
      setErrorMessage("Please fix the password requirements below.");
      toast.error("Password does not meet requirements");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    
    if (!isChecked) {
      setErrorMessage("Please agree to the terms first.");
      toast.error("Please agree to the terms first.");
      return;
    }
    
    // Additional security check - password strength
    if (passwordStrength === "Weak") {
      setErrorMessage("Password is too weak. Please choose a stronger password.");
      toast.error("Password is too weak");
      return;
    }
    
    try {
      const HdWallet = createHdWallet();
      const Mnemonic = HdWallet.mnemonic.phrase;
      const address = HdWallet.address;
      const PrivateKey = HdWallet.privateKey;
      const publicKey = HdWallet.publicKey;

      // Save to local Storage
      localStorage.setItem('mnemonic', Mnemonic);
      localStorage.setItem("address", address);
      localStorage.setItem("privateKey", PrivateKey);
      localStorage.setItem("PublicKey", publicKey);

      // Example account data
      let accounts = [
        { 
          name: "Account 1", 
          publicAddress: address, 
          profilePicUrl: blockies.create({ seed: address }).toDataURL() 
        }
      ];
      
      localStorage.setItem('userAccounts', JSON.stringify(accounts));
      
      toast.success("Wallet created successfully!");
      
      navigate("/secret-recovery", {
        state: { mnemonic: Mnemonic }
      });
    } catch (err) {
      console.error("Error creating new wallet", err);
      setErrorMessage("An error occurred while creating your wallet. Please try again.");
      toast.error("Failed to create wallet");
    }
  };

  // Get strength color
  const getStrengthColor = (strength) => {
    switch (strength) {
      case "Weak": return "text-red-500";
      case "Medium": return "text-yellow-500";
      case "Strong": return "text-green-500";
      default: return "";
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full flex justify-end px-4 items-end">
        <ThemeBtn />
      </div>
      
      {/* Row One */}
      <div className="text-center">
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
            onChange={handlePasswordChange}
            className="border-2 border-gray-300 bg-transparent rounded-full px-4 text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Password strength indicator */}
        {password && (
          <div className="w-[300px]">
            <div className={`text-xs ${getStrengthColor(passwordStrength)}`}>
              Password Strength: {passwordStrength}
            </div>
          </div>
        )}

        {/* Password validation errors */}
        {validationErrors.length > 0 && (
          <div className="w-[300px]">
            <ul className="text-xs text-red-500 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative flex items-center w-[300px]">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="border-2 border-gray-300 bg-transparent rounded-full px-4 text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Password match indicator */}
        {confirmPassword && (
          <div className="w-[300px]">
            <div className={`text-xs ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
              {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </div>
          </div>
        )}
      </div>

      {/* Row Three */}
      <div className="flex flex-col items-center space-y-3">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded w-[300px] text-center">
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <input
            type="checkbox"
            className="w-5 h-5 ml-5"
            checked={isChecked}
            onChange={handleCheckbox}
          />
          <p className="text-sm p-6">
            I understand that Onfuse cannot recover this password for me.{" "}
            <span className="text-purple-500 underline cursor-pointer">Learn more</span>
          </p>
        </div>
        
        <button
          className="bg-[#5865F2] bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 w-[250px] py-2 rounded-full border border-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={!password || !confirmPassword || !isChecked || validationErrors.length > 0 || password !== confirmPassword}
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