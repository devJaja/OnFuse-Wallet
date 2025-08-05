import React, { useEffect, useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { GoCopy } from 'react-icons/go';

const ShowPrivateKey = () => {
    const [showkey, setShowkey] = useState(false);
    const storedKey = localStorage.getItem('privateKey');
    console.log(storedKey)

    // Destructure location state to get passphrase and hashedPassword
  const { key, hashedKey } = location.state || {}; 

     // Handle undefined passphrase case by setting a fallback

  useEffect(()=>{
    
  }, []);
  return (
    <div>
        <div className='space-y-5 mt-4'>
            <h1 className='mx-6 p-2 text-primary-400'>These words are the keys to your wallet</h1>
            <div className='w-[300px] h-[300px] mx-6 rounded-xl bg-slate-500 p-4'>
                 {/* Hidden and visible phrases */}
        <div className="flex flex-wrap justify-between gap-2 mb-4">
            {storedKey}
        </div>
      </div>
      <div className="flex justify-between items-center gap-3 w-[300px] p-2 ml-4 mt-4 mb-4">
        <div className="text-white text-sm flex items-center space-x-2">
          {showkey ? (
            <IoEyeOutline
              onClick={() => setShowkey(false)}
              className="cursor-pointer text-xl"
            />
          ) : (
            <IoEyeOffOutline
              onClick={() => setShowkey(true)}
              className="cursor-pointer text-xl"
            />
          )}
          <span className="text-sm">Show Private Key phrase</span>
        </div>
        <div className="text-purple-700 text-sm flex justify-center border border-red-700 items-center space-x-1">
          <GoCopy />
          <span>Copy to clipboard</span>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ShowPrivateKey