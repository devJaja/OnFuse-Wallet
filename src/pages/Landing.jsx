import React, { useContext, useState } from "react";
import Logo from "../assets/images/onfuse-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TypeAnimation } from 'react-type-animation';
import Background from "../assets/images/bg-3.png"
import ThemeBtn from "../components/themeBtn/ThemeBtn";
import ThemeProvider, { ThemeContext } from "./Profile/Theme";


const Landing = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const { theme } = useContext(ThemeContext)


  const handleSignup = () => {
    setClicked(true);
    setTimeout(() => {
      navigate("/signup");
    }, 500);
  };

  return (
    <div className="flex flex-col justify-center items-center py-8 bg-gradient-to-br
  from-[#5B21B6]  via-[#9333EA]  to-[#14B8A6]" >

      <div className="w-full flex justify-end px-4 items-end">
        <ThemeBtn />
      </div>

      <div className="text-center">
        <div className="flex items-center ">
          <img src={Logo} alt="Onfuse logo" className="w-40 mx-auto" />
        </div>
        <div className="py-2 mb-4 text-center ">
          <TypeAnimation
            sequence={[
              "Welcome to ONFUSE",
              2000,
              "",
              500,
            ]}
            speed={60}
            repeat={Infinity}
            wrapper="div"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#ffffff",
            }}
            className=" text-2xl md:text-3xl font-bold"
          />
        </div>

        <div className={`mx-3 rounded-3xl p-2 ${theme === "light" ? "bg-[#18171C] text-white" : "bg-white text-black"
          }`}>
          <div className="text-left">
            <p className="text-xl font-bold max-w-xl pt-2 mt-4 mb-2 break-words text-center">
              Easy and Secure Crypto Wallet
            </p>

            <p className="text-center mx-4">
              Securely store and manage all your crypto
              in one place.
            </p>
          </div>
          <div className="space-y-5 justify-center mt-10">
            <div className="flex items-center justify-center ">
              <button
                onClick={handleSignup}
                className="relative overflow-hidden rounded-full w-[250px] bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 pr-8 flex items-center justify-start gap-6 group"
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
                  className="bg-white p-4 m-[2px] rounded-full z-20"
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
              <p className="text-purple-700 text-[12px] underline mt-4 text-sm">
                I already have an account
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;