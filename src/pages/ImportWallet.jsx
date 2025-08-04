import React, { useState } from 'react'
import { ethers } from 'ethers';



const ImportWallet = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);

  const handleImport = () => {
    setError(""); 
    try {
      const cleaned = mnemonic.trim().toLowerCase();
      const words = cleaned.split(/\s+/);


      if (words.length !== 12) {
        throw new Error("Seed phrase must contain exactly 12 words.");
      }

     
      if (!ethers.utils.isValidMnemonic(cleaned)) {
        throw new Error("Invalid seed phrase. Check for typos or incorrect words.");
      }

      const hdNode = ethers.utils.HDNode.fromMnemonic(cleaned);
      const wallet = hdNode.derivePath("m/44'/60'/0'/0/0");


      localStorage.setItem("walletAddress", wallet.address);
      localStorage.setItem("privateKey", wallet.privateKey);
      localStorage.setItem("mnemonic", cleaned);

     
      setWalletAddress(wallet.address);
      console.log("Imported wallet:", wallet.address);
    } catch (err) {
      console.error("Import error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex gap-1 items-center">
        <h3 className="text-white text-center text-[18px]">
          Confirm Secret Recovery Phrase
        </h3>
      </div>

      <h2 className="text-[#FF2CDF] mt-20 text-center">
        confirm secret recovery phrase
      </h2>

      <form
        onSubmit={handleImport}
        className="h-auto mx-auto mt-8 text-center w-[319px] rounded-[10px] bg-primary-300 p-4"
      >
        <p className="text-sm text-white mb-2">
          Enter your 12-word phrase. Separate each word with a space.
        </p>

        <textarea
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          rows={4}
          placeholder="e.g. goat float ramp jump mother fuse flash block demand flash goat float"
          className="w-full text-black rounded-lg p-2 resize-none"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="mt-6 text-white text-lg rounded-3xl px-2 py-1 w-[251px] bg-gradient-to-r from-primary-50 to-primary-100 hover:bg-opacity-75"
        >
          Confirm
        </button>

        {walletAddress && (
          <p className="mt-4 text-green-400 break-words text-sm">
            ✅ Wallet Address: <br /> {walletAddress}
          </p>
        )}
      </form>
    </div>
  );

}

export default ImportWallet