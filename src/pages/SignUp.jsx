import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/images/onfuse-logo.png";
import ThemeBtn from '../components/themeBtn/ThemeBtn';
import { ThemeContext } from './Profile/Theme';
import { toast } from 'react-toastify';


const SignUp = () => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext)


  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleCreateWallet = () => {
    if (isChecked) {

      // Proceed to the next page
      navigate('/create-password');
    } else {
      toast('Please agree to the terms first.');
    }
  };

  const handleImportWallet = () => {
    if (isChecked) {
      navigate('/import-wallet');
    } else {
      toast('Please agree to the terms first.');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center mt-8 py-8 '>
      <div className="w-full flex justify-end px-4 items-end">
        <ThemeBtn />
      </div>
      <div className='flex flex-col items-center space-y-2'>
        <h1 className=' text-3xl'>Let's get started</h1>
        <p className='text-xl'>Create Wallet</p>
      </div>
      <div className='space-y-6 flex flex-col items-center mt-8'>
        <img src={Logo} alt='Onfuse Logo' className='w-32' />

        <div className='mx-3 rounded-3xl p-6'>
          <div className='flex items-center space-x-2 mb-4 justify-center'>
            <input
              type='checkbox'
              className='w-18'
              onChange={handleCheckboxChange}
            />
            <p className=''>
              I agree to Onfuse's{' '}
              <a href='#' target='_blank'>
                <span className='text-purple-500 text-sm underline'>Terms of Use</span>
              </a>
            </p>
          </div>
          <div className='flex flex-col items-center space-y-5'>
            <button
              className='bg-gradient-to-r from-primary-50 via-primary-200 to-primary-300 text-primary-400 w-[250px] py-2 rounded-full border border-white'
              onClick={handleCreateWallet}
            >
              Create a new wallet
            </button>
            <button
              className={`${theme === "light" ? "border border-primary-300 text-primary-300" : "border border-primary-300 text-white"} w-[250px] py-2 rounded-full`}
            onClick={handleImportWallet}
            >
            Import an existing wallet
          </button>
        </div>
      </div>
    </div>
    </div >
  );
};

export default SignUp;
