import React, { useState } from "react";
import Logo from "../assets/images/onfuse-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';


const Landing = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false); 

  const handleSignup = () => {
    setClicked(true);
    setTimeout(() => {
      navigate("/signup");
    }, 500); 
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center">
        <div className="flex items-center ">
          <img src={Logo} alt="Onfuse logo" className="w-40 mx-auto" />
        </div>
       <div className="py-2 mb-4 bg-gradi">
          <TypeAnimation
            sequence={[
              "Welcome to ONFUSE",
              2000,
              "",
              500,
            ]}
            speed={60}
            repeat={Infinity}
            className="text-white text-2xl md:text-3xl font-bold"
          />
        </div>
        <div className="text-left">
        <p className="text-2xl font-bold max-w-xl pt-2 my-4 break-words bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
  Most Easiest and Secure <br /> Crypto Wallet
</p>

          <p className="text-white break-words">
            Securely store and manage all your crypto<br />
             in one place.
          </p>
        </div>
        <div className="space-y-5 justify-center mt-10">
   <div className="flex items-center justify-center ">
  <button
    onClick={handleSignup}
    className="relative overflow-hidden rounded-full w-[250px] py-2 bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 px-8 flex items-center justify-start gap-6 group"
  >
    <motion.div
      initial={{ x: 0 }}
      animate={{
        x: clicked ? 170 : 0,
      }}
      whileHover={{
        x: clicked ? 180 : 12,
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
      className="bg-white p-1 rounded-full z-20"
    >
      <ArrowRight className="text-xl text-gray-400" />
    </motion.div>

    <motion.span
      initial={{ opacity: 1 }}
      animate={{ opacity: clicked ? 0 : 1 }}
      transition={{ duration: 0.3 }}
      className="z-10 text-md"
    >
      Let's Start
    </motion.span>
  </button>
</div>


          <Link to="/login">
            <p className="text-gray-400 underline mt-4 text-sm">
              I already have an account
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
