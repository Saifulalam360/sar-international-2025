import React, { useState, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import TasksSidebar from './components/EventsSidebar';
import Settings from './components/Settings';
import AdminProfile from './components/AdminProfile';
import Apps from './components/Apps';
import Finance from './components/Finance';
import PlatformSidebar from './components/PlatformSidebar';
import ConversationList from './components/ConversationList';
import ChatPanel from './components/ChatPanel';
import ContactDetails from './components/ContactDetails';
import SearchResultsModal from './components/SearchResultsModal';
import type { Administrator, AppStatus, SearchResults } from './types';
import { useDataContext } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConfirmationProvider } from './contexts/ConfirmationContext';

const App: React.FC = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(1);
  const [mobileChatView, setMobileChatView] = useState<'list' | 'chat' | 'details'>('list');
  const [appStatusFilter, setAppStatusFilter] = useState<AppStatus | null>(null);
  const [appIdToSelect, setAppIdToSelect] = useState<number | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    apps: [],
    administrators: [],
    transactions: [],
    tasks: [],
    notifications: [],
  });
  
  const { 
    apps, administrators, transactions, tasks, messages,
    currentUser, handleUpdateAdmin,
    notifications,
    conversations,
    handleStartConversation, handleUpdateConversationContact,
    activePlatform, handleChangePlatform,
    handleLogout,
  } = useDataContext();
  
  const selectedConversation = useMemo(() => messages.find(m => m.conversationId === selectedConversationId), [messages, selectedConversationId]);
  
  const conversation = useMemo(() => conversations.find(c => c.id === selectedConversationId), [conversations, selectedConversationId]);

  const handleSelectAdmin = (admin: Administrator) => {
    setSelectedAdmin(admin);
  };
  
  const handleBackToSettings = () => {
    setSelectedAdmin(null);
  };
  
  const handleSearch = useCallback((query: string) => {
      if (!query.trim()) {
          setIsSearchModalOpen(false);
          return;
      }
      const lowerCaseQuery = query.toLowerCase();
      
      setSearchQuery(query);
      setSearchResults({
          apps: apps.filter(app => app.name.toLowerCase().includes(lowerCaseQuery)),
          administrators: administrators.filter(admin => admin.name.toLowerCase().includes(lowerCaseQuery) || admin.email.toLowerCase().includes(lowerCaseQuery)),
          transactions: transactions.filter(t => t.description.toLowerCase().includes(lowerCaseQuery)),
          tasks: tasks.filter(task => task.title.toLowerCase().includes(lowerCaseQuery) || task.description.toLowerCase().includes(lowerCaseQuery)),
          notifications: notifications.filter(n => n.title.toLowerCase().includes(lowerCaseQuery) || n.description.toLowerCase().includes(lowerCaseQuery))
      });
      setIsSearchModalOpen(true);
  }, [apps, administrators, transactions, tasks, notifications]);


  const handleNavigate = useCallback((view: string, params?: Record<string, any>) => {
    setActiveView(view);
    setSelectedAdmin(null);
    setAppIdToSelect(null);
    setMobileSidebarOpen(false); // Close sidebar on navigation

    if (view === 'Apps' && params?.statusFilter) {
      setAppStatusFilter(params.statusFilter);
    } else if (view !== 'Apps') {
      setAppStatusFilter(null);
    }
    
    if (view === 'Settings' && params?.adminId) {
        const adminToSelect = administrators.find(a => a.id === params.adminId);
        if (adminToSelect) setSelectedAdmin(adminToSelect);
    }
    
    if (view === 'Apps' && params?.appId) {
      setAppIdToSelect(params.appId);
    }
  }, [administrators]);
  
  const handleToggleSidebar = useCallback(() => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setSidebarCollapsed(!isSidebarCollapsed);
    }
  }, [isMobileSidebarOpen, isSidebarCollapsed]);

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'Calendar':
      case 'Tasks':
         return (
           <div className="flex-1 flex flex-col lg:flex-row gap-6">
             <CalendarView />
             <TasksSidebar />
           </div>
        );
      case 'Apps':
        return <Apps 
            initialStatusFilter={appStatusFilter}
            onClearFilter={() => setAppStatusFilter(null)}
            appIdToSelect={appIdToSelect}
        />;
      case 'Finance':
        return <Finance />;
      case 'Messages':
        const currentMessages = messages.filter(m => m.conversationId === selectedConversationId);
        
        return (
            <div className="flex-1 flex bg-[#161B22] rounded-xl text-gray-300 overflow-hidden h-full">
                {/* List View (Platform + ConvoList) */}
                <div className={`
                    ${mobileChatView === 'list' || selectedConversationId === null ? 'flex w-full' : 'hidden'} 
                    md:flex md:w-auto flex-shrink-0
                `}>
                    <PlatformSidebar 
                        activePlatform={activePlatform}
                        onChangePlatform={handleChangePlatform}
                    />
                    <ConversationList 
                      onSelectConversation={(c) => {
                          setSelectedConversationId(c.id)
                          setMobileChatView('chat');
                      }} 
                      selectedConversationId={selectedConversationId}
                      administrators={administrators}
                      currentUser={currentUser!}
                      onStartConversation={handleStartConversation}
                    />
                </div>
                
                {/* Chat and Details View */}
                {conversation ? (
                    <>
                        <div className={`
                            ${mobileChatView === 'chat' ? 'flex w-full' : 'hidden'} 
                            md:flex flex-1 flex-col
                        `}>
                            <ChatPanel 
                                conversation={conversation} 
                                messages={currentMessages} 
                                onBack={() => setMobileChatView('list')} 
                                onShowDetails={() => setMobileChatView('details')}
                            />
                        </div>
                        <div className={`
                            ${mobileChatView === 'details' ? 'flex w-full' : 'hidden'} 
                            lg:flex flex-shrink-0 lg:w-80
                        `}>
                            <ContactDetails 
                                contact={conversation} 
                                onUpdate={handleUpdateConversationContact} 
                                onBack={() => setMobileChatView('chat')} 
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 hidden md:flex justify-center items-center text-gray-500">Select a conversation to start chatting.</div>
                )}
            </div>
        );
      case 'Settings':
        if (selectedAdmin) {
          return <AdminProfile admin={selectedAdmin} onUpdateAdmin={handleUpdateAdmin} onBack={handleBackToSettings} />;
        }
        return <Settings 
          onSelectAdmin={handleSelectAdmin}
        />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };
  
  if (!currentUser) {
    return (
        <div className="flex h-screen bg-[#0D1117] text-white justify-center items-center flex-col gap-4">
            <h1 className="text-2xl font-bold">Logged Out</h1>
            <p className="text-gray-400">Please log in to continue.</p>
            {/* In a real app, this would be a link or redirect to a login page */}
             <button
                onClick={() => window.location.reload()}
                className="font-semibold text-sm py-2 px-4 rounded-lg transition-colors flex items-center gap-2 justify-center bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
            >
                Simulate Login
            </button>
        </div>
    );
  }

  return (
    <ToastProvider>
      <ConfirmationProvider>
        <div className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
          {isMobileSidebarOpen && (
              <div
                  className="fixed inset-0 bg-black/50 z-20 md:hidden"
                  onClick={() => setMobileSidebarOpen(false)}
              ></div>
          )}
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            isMobileOpen={isMobileSidebarOpen}
            activeView={activeView} 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
          <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 md:gap-6 overflow-y-auto">
            <Header 
              toggleSidebar={handleToggleSidebar}
              onNavigate={handleNavigate}
              onSearch={handleSearch}
              onLogout={handleLogout}
              currentUser={currentUser}
            />
            <div className="flex-1 flex flex-col">
              {renderContent()}
            </div>
          </main>
          {isSearchModalOpen && (
            <SearchResultsModal 
              query={searchQuery}
              results={searchResults}
              onClose={() => setIsSearchModalOpen(false)}
              onNavigate={handleNavigate}
            />
          )}
        </div>
      </ConfirmationProvider>
    </ToastProvider>
  );
};

export default App;