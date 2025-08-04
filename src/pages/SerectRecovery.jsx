import React, { useState } from "react";
import { GoCopy } from "react-icons/go";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const SecretRecovery = () => {
  const [showPhrase, setShowPhrase] = useState(false);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const mnemonic = location.state?.mnemonic;
  const seedPhrases = mnemonic ? mnemonic.split(" ") : [];

  const handleCopy = () => {
    if (mnemonic) {
      navigator.clipboard
        .writeText(mnemonic)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1000); // Reset after 1s
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
    <div className="h-[600px] flex flex-col items-center p-2 overflow-auto">
      <h3 className="text-white text-center text-xl mb-4">
        Write down your Secret Recovery Phrase
      </h3>
      <h2 className="text-white text-center mb-2">
        Tips to safeguarding your secret recovery phrases:
      </h2>
      <ul className="list-disc pl-4 text-white mb-4">
        <li>Save in a password manager</li>
        <li>Store in a safe deposit box</li>
        <li>Write down and store in multiple secret places</li>
      </ul>

      <div className="h-[195px] mx-auto text-center w-full max-w-[400px] bg-[#5865F2] rounded-[10px] p-1 overflow-hidden">
        <div className="flex flex-wrap justify-between gap-2 mt-[1px]">
          {seedPhrases.map((phrase, index) => (
            <span
              key={index}
              className={`rounded-lg w-[29%] text-center text-white bg-black py-2 ${
                showPhrase ? "bg-opacity-50" : "bg-opacity-10"
              }`}
            >
              {showPhrase ? phrase : "****"}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-[1100px] gap-3 mt-4 mb-2 p-0">
        <div className="text-white text-sm flex items-center space-x-2">
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
          <span className="text-sm whitespace-nowrap">Show seed phrase</span>
        </div>

        <div
          className="text-pink-500 text-sm flex items-center space-x-1 cursor-pointer relative"
          onClick={handleCopy}
        >
          {copied ? (
            <IoCheckmarkDoneOutline className="text-green-500 text-xl" />
          ) : (
            <GoCopy className="text-xl" />
          )}
          <span className="whitespace-nowrap">
            {copied ? "Copied!" : "Copy to clipboard"}
          </span>
        </div>
      </div>

      <button
        className="mt-2 text-white rounded-full py-2 w-[250px] bg-gradient-to-r from-primary-50 to-primary-100 hover:bg-opacity-75"
        onClick={handleSecretGuess}
      >
        Next
      </button>
    </div>
  );
};

export default SecretRecovery;
