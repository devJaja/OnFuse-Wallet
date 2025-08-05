import React, { useContext, useEffect, useState } from 'react'

import { CiLight } from "react-icons/ci";
import { MdLightMode } from "react-icons/md";
import { ThemeContext } from '../../pages/Profile/Theme';

const ThemeBtn = () => {

    const { theme, toggleTheme } = useContext(ThemeContext)
    const [isLight,setIsLight] = useState(true)


    useEffect(()=>{
        setIsLight(theme === 'light'? true:false)
    },[theme])

    return (
        <>
            <button onClick={toggleTheme}  className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center  text-white" aria-label="Toggle theme">
                {isLight? <MdLightMode />:<CiLight />}
            </button>
        </>
    )
}

export default ThemeBtn