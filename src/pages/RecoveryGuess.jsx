import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { replaceRandomMnemonics, validateMnemonics } from "../utils/helpers";
import { toast } from "react-toastify";

const RecoveryGuess = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="mt-3">
      <h2 className="mt-20 text-center text-[#f0eae9] dark:text-red-600 text-xl font-semibold">
  confirm secret recovery phrase
</h2>

      <form
        className="flex flex-wrap justify-between gap-2 pt-4 px-2 mb-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="h-[236px] mx-auto mt-8 text-center w-[319px] rounded-[10px] bg-primary-100">
          <div className="grid grid-cols-3 gap-4 px-4 pt-10">
            {[...Array(12)].map((_, index) => {
              const fieldName = (index + 1).toString();
              return (
                <input
                  key={fieldName}
                  type="text"
                  className={`rounded-lg w-20 text-center ${
                    errors[fieldName] ? "border border-red-700" : "border-none"
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

        <button
          type="submit"
          className="mt-6 ml-11 text-white text-lg rounded-3xl px-2 py-1 w-[251px] bg-gradient-to-r from-primary-50 to-primary-100 hover:bg-opacity-75"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default RecoveryGuess;
