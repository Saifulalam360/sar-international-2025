import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCog, faBell, faChevronDown, faBars, faUser, faSignOutAlt, faCheckCircle, faCubes, faUsersCog, faReceipt, faTasks } from '@fortawesome/free-solid-svg-icons';
import type { Administrator, SearchResults } from '../types';
import { useDataContext } from '../contexts/DataContext';

interface HeaderProps {
  toggleSidebar: () => void;
  onNavigate: (view: string, params?: Record<string, any>) => void;
  onSearch: (query: string) => void;
  onLogout: () => void;
  currentUser: Administrator;
}

const ResultRow: React.FC<{ icon: any; title: string; subtitle: string; onClick: () => void; }> = ({ icon, title, subtitle, onClick }) => (
    <div onClick={onClick} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#161B22] rounded-md transition-colors duration-150">
        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[#161B22] rounded-md">
            <FontAwesomeIcon icon={icon} className="text-gray-400" />
        </div>
        <div className="overflow-hidden">
            <p className="font-semibold text-white truncate text-sm">{title}</p>
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
    </div>
);

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onNavigate, onSearch, onLogout, currentUser }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { 
    notifications, markNotificationsAsRead, 
    apps, administrators, transactions, tasks 
  } = useDataContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const searchResults: SearchResults | null = useMemo(() => {
    if (!searchQuery.trim()) {
        return null;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    const filteredApps = apps.filter(app => app.name.toLowerCase().includes(lowerCaseQuery)).slice(0, 3);
    const filteredAdmins = administrators.filter(admin => admin.name.toLowerCase().includes(lowerCaseQuery) || admin.email.toLowerCase().includes(lowerCaseQuery)).slice(0, 3);
    const filteredTransactions = transactions.filter(t => t.description.toLowerCase().includes(lowerCaseQuery)).slice(0, 3);
    const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(lowerCaseQuery)).slice(0, 2);
    
    return {
        apps: filteredApps,
        administrators: filteredAdmins,
        transactions: filteredTransactions,
        tasks: filteredTasks,
        notifications: [], // Notifications are not part of the quick search for brevity
    };
  }, [searchQuery, apps, administrators, transactions, tasks]);

  const handleClickOutside = (event: MouseEvent) => {
    if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
      setIsNotificationsOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setIsProfileOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(!!query.trim());
  };
  
  const handleNavigateAndClose = (view: string, params?: Record<string, any>) => {
    onNavigate(view, params);
    setIsSearchOpen(false);
    setSearchQuery('');
  }

  const handleNotificationToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen && unreadCount > 0) {
      setTimeout(() => markNotificationsAsRead(), 1000);
    }
  };

  return (
    <header className="flex justify-between items-center bg-[#161B22] p-4 md:p-5 rounded-xl">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
          <FontAwesomeIcon icon={faBars} size="lg"/>
        </button>
        <p className="hidden md:block text-sm text-gray-500">SAR INTERNATIONAL</p>
      </div>

      <div ref={searchRef} className="hidden md:block relative w-full max-w-xs lg:max-w-sm">
        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchOpen(!!searchQuery.trim())}
          className="w-full bg-[#0D1117] border border-gray-700 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {isSearchOpen && searchResults && (
            <div className="absolute top-full mt-2 w-full bg-[#0D1117]/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl z-20 p-2 max-h-[70vh] overflow-y-auto">
                {searchResults.apps.length === 0 && searchResults.administrators.length === 0 && searchResults.transactions.length === 0 && searchResults.tasks.length === 0 ? (
                     <div className="text-center p-4 text-sm text-gray-500">No results found.</div>
                ) : (
                    <>
                        {searchResults.apps.length > 0 && (
                            <section className="mb-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-1 px-2">Applications</h3>
                                {searchResults.apps.map(app => <ResultRow key={`app-${app.id}`} icon={faCubes} title={app.name} subtitle={app.platform} onClick={() => handleNavigateAndClose('Apps', { appId: app.id })} />)}
                            </section>
                        )}
                        {searchResults.administrators.length > 0 && (
                            <section className="mb-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-1 px-2">Administrators</h3>
                                {searchResults.administrators.map(admin => <ResultRow key={`admin-${admin.id}`} icon={faUsersCog} title={admin.name} subtitle={admin.email} onClick={() => handleNavigateAndClose('Settings', { adminId: admin.id })} />)}
                            </section>
                        )}
                        {searchResults.transactions.length > 0 && (
                            <section className="mb-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-1 px-2">Transactions</h3>
                                {searchResults.transactions.map(t => <ResultRow key={`t-${t.id}`} icon={faReceipt} title={t.description} subtitle={`$${t.amount.toFixed(2)}`} onClick={() => handleNavigateAndClose('Finance')} />)}
                            </section>
                        )}
                        {searchResults.tasks.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-1 px-2">Tasks</h3>
                                {searchResults.tasks.map(task => <ResultRow key={`task-${task.id}`} icon={faTasks} title={task.title} subtitle={`Due: ${task.dueDate.toLocaleDateString()}`} onClick={() => handleNavigateAndClose('Calendar')} />)}
                            </section>
                        )}
                         <div className="border-t border-gray-700 mt-2 pt-2">
                            <button onClick={() => onSearch(searchQuery)} className="w-full text-center text-sm p-2 text-purple-400 font-semibold hover:bg-[#161B22] rounded-md">
                                View all results for "{searchQuery}"
                            </button>
                        </div>
                    </>
                )}
            </div>
        )}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => onSearch('')}>
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </button>

        <div className="relative" ref={notificationsRef}>
          <button onClick={handleNotificationToggle} className="relative text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faBell} size="lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 items-center justify-center text-xs">{unreadCount}</span>
              </span>
            )}
          </button>
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0D1117]/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
              <div className="p-4 font-bold border-b border-gray-700 sticky top-0 bg-[#0D1117]/80">Notifications</div>
              <ul>
                {notifications.length > 0 ? notifications.map(n => (
                  <li key={n.id} className={`p-4 border-b border-gray-700 hover:bg-[#161B22]/50 cursor-pointer ${!n.read ? 'bg-blue-500/10' : ''}`}>
                    <div className="flex gap-3">
                        <FontAwesomeIcon icon={n.icon} className={`${n.iconColor} mt-1`} />
                        <div>
                            <p className="font-semibold text-sm">{n.title}</p>
                            <p className="text-xs text-gray-400">{n.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.timestamp.toLocaleTimeString()}</p>
                        </div>
                    </div>
                  </li>
                )) : (
                  <li className="p-8 text-center text-sm text-gray-500 flex flex-col items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-3xl mb-3 text-green-500" />
                    <h4 className="font-semibold text-gray-400">All caught up!</h4>
                    <p>You have no new notifications.</p>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div className="relative" ref={profileRef}>
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3">
              <img src={currentUser.avatarUrl} alt="User" className="w-10 h-10 rounded-full" />
              <div className="hidden md:block">
                <p className="font-semibold text-sm">{currentUser.name.toUpperCase()}</p>
                <p className="text-xs text-gray-500">{currentUser.role.toUpperCase()}</p>
              </div>
              <div className="hidden md:block text-gray-400 hover:text-white">
                <FontAwesomeIcon icon={faChevronDown} />
              </div>
            </button>
            {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0D1117]/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl z-20 py-2">
                    <button onClick={() => { onNavigate('Settings', { adminId: currentUser.id }); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#161B22] rounded-t-md">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4"/>
                        Profile
                    </button>
                     <button onClick={() => { onNavigate('Settings'); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#161B22]">
                        <FontAwesomeIcon icon={faCog} className="w-4 h-4"/>
                        Settings
                    </button>
                    <div className="border-t border-gray-700 my-2"></div>
                    <button onClick={() => { onLogout(); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#161B22] rounded-b-md">
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