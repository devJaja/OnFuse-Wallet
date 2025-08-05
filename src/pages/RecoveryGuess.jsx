import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { replaceRandomMnemonics, validateMnemonics } from "../utils/helpers";
import { toast } from "react-toastify";
import ThemeBtn from "../components/themeBtn/ThemeBtn";
import { ThemeContext } from "./Profile/Theme";

const RecoveryGuess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext)


  const { register, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;

  const mnemonic = location.state?.mnemonic;
  const seedPhrases = mnemonic ? mnemonic.split(" ") : [];

  const newSeedPhrase = replaceRandomMnemonics(seedPhrases);

  useEffect(() => {
    newSeedPhrase.forEach((phrase, index) => {
      setValue((index + 1).toString(), phrase);
    });
  }, [newSeedPhrase, setValue]);

  const onSubmit = (data) => {
    const guessedPhrase = Object.values(data);
    const isValid = validateMnemonics(seedPhrases, guessedPhrase);

    if (isValid) {
      toast.success("Success");
      navigate("/send-receive");
    } else {
      toast.error("Invalid phrase");
    }
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
          confirm secret recovery phrase
        </h2>
      </div>
      <div className=" mx-auto text-center w-full max-w-[400px] rounded-[10px] p-4 overflow-auto">
        {/* Hidden and visible phrases */}
        <form
          className="flex flex-wrap justify-center  gap-2 pt-4 px-2 mb-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <div className={`rounded-3xl  mx-auto my-4 text-center w-[319px] p-2 ${theme === "light" ? "bg-[#18171C] text-white" : "bg-white text-black"
          }`}>
              <div className="grid grid-cols-3 gap-4 px-4 py-6">
                {[...Array(12)].map((_, index) => {
                  const fieldName = (index + 1).toString();
                  return (
                    <input
                      key={fieldName}
                      type="text"
                      className={`rounded-lg p-1 w-20 text-black border-gray-500 text-center ${errors[fieldName] ? "border border-red-700" : "border-none"
                        }`}
                      placeholder=""
                      {...register(fieldName, {
                        validate: (value) => !!value || "This field is required",
                      })}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#5865F2] bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 w-[250px] py-2 rounded-full border border-white"
          >
            Next
          </button>
        </form>
      </div>
    </div>

  );
};

export default RecoveryGuess;
