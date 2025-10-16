import React, { useState, useMemo, useEffect } from 'react';
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
import { initialTasks, initialAdministrators, initialApps, initialAccounts, initialTransactions, initialConversations, initialMessages } from './mockData';
import type { Task, Administrator, ManagedApp, Account, Budget, Transaction, Conversation, Message, TransactionCategory, AppStatus } from './types';

const App: React.FC = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(initialConversations[0] || null);
  const [appStatusFilter, setAppStatusFilter] = useState<AppStatus | null>(null);


  // State management
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [administrators, setAdministrators] = useState<Administrator[]>(initialAdministrators);
  const [apps, setApps] = useState<ManagedApp[]>(initialApps);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Live Data Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
        // Simulate app resource changes
        setApps(prevApps => prevApps.map(app => {
            if (app.status === 'Running') {
                const lastCpu = app.resources.cpu[app.resources.cpu.length - 1] || 15;
                const lastMemory = app.resources.memory[app.resources.memory.length - 1] || 50;
                const newCpu = Math.max(5, Math.min(95, lastCpu + (Math.random() * 10 - 5)));
                const newMemory = Math.max(20, Math.min(95, lastMemory + (Math.random() * 6 - 3)));
                return {
                    ...app,
                    resources: {
                        ...app.resources,
                        cpu: [...app.resources.cpu.slice(1), Math.round(newCpu)],
                        memory: [...app.resources.memory.slice(1), Math.round(newMemory)],
                    }
                };
            }
            return app;
        }));

        // Simulate a new small transaction for visual effect
        if (Math.random() > 0.8) { // 20% chance every 3 seconds
            const newTransaction: Transaction = {
                id: Date.now(),
                description: 'Automated Micro-Income',
                amount: +(Math.random() * 5).toFixed(2),
                type: 'income',
                category: 'Other',
                account: 'Checking Account',
                date: new Date(),
            };
            setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
            setAccounts(prev => prev.map(acc => {
                if (acc.name === newTransaction.account) {
                    return { ...acc, balance: acc.balance + newTransaction.amount };
                }
                return acc;
            }));
        }

    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const budgets: Budget[] = useMemo(() => {
    const budgetTemplate: Record<TransactionCategory, number> = {
        'Groceries': 500,
        'Utilities': 250,
        'Entertainment': 200,
        'Salary': 0,
        'Freelance': 0,
        'Other': 100,
    };

    return (Object.keys(budgetTemplate) as TransactionCategory[]).map(category => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === category && t.date.getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0);
      return { category, limit: budgetTemplate[category], spent };
    });
  }, [transactions]);
  
  // Handlers for Tasks
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask].sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()));
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Handlers for Administrators
  const handleAddAdmin = (newAdminData: Omit<Administrator, 'id' | 'avatarUrl' | 'status' | 'lastLogin' | 'twoFactorEnabled' | 'permissions' | 'activityLogs' | 'storageUsage'>) => {
    const newAdmin: Administrator = {
      ...newAdminData,
      id: Date.now(),
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
      status: 'Active',
      lastLogin: new Date(),
      twoFactorEnabled: false,
      permissions: [],
      activityLogs: [],
      storageUsage: { used: 0, total: 10 },
    };
    setAdministrators(prev => [...prev, newAdmin]);
  };

  const handleUpdateAdmin = (updatedAdmin: Administrator) => {
    setAdministrators(prev => prev.map(admin => admin.id === updatedAdmin.id ? updatedAdmin : admin));
    setSelectedAdmin(updatedAdmin); // Keep the profile view updated
  };

  const handleDeleteAdmin = (adminId: number) => {
    setAdministrators(prev => prev.filter(admin => admin.id !== adminId));
    if (selectedAdmin?.id === adminId) {
        setSelectedAdmin(null);
    }
  };
  
  const handleSelectAdmin = (admin: Administrator) => {
    setSelectedAdmin(admin);
  };
  
  const handleBackToSettings = () => {
    setSelectedAdmin(null);
  };

  // Handlers for Apps
  const handleAddApp = (newAppData: Omit<ManagedApp, 'id' | 'lastDeployed' | 'resources' | 'environmentVariables' | 'deployments' | 'logs' | 'status'>) => {
    const newApp: ManagedApp = {
      ...newAppData,
      id: Date.now(),
      lastDeployed: new Date(),
      status: 'Running',
      resources: { cpu: [5, 10, 8, 12, 10, 15], memory: [25, 30, 28, 35, 33, 40], storage: { used: 1, total: 20 } },
      environmentVariables: { 'NODE_ENV': 'production' },
      deployments: [{ id: 1, version: 'v1.0.0', status: 'Success', timestamp: new Date() }],
      logs: [{ id: 1, timestamp: new Date(), level: 'INFO', message: 'Application created successfully.' }],
    };
    setApps(prev => [...prev, newApp]);
  };
  
  const handleUpdateApp = (updatedApp: ManagedApp) => {
    setApps(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
  };

  const handleDeleteApp = (appId: number) => {
    setApps(prev => prev.filter(app => app.id !== appId));
  };
  
  // Handler for Transactions
  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = { ...transactionData, id: Date.now() };
    setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
    
    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.name === newTransaction.account) {
        const newBalance = newTransaction.type === 'income' 
          ? acc.balance + newTransaction.amount 
          : acc.balance - newTransaction.amount;
        return { ...acc, balance: newBalance };
      }
      return acc;
    }));
  };

  const handleNavigate = (view: string, params?: Record<string, any>) => {
    setActiveView(view);
    setSelectedAdmin(null); // Reset admin profile view on navigation

    if (view === 'Apps' && params?.statusFilter) {
      setAppStatusFilter(params.statusFilter);
    } else if (view !== 'Apps') {
      // Clear the filter if we navigate away from the Apps page through any means other than clicking a filter on the Apps page itself
      setAppStatusFilter(null);
    }
    
    if (view === 'Settings' && params?.adminId) {
        const adminToSelect = administrators.find(a => a.id === params.adminId);
        if (adminToSelect) {
            setSelectedAdmin(adminToSelect);
        }
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return <Dashboard 
          administrators={administrators}
          tasks={tasks}
          apps={apps}
          accounts={accounts}
          transactions={transactions}
          onNavigate={handleNavigate}
        />;
      case 'Calendar':
      case 'Tasks':
         return (
           <div className="flex-1 flex gap-6">
             <CalendarView tasks={tasks} />
             <TasksSidebar tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} />
           </div>
        );
      case 'Apps':
        return <Apps 
            apps={apps} 
            onAddApp={handleAddApp} 
            onUpdateApp={handleUpdateApp} 
            onDeleteApp={handleDeleteApp}
            initialStatusFilter={appStatusFilter}
            onClearFilter={() => setAppStatusFilter(null)}
        />;
      case 'Finance':
        return <Finance accounts={accounts} budgets={budgets} transactions={transactions} onAddTransaction={handleAddTransaction} />;
      case 'Messages':
        return (
            <div className="flex-1 flex bg-[#161B22] rounded-xl text-gray-300 overflow-hidden">
                <PlatformSidebar />
                <ConversationList conversations={initialConversations} onSelectConversation={setSelectedConversation} selectedConversationId={selectedConversation?.id} />
                {selectedConversation ? (
                    <>
                        <ChatPanel conversation={selectedConversation} messages={initialMessages} />
                        <ContactDetails contact={selectedConversation} />
                    </>
                ) : (
                    <div className="flex-1 flex justify-center items-center text-gray-500">Select a conversation to start chatting.</div>
                )}
            </div>
        );
      case 'Settings':
        if (selectedAdmin) {
          return <AdminProfile admin={selectedAdmin} onUpdateAdmin={handleUpdateAdmin} onBack={handleBackToSettings} />;
        }
        return <Settings 
          administrators={administrators} 
          onAddAdmin={handleAddAdmin} 
          onDeleteAdmin={handleDeleteAdmin} 
          onSelectAdmin={handleSelectAdmin} 
          onUpdateAdmin={handleUpdateAdmin}
        />;
      default:
        return <Dashboard 
            administrators={administrators}
            tasks={tasks}
            apps={apps}
            accounts={accounts}
            transactions={transactions}
            onNavigate={handleNavigate}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0D1117] text-white">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        activeView={activeView} 
        onNavigate={handleNavigate}
      />
      <main className="flex-1 flex flex-col p-4 md:p-6 gap-4 md:gap-6 overflow-y-auto">
        <Header 
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          onNavigate={handleNavigate}
        />
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
