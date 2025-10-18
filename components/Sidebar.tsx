import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NAV_LINKS } from '../constants';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import type { Administrator } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  activeView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onLogout: () => void;
  currentUser: Administrator;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, isMobileOpen, activeView, onNavigate, onLogout, currentUser }) => {
  const showFullContent = !isCollapsed || isMobileOpen;

  return (
    <aside className={`bg-[#161B22] flex-shrink-0 flex flex-col p-6 transition-all duration-300 ease-in-out fixed md:relative inset-y-0 left-0 z-30 transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${isCollapsed && !isMobileOpen ? 'w-24' : 'w-64'}`}>
      <div className={`flex items-center mb-10 h-[32px] ${!showFullContent ? 'justify-center' : 'justify-start'}`}>
        {!showFullContent ? (
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-black text-lg flex-shrink-0">
            SAR
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-black text-lg flex-shrink-0">
              SAR
            </div>
            <span className="text-xl font-bold whitespace-nowrap">INTERNATIONAL</span>
          </div>
        )}
      </div>
      
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <img src={currentUser.avatarUrl} alt={currentUser.name} className={`rounded-full mx-auto transition-all duration-300 ${!showFullContent ? 'w-16 h-16' : 'w-24 h-24'}`} />
           <span className={`absolute block rounded-full bg-cyan-400 border-2 border-[#161B22] transition-all duration-300 ${!showFullContent ? 'h-3 w-3 bottom-1 right-1' : 'h-4 w-4 bottom-1 right-1'}`}></span>
        </div>
        {showFullContent && (
            <>
                <h2 className="text-lg font-semibold mt-4 whitespace-nowrap">{currentUser.name.toUpperCase()}</h2>
                <p className="text-sm text-gray-500 whitespace-nowrap">{currentUser.role.toUpperCase()}</p>
            </>
        )}
      </div>

      <nav className="flex-1">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.name} className="relative group">
              <button
                onClick={() => onNavigate(link.name)}
                className={`flex items-center py-3 my-1 rounded-lg transition-colors duration-200 w-full ${!showFullContent ? 'justify-center' : 'px-4'} ${
                  activeView === link.name
                    ? 'bg-gray-700/50 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
                aria-label={link.name}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${!showFullContent ? '' : 'mr-4'}`}>
                    <FontAwesomeIcon icon={link.icon} className={activeView === link.name ? 'text-white' : 'text-gray-400'}/>
                </div>
                {showFullContent && <span className="whitespace-nowrap">{link.name}</span>}
              </button>
              {!showFullContent && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md shadow-lg text-sm font-semibold whitespace-nowrap bg-black/80 backdrop-blur-sm border border-gray-700 text-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out pointer-events-none z-50 scale-95 group-hover:scale-100 origin-left">
                  {link.name}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t border-gray-800 pt-4">
        <div className="relative group">
            <button
                onClick={onLogout}
                className={`flex items-center py-3 my-1 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-700/50 hover:text-white w-full ${!showFullContent ? 'justify-center' : 'px-4'}`}
                aria-label="LOGOUT"
            >
            <div className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${!showFullContent ? '' : 'mr-4'}`}>
                <FontAwesomeIcon icon={faRightFromBracket} className="text-gray-400"/>
            </div>
            {showFullContent && <span className="whitespace-nowrap">LOGOUT</span>}
            </button>
            {!showFullContent && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md shadow-lg text-sm font-semibold whitespace-nowrap bg-black/80 backdrop-blur-sm border border-gray-700 text-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out pointer-events-none z-50 scale-95 group-hover:scale-100 origin-left">
                    LOGOUT
                </div>
            )}
        </div>
        {showFullContent && (
            <div className="text-center text-xs text-gray-600 mt-2">
              <p className="whitespace-nowrap">SAR INTERNATION EST-2025©</p>
              <p className="whitespace-nowrap">DEVELOPED BY SAIFUL ALAM RAFI.</p>
            </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;