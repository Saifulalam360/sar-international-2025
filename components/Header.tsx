import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCog, faBell, faChevronDown, faBars, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  toggleSidebar: () => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onNavigate }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
      setIsNotificationsOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="flex justify-between items-center bg-[#161B22] p-4 md:p-5 rounded-xl">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          <FontAwesomeIcon icon={faBars} size="lg"/>
        </button>
        <p className="hidden md:block text-sm text-gray-500">SAR INTERNATIONAL - Calendar</p>
      </div>

      <div className="hidden md:block relative w-full max-w-xs lg:max-w-sm">
        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search Projects..." 
          className="w-full bg-[#0D1117] border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
        />
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="md:hidden text-gray-400 hover:text-white">
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>

        <div className="relative" ref={notificationsRef}>
          <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faBell} size="lg" />
            <span className="absolute -top-1 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 items-center justify-center text-xs">7</span>
            </span>
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0D1117] border border-gray-700 rounded-lg shadow-xl z-20">
              <div className="p-4 font-bold border-b border-gray-700">Notifications</div>
              <ul>
                <li className="p-4 border-b border-gray-700 hover:bg-[#161B22] cursor-pointer">
                  <p className="font-semibold">New event added</p>
                  <p className="text-xs text-gray-400">Your meeting is scheduled for tomorrow.</p>
                </li>
                <li className="p-4 border-b border-gray-700 hover:bg-[#161B22] cursor-pointer">
                  <p className="font-semibold">Task Reminder</p>
                  <p className="text-xs text-gray-400">"Finish project report" is due today.</p>
                </li>
                <li className="p-4 hover:bg-[#161B22] cursor-pointer">
                  <p className="font-semibold">System Update</p>
                  <p className="text-xs text-gray-400">Version 2.5 is now available.</p>
                </li>
              </ul>
              <div className="p-2 text-center text-sm text-blue-400 hover:underline cursor-pointer">
                View all notifications
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3">
              <img src="https://picsum.photos/id/237/40/40" alt="User" className="w-10 h-10 rounded-full" />
              <div className="hidden md:block">
                <p className="font-semibold text-sm">SAIFUL ALAM RAFI</p>
                <p className="text-xs text-gray-500">SYSTEM ADMINISTRATOR</p>
              </div>
              <div className="hidden md:block text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </button>
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0D1117] border border-gray-700 rounded-lg shadow-xl z-20 py-2">
                    <button onClick={() => { onNavigate('Settings', { adminId: 1 }); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#161B22]">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4"/>
                        Profile
                    </button>
                     <button onClick={() => { onNavigate('Settings'); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#161B22]">
                        <FontAwesomeIcon icon={faCog} className="w-4 h-4"/>
                        Settings
                    </button>
                    <div className="border-t border-gray-700 my-2"></div>
                    <button onClick={() => { /* Logout */ setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#161B22]">
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4"/>
                        Logout
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
