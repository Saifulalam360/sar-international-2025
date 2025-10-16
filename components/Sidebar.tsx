import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NAV_LINKS } from '../constants';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  isCollapsed: boolean;
  activeView: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, activeView, onNavigate }) => {
  return (
    <aside className={`bg-[#161B22] flex-shrink-0 flex flex-col p-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-64'}`}>
      <div className={`flex items-center mb-10 h-[32px] ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        {isCollapsed ? (
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
          <img src="https://picsum.photos/id/237/100/100" alt="Saiful Alam Rafi" className={`rounded-full mx-auto transition-all duration-300 ${isCollapsed ? 'w-16 h-16' : 'w-24 h-24'}`} />
           <span className={`absolute block rounded-full bg-cyan-400 border-2 border-[#161B22] transition-all duration-300 ${isCollapsed ? 'h-3 w-3 bottom-1 right-1' : 'h-4 w-4 bottom-1 right-1'}`}></span>
        </div>
        {!isCollapsed && (
            <>
                <h2 className="text-lg font-semibold mt-4 whitespace-nowrap">SAIFUL ALAM RAFI</h2>
                <p className="text-sm text-gray-500 whitespace-nowrap">CHIEF EXECUTIVE OFFICER</p>
            </>
        )}
      </div>

      <nav className="flex-1">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => onNavigate(link.name)}
                className={`flex items-center py-3 my-1 rounded-lg transition-colors duration-200 w-full ${isCollapsed ? 'justify-center' : 'px-4'} ${
                  activeView === link.name
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                }`}
                title={link.name}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${isCollapsed ? '' : 'mr-4'}`}>
                    <FontAwesomeIcon icon={link.icon} className={activeView === link.name ? 'text-white' : 'text-gray-400'}/>
                </div>
                {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div>
        <button
          onClick={() => { /* Implement logout functionality */ }}
          className={`flex items-center py-3 my-1 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-gray-700/50 hover:text-white w-full ${isCollapsed ? 'justify-center' : 'px-4'}`}
          title="LOGOUT"
        >
          <div className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0 ${isCollapsed ? '' : 'mr-4'}`}>
              <FontAwesomeIcon icon={faRightFromBracket} className="text-gray-400"/>
          </div>
          {!isCollapsed && <span className="whitespace-nowrap">LOGOUT</span>}
        </button>
        {!isCollapsed && (
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
