import React, { useContext, useState } from "react";
import { GoCopy } from "react-icons/go";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeBtn from "../components/themeBtn/ThemeBtn";
import { ThemeContext } from "./Profile/Theme";

const SecretRecovery = () => {
  // State to toggle the visibility of the phrases
  const [showPhrase, setShowPhrase] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
    const { theme } = useContext(ThemeContext)
  

  const navigate = useNavigate();
  const location = useLocation();


  const mnemonic = location.state?.mnemonic;

  // // Handle undefined passphrase case by setting a fallback
  const seedPhrases = mnemonic ? mnemonic.split(" ") : [];

  // Function to copy seed phrases to clipboard
  const handleCopy = () => {
    if (mnemonic) {
      navigator.clipboard
        .writeText(mnemonic)
        .then(() => {
          setCopySuccess("Copied!");
          setTimeout(() => setCopySuccess(""), 2000); // Reset success message after 2 seconds
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleSecretGuess = () => {
    navigate("/recovery-guess", {
      state: { mnemonic: mnemonic }
    });

  };

  return (
    <div className="h-[600px] flex flex-col items-center py-8  overflow-auto">
      <div className="w-full flex justify-end px-4 items-end mb-4 ">
        <ThemeBtn />
      </div>

      <h3 className="text-center text-lg mb-4">
        Write down your Secret Recovery Phrase
      </h3>
      <div className={` ${theme === "light" ? " text-primary-300" : " text-white"} text-[13px] rounded-full`}>
        <h2 >
          Tips to safeguarding your secret recovery phrases:
        </h2>
        <ul className="list-disc pl-4 mb-4 ">
          <li>Save in a password manager</li>
          <li>Store in a safe deposit box</li>
          <li>Write down and store in multiple secret places</li>
        </ul>
      </div>
      <div className=" mx-auto text-center w-full max-w-[400px] rounded-[10px] p-4 overflow-auto">
        {/* Hidden and visible phrases */}
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          {seedPhrases.map((phrase, index) => (
            <span
              key={index}
              className={`rounded-lg w-[30%] text-center border border-gray-500 bg-black py-1 ${showPhrase ? "bg-opacity-50" : "bg-opacity-10"
                }`}
            >
              {showPhrase ? phrase : "****"}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-[400px] px-6 py-4 mb-2">
        <div className="text-sm flex items-center  space-x-2">
          {showPhrase ? (
            <IoEyeOutline
              onClick={() => setShowPhrase(false)}
              className="cursor-pointer text-xl"
            />
          ) : (
            <IoEyeOffOutline
              onClick={() => setShowPhrase(true)}
              className="cursor-pointer text-xl"
            />
          )}
          <span className="text-sm">Show seed phrase</span>
        </div>
        <div
          className="text-purple-700 text-sm flex items-center space-x-1 cursor-pointer"
          onClick={handleCopy}
        >
          <GoCopy className="text-xl" />
          <span>Copy to clipboard</span>
          {copySuccess && (
            <span className="text-green-500 ml-2">{copySuccess}</span>
          )}
        </div>
      </div>
      <button
        className="bg-[#5865F2] bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 w-[250px] py-2 rounded-full border border-white"
        onClick={handleSecretGuess}
      >
        Next
      </button>
    </div>
  );
};

export default SecretRecovery;
