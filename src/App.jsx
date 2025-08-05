import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

// Home
import Home from "./pages/Home/Home";
import Send from "./pages/Home/Send";
import Receive from "./pages/Home/Receive";

import Landing from "./pages/Landing";

// Profile Imports
import Profile from "./pages/Profile/Profile";
import Currency from "./pages/Profile/Currency";
import Network from "./pages/Profile/EthNetwork";
import Theme, { ThemeContext } from "./pages/Profile/Theme";
import SeedPhrase from "./pages/Profile/ShowPhrase";
import PrivateKey from "./pages/Profile/ViewKey"

//Components 
import Navbar from "./components/Navbar/Navbar";
import Header from "./components/Header";

//Pages Imports
import Exchange from "./pages/Exchange";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";

//Signup Imports
import SerectRecovery from "./pages/SerectRecovery";
import SerectRecoveryHidden from "./pages/SerectRecoveryHidden";
import RecoveryGuess from "./pages/RecoveryGuess";
import Login from "./components/Login/Login";
import SignUp from "./pages/SignUp";
import CreatePassword from "./pages/CreatePassword";
import ImportWallet from "./pages/ImportWallet";

// Define a separate component for routing
function AppRoutes() {

  const { theme, toggleTheme } = useContext(ThemeContext)

    useEffect(()=>{
  
  },[theme])

  const location = useLocation(); 

  // Determine if the Navbar should be displayed
  const showNavbar = !["/", "/Landing", "/signup", "/create-password", "/secret-recovery", "/recovery-guess", "/import-wallet", "/login"].includes(location.pathname);

   const showHeader = !["/", "/Landing", "/signup", "/create-password", "/secret-recovery", "/recovery-guess", "/import-wallet", "/login"].includes(location.pathname);

  return (
    <>
    <ToastContainer />
    <div className={`w-[350px] min-h-screen overflow-hidden`}>

      {showHeader && <Header />  }
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/send-receive" element={<Home />} />
        <Route path="/send-token" element={<Send />} />
        <Route path="/receive-token" element={<Receive />} />
        <Route path="/transactions" element={<Transactions />} />
        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/currency" element={<Currency />} />
        <Route path="/network" element={<Network />} />
        <Route path="/theme" element={<Theme />} />
        <Route path="/seed-phrase" element={<SeedPhrase />} />
        <Route path="/private-key" element={<PrivateKey />} />
       

        <Route path="/signup" element={<SignUp />} />
        <Route path="/import-wallet" element={<ImportWallet/>} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/secret-recovery" element={<SerectRecovery />} />
        <Route path="/secret-Recovery-hidden" element={<SerectRecoveryHidden />} />
        <Route path="/recovery-guess" element={<RecoveryGuess />} />
      </Routes>
      {showNavbar && <Navbar />}
    </div>
    </>
  );
}

function App() {
  const [isLightMode, setIsLightMode] = useState(false);

  // Function to toggle between dark and light mode
  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    document.body.classList.toggle("light", !isLightMode); 
  };

  return (
    <Router>
      <AppRoutes isLightMode={isLightMode} toggleTheme={toggleTheme} />
    </Router>
  );
}

export default App;
