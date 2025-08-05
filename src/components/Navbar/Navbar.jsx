import React, { useContext, useState } from 'react';
import { IoSyncSharp, IoPerson, IoStatsChart, IoSwapVerticalSharp, IoCard } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../pages/Profile/Theme';

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const { theme } = useContext(ThemeContext);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-[350px] h-[70px] flex justify-center items-center rounded-t-xl z-50 transition-colors
        ${theme === 'light' ? 'bg-black border-t border-gray-700 text-white' : 'bg-white border-t border-gray-300 text-black'}`}
    >
      <ul className="flex w-[300px] justify-between">
        {[
          { icon: <IoSyncSharp />, label: 'Transactions', path: '/transactions' },
          { icon: <IoSwapVerticalSharp />, label: 'Exchange', path: '/exchange' },
          { icon: <IoCard />, label: 'Send/Receive', path: '/send-receive' },
          { icon: <IoStatsChart />, label: 'Statistics', path: '/statistics' },
          { icon: <IoPerson />, label: 'Profile', path: '/profile' },
        ].map((item, index) => (
          <li
            key={index}
            className="relative w-[60px] list-none z-10"
            onClick={() => handleItemClick(index)}
          >
            <Link to={item.path} className="flex flex-col items-center justify-center font-medium relative">
              <span
                className={`text-xl transition-transform duration-300 ${
                  activeIndex === index ? '-translate-y-8 z-10' : ''
                }`}
              >
                {item.icon}
              </span>

              <span
                className={`absolute text-xs font-semibold transition-all duration-300 ${
                  activeIndex === index ? 'opacity-100 translate-y-5' : 'opacity-0 translate-y-3'
                }`}
              >
                {item.label}
              </span>

              <span
                className={`absolute w-[45px] h-[45px] rounded-full border-2 ${
                  theme === 'light' ? 'bg-black border-white' : 'bg-white border-black'
                } transition-transform duration-300 ${
                  activeIndex === index ? '-translate-y-9 scale-100' : 'scale-0'
                }`}
              ></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
