import React, { useContext, useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { GoCopy } from 'react-icons/go';
import { ThemeContext } from './Theme';

const ViewKey = () => {
  const { theme } = useContext(ThemeContext)
  const [showkey, setShowkey] = useState(false);
  const storedKey = localStorage.getItem('privateKey');
  console.log(storedKey)

  // Destructure location state to get passphrase and hashedPassword
  const { key, hashedKey } = location.state || {};
  return (
    <div className=''>
      <div className='space-y-5 mt-4 flex flex-col justify-center'>
        <h1 className=' text-center font-semibold'>Private Key</h1>
        <h2 className='mx-6 p-2 '>These words are the keys to your wallet</h2>
        <div className={`rounded-3xl  mx-auto my-4 text-center w-[319px] h-[300px] p-2 ${theme === "light" ? "bg-[#18171C] text-white" : "bg-white text-black"
          }`}>
          {/* Hidden and visible phrases */}
          <div className="w-full overflow-auto break-words rounded-md text-xl p-3">
            {storedKey}
          </div>
        </div>
        <div className="flex items-center gap-3 w-[300px] justify-center p-2 ml-4 mt-4 mb-4">

          <div className="text-purple-700 text-sm flex justify-center items-center space-x-1">
            <GoCopy />
            <span>Copy to clipboard</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewKey