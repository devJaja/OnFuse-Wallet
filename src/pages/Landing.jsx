import React from "react";
import Logo from "../assets/images/onfuse-logo.png";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
      navigate("/signup");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center">
        <div className="flex items-center mt-10">
          <img src={Logo} alt="Onfuse logo" className="w-32 mx-auto" />
        </div>
        <h1 className="text-xl text-pink-400 font-semibold mt-10">
          Welcome to Onfuse
        </h1>
        <p className="text-white mt-5 break-words">
          Sign up and come to the Onfuse world
        </p>
        <div className="space-y-5 mt-10">
          <button
            className="bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 w-[200px] py-2 rounded-full"
            onClick={handleSignup}
          >
            Let's Start
          </button>
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
