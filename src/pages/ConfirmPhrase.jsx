import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmPhrase = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Input value Submitted", inputValue);
    setInputValue("");
    handleConfirmPhrase();
  };

  const handleConfirmPhrase = () => {
    navigate("/send-receive");
  };

  // 12 seed phrase inputs
  const placeholders = [
    "goat", "float", "ramp",
    "", "jump", "",
    "mother", "", "demand",
    "fuse", "flash", "block"
  ];

  return (
    <div className="mt-8">
      <div className="flex gap-1 items-center">
        <h3 className="text-white text-center text-[18px]">
          Confirm Secret Recovery Phrase
        </h3>
      </div>

      <h2 className="text-[#FF2CDF] mt-20 text-center capitalize">
        confirm secret recovery phrase
      </h2>

      <form
        onSubmit={handleSubmit}
        className="h-auto mx-auto mt-8 text-center w-[319px] rounded-[10px] bg-primary-100 pb-10"
      >
        <div className="grid grid-cols-3 gap-4 px-4 pt-10">
          {placeholders.map((placeholder, index) => (
            <input
              key={index}
              type="text"
              value={index === 0 ? inputValue : undefined}
              onChange={index === 0 ? handleInputChange : undefined}
              placeholder={placeholder}
              className="rounded-lg w-full text-center placeholder-black "
              aria-label={`Seed word ${index + 1}`}
            />
          ))}
        </div>
      </form>

      {/* Button outside the form */}
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 text-white text-lg font-semibold rounded-full px-6 py-3 w-full max-w-[251px] bg-gradient-to-r from-primary-50 to-primary-100 hover:brightness-110 transition duration-300 mx-auto block shadow-lg"
      >
        Confirm
      </button>
    </div>
  );
};

export default ConfirmPhrase;
