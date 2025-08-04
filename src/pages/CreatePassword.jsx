import React, { useState } from "react";
import Joi from "joi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import blockies from "ethereum-blockies";
import { createHdWallet } from "../utils/walletUtils";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Schema definition
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .max(32)
      .pattern(/^[\w!@#\$%\^&*()_+=\-{}\[\]:;"'<>,.?/\\|~`]+$/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters.",
        "string.max": "Password must not exceed 32 characters.",
        "string.pattern.base": "Password contains invalid characters.",
        "string.empty": "Password is required.",
      }),
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
        "any.required": "Confirm password is required.",
      }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = schema.validate(
      { password, confirmPassword },
      { abortEarly: false }
    );

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      setErrorMessage(messages.join(" "));
      return;
    }

    if (!isChecked) {
      setErrorMessage("Please agree to the terms first.");
      return;
    }

    try {
      const HdWallet = createHdWallet();
      const Mnemonic = HdWallet.mnemonic.phrase;
      const address = HdWallet.address;
      const PrivateKey = HdWallet.privateKey;
      const publicKey = HdWallet.publicKey;

      localStorage.setItem("mnemonic", Mnemonic);
      localStorage.setItem("address", address);
      localStorage.setItem("privateKey", PrivateKey);
      localStorage.setItem("PublicKey", publicKey);

      const accounts = [
        {
          name: "Account 1",
          publicAddress: address,
          profilePicUrl: blockies.create({ seed: address }).toDataURL(),
        },
      ];

      localStorage.setItem("userAccounts", JSON.stringify(accounts));

      navigate("/secret-recovery", {
        state: { mnemonic: Mnemonic },
      });
    } catch (err) {
      console.error("Error creating new wallet", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleCheckbox = (e) => {
    setIsChecked(e.target.checked);
    setErrorMessage(""); // Clear error when checked
  };

  const handleImportWallet = () => {
    if (isChecked) {
      navigate("/import-wallet");
    } else {
      alert("Please agree to the terms first.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-5">
      {/* Row One */}
      <div className="text-center text-primary-400">
        <h1 className="text-xl mb-2">Create Password</h1>
        <p className="text-sm m-5">
          This password will unlock your Onfuse wallet only on this device.
          Onfuse cannot recover this password.
        </p>
      </div>

      {/* Row Two - Password Fields */}
      <div className="space-y-4">
        {/* Password */}
        <div className="relative flex items-center w-[300px]">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            className="border-2 border-gray-300 bg-transparent rounded-full px-4 text-primary-400 text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Password (8 characters min)"
          />
          <div
            className="absolute right-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IoEyeOffOutline className="text-white" />
            ) : (
              <IoEyeOutline className="text-white" />
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative flex items-center w-[300px]">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage("");
            }}
            className="border-2 border-gray-300 bg-transparent rounded-full text-primary-400 px-4 text-sm p-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
          />
          <div
            className="absolute right-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <IoEyeOffOutline className="text-white" />
            ) : (
              <IoEyeOutline className="text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Row Three - Terms and Buttons */}
      <div className="flex flex-col items-center space-y-3 mt-4">
        {errorMessage && (
          <div className="text-red-500 text-center w-[300px] whitespace-pre-wrap">
            {errorMessage}
          </div>
        )}

        <div className="flex items-start space-x-1">
          <input
            type="checkbox"
            className="w-5 h-5 mt-2 ml-5"
            onChange={handleCheckbox}
            checked={isChecked}
          />
          <p className="text-sm text-primary-400 p-6">
            I understand that Onfuse cannot recover this password for me.{" "}
            <span className="text-blue-500 underline">Learn more</span>
          </p>
        </div>

        <button
          className="bg-[#5865F2] text-primary-400 w-[200px] py-2 rounded-full"
          onClick={handleSubmit}
        >
          Create a new wallet
        </button>

        <p
          className="text-gray-500 underline cursor-pointer"
          onClick={handleImportWallet}
        >
          I already have an account
        </p>
      </div>
    </div>
  );
};

export default CreatePassword;
