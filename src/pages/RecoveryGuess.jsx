import React, { useEffect } from "react";
import { useNavigate, useLocation, replace } from "react-router-dom";
import { useForm } from "react-hook-form";
import { replaceRandomMnemonics, validateMnemonics, arraysEqual } from "../utils/helpers";
import { toast } from "react-toastify";

const RecoveryGuess = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;

  
  console.log(errors)
  
  const location = useLocation();
  
  const mnemonic = location.state?.mnemonic;
  // console.log(mnemonic)
  const seedPhrases = mnemonic ? mnemonic.split(" ") : [];


  const newSeedPhrase = replaceRandomMnemonics(seedPhrases);

  useEffect(() => {
    function setPhrase() {
      newSeedPhrase.forEach((phrase, index) => {
        setValue((index + 1).toString(), phrase);
      });
    }
  
    setPhrase();
  }, []);

  const onSubmit = (data) => {
    console.log(data)
    let guessedPhrase = [];
    
    Object.values(data).forEach(value => {
      guessedPhrase.push(value)
    });

    console.log(newSeedPhrase, guessedPhrase)
    const isValid = validateMnemonics(seedPhrases, guessedPhrase)
    
    if(isValid) {
      toast.success("Success")
      navigate("/send-receive"); 
    }else{
      toast.error("Invalid phrase")
    }
  }


  return (
    <div className="mt-8">
      <h3 className="text-white text-center text-[18px]">
        Confirm Secret Recovery Phrase
      </h3>
      <h2 className="text-[#fa4f24] mt-20 text-center">
        confirm secret recovery phrase
      </h2>
      <form className="flex flex-wrap justify-between gap-2 pt-4 px-2 mb-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="h-[236px] mx-auto mt-8 text-center w-[319px] rounded-[10px] bg-primary-100">
        <div className="grid grid-cols-3 gap-4 px-4 pt-10">
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["1"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("1", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["2"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("2", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["3"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("3", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["4"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("4", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["5"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("5", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["6"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("6", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["7"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("7", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["8"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("8", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["9"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("9", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["10"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("10", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["11"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("11", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />
          <input
            type="text"
            className={`rounded-lg w-20 text-center ${errors["12"] ?"border-red-700": "border-none"}`}
            placeholder=""
            {...register("12", {validate: (value) => {
              if(!value) return "All field are required"
            }})}
          />

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
