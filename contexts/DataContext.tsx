import React, { createContext, useContext, useState, useCallback } from 'react';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import type { 
    Administrator, 
    ManagedApp, 
    Transaction, 
    Task, 
    Notification, 
    Conversation, 
    Message,
    ApiKey,
    CustomDomain,
    Account,
    ActivityLog,
    MessagePlatform,
    Budget,
    RecurringTransaction
} from '../types';
import { 
    mockAdministrators, 
    mockManagedApps, 
    mockTransactions, 
    mockTasks, 
    mockNotifications,
    mockConversations,
    mockMessages,
    mockApiKeys,
    mockCustomDomains,
    mockAccounts,
    mockBudgets,
    mockRecurringTransactions,
} from '../mockData';
import { useRealtimeUpdates } from '../hooks/useRealtimeUpdates';
import { usePersistentState } from '../hooks/usePersistentState';

interface DataContextProps {
    administrators: Administrator[];
    apps: ManagedApp[];
    transactions: Transaction[];
    tasks: Task[];
    notifications: Notification[];
    conversations: Conversation[];
    messages: Message[];
    apiKeys: ApiKey[];
    customDomains: CustomDomain[];
    accounts: Account[];
    budgets: Budget[];
    recurringTransactions: RecurringTransaction[];
    currentUser: Administrator | null;
    typingStatus: Record<number, boolean>;
    activePlatform: MessagePlatform;
    isLoading: boolean;

    handleAddAdmin: (admin: Omit<Administrator, 'id' | 'avatarUrl' | 'status' | 'lastLogin' | 'twoFactorEnabled' | 'permissions' | 'activityLogs' | 'storageUsage'>) => void;
    handleUpdateAdmin: (updatedAdmin: Administrator) => void;
    handleDeleteAdmin: (adminId: number) => void;
    addActivityLog: (adminId: number, log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

    handleAddApp: (app: Omit<ManagedApp, 'id' | 'lastDeployed' | 'resources' | 'environmentVariables' | 'deployments' | 'logs' | 'status'>) => void;
    handleUpdateApp: (updatedApp: ManagedApp) => void;
    handleDeleteApp: (appId: number) => void;
    
    handleAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    
    handleAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
    handleToggleTask: (taskId: number) => void;
    
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
    markNotificationsAsRead: () => void;
    
    handleSendMessage: (text: string, conversationId: number, platform: MessagePlatform) => void;
    handleStartConversation: (contactId: number, message: string) => Promise<number | null>;
    handleUpdateConversationContact: (updatedContact: Conversation) => void;
    handleChangePlatform: (platform: MessagePlatform) => void;
    handleLogout: () => void;

    handleAddApiKey: (keyData: { name: string, scopes: string[] }) => ApiKey;
    handleRevokeApiKey: (keyId: number | string) => void;
    handleDeleteApiKey: (keyId: number | string) => void;

    handleAddDomain: (domainName: string) => void;
    handleDeleteDomain: (domainId: number) => void;
    handleVerifyDomain: (domainId: number) => void;

    handleAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
    handleUpdateBudget: (updatedBudget: Omit<Budget, 'spent'>) => void;
    handleDeleteBudget: (budgetId: number) => void;
    
    resetAllData: () => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [administrators, setAdministrators] = usePersistentState<Administrator[]>('administrators', mockAdministrators);
    const [apps, setApps] = usePersistentState<ManagedApp[]>('apps', mockManagedApps);
    const [transactions, setTransactions] = usePersistentState<Transaction[]>('transactions', mockTransactions);
    const [tasks, setTasks] = usePersistentState<Task[]>('tasks', mockTasks);
    const [notifications, setNotifications] = usePersistentState<Notification[]>('notifications', mockNotifications);
    const [conversations, setConversations] = usePersistentState<Conversation[]>('conversations', mockConversations);
    const [messages, setMessages] = usePersistentState<Message[]>('messages', mockMessages);
    const [apiKeys, setApiKeys] = usePersistentState<ApiKey[]>('apiKeys', mockApiKeys);
    const [customDomains, setCustomDomains] = usePersistentState<CustomDomain[]>('customDomains', mockCustomDomains);
    const [accounts, setAccounts] = usePersistentState<Account[]>('accounts', mockAccounts);
    const [budgets, setBudgets] = usePersistentState<Budget[]>('budgets', mockBudgets);
    const [recurringTransactions, setRecurringTransactions] = usePersistentState<RecurringTransaction[]>('recurringTransactions', mockRecurringTransactions);
    const [currentUser, setCurrentUser] = usePersistentState<Administrator | null>('currentUser', mockAdministrators[0]);
    
    const [typingStatus, setTypingStatus] = useState<Record<number, boolean>>({});
    const [activePlatform, setActivePlatform] = useState<MessagePlatform>('default');
    const [isLoading, setIsLoading] = useState(false);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now() + Math.random(),
            read: false,
            timestamp: new Date(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, [setNotifications]);
    
     const addActivityLog = useCallback((adminId: number, log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
        setAdministrators(prev => prev.map(admin => {
            if (admin.id === adminId) {
                const newLog: ActivityLog = { ...log, id: Date.now(), timestamp: new Date() };
                return { ...admin, activityLogs: [newLog, ...admin.activityLogs] };
            }
            return admin;
        }));
    }, [setAdministrators]);

    useRealtimeUpdates({ setApps, setTransactions, setAccounts, addNotification, addActivityLog, administrators, apps });

    // Admin Handlers
    const handleAddAdmin = useCallback((admin: Omit<Administrator, 'id' | 'avatarUrl' | 'status' | 'lastLogin' | 'twoFactorEnabled' | 'permissions' | 'activityLogs' | 'storageUsage'>) => {
        setAdministrators(prevAdmins => {
            const newId = Math.max(0, ...prevAdmins.map(a => a.id)) + 1;
            const newAdmin: Administrator = {
                ...admin,
                id: newId,
                avatarUrl: `https://i.pravatar.cc/150?u=${newId}`,
                status: 'Active',
                lastLogin: new Date(),
                twoFactorEnabled: false,
                permissions: [],
                activityLogs: [],
                storageUsage: { used: 0, total: 25 },
            };
            return [...prevAdmins, newAdmin];
        });
    }, [setAdministrators]);
    const handleUpdateAdmin = useCallback((updatedAdmin: Administrator) => {
        setAdministrators(prev => prev.map(admin => admin.id === updatedAdmin.id ? updatedAdmin : admin));
    }, [setAdministrators]);
    const handleDeleteAdmin = useCallback((adminId: number) => {
        setAdministrators(prev => prev.filter(admin => admin.id !== adminId));
    }, [setAdministrators]);

    // App Handlers
    const handleAddApp = useCallback((app: Omit<ManagedApp, 'id' | 'lastDeployed' | 'resources' | 'environmentVariables' | 'deployments' | 'logs' | 'status'>) => {
        setApps(prevApps => {
            const newId = Math.max(0, ...prevApps.map(a => a.id)) + 1;
            const generateResourceHistory = () => Array.from({ length: 30 }, () => Math.floor(Math.random() * 10) + 5);
            const newApp: ManagedApp = {
                ...app,
                id: newId,
                status: 'Stopped',
                lastDeployed: new Date(),
                resources: {
                    cpu: generateResourceHistory(),
                    memory: generateResourceHistory(),
                    storage: { used: 0, total: 10 },
                },
                environmentVariables: {},
                deployments: [],
                logs: [],
            };
            return [newApp, ...prevApps];
        });
    }, [setApps]);

    const handleUpdateApp = useCallback((updatedApp: ManagedApp) => {
        setApps(prev => prev.map(app => app.id === updatedApp.id ? updatedApp : app));
    }, [setApps]);

    const handleDeleteApp = useCallback((appId: number) => {
        setApps(prev => prev.filter(app => app.id !== appId));
    }, [setApps]);
    
    // Transaction Handlers
    const handleAddTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now() + Math.random(),
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a,b) => b.date.getTime() - a.date.getTime()));
        
        setAccounts(prev => prev.map(acc => {
            if (acc.name === transaction.account) {
                const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
                return { ...acc, balance: acc.balance + amount };
            }
            return acc;
        }));

        if (transaction.type === 'expense') {
            setBudgets(prev => prev.map(budget => {
                if (budget.category === transaction.category) {
                    return { ...budget, spent: budget.spent + transaction.amount };
                }
                return budget;
            }));
        }
    }, [setTransactions, setAccounts, setBudgets]);
    
    // Task Handlers
    const handleAddTask = useCallback((task: Omit<Task, 'id' | 'completed'>) => {
        const newTask: Task = {
            ...task,
            id: Date.now() + Math.random(),
            completed: false,
        };
        setTasks(prev => [...prev, newTask]);
    }, [setTasks]);

    const handleToggleTask = useCallback((taskId: number) => {
        setTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    }, [setTasks]);
    
    // Notification Handlers
    const markNotificationsAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, [setNotifications]);
    
    // Message Handlers
    const handleSendMessage = useCallback((text: string, conversationId: number, platform: MessagePlatform) => {
        const newMessage: Message = {
            id: Date.now() + Math.random(),
            conversationId,
            text,
            timestamp: new Date(),
            sender: 'me',
            platform: platform
        };
        setMessages(prev => [...prev, newMessage]);
        setConversations(prev => prev.map(c => 
            c.id === conversationId ? { ...c, lastMessage: text, timestamp: newMessage.timestamp } : c
        ));
        
        setTypingStatus(prev => ({ ...prev, [conversationId]: true }));
        setTimeout(() => {
            const contactReply: Message = {
                id: Date.now() + Math.random(),
                conversationId,
                text: `Thanks for your message! This is an automated reply from ${platform}.`,
                timestamp: new Date(),
                sender: 'contact',
                platform: platform
            };
            setTypingStatus(prev => ({ ...prev, [conversationId]: false }));
            setMessages(prev => [...prev, contactReply]);
            setConversations(prev => prev.map(c => 
                c.id === conversationId ? { ...c, lastMessage: contactReply.text, timestamp: contactReply.timestamp } : c
            ));
        }, 1500 + Math.random() * 1000);
    }, [setMessages, setConversations]);

    const handleStartConversation = useCallback(async (contactId: number, message: string): Promise<number | null> => {
        const contact = administrators.find(a => a.id === contactId);
        if (!contact) return null;

        const existingConversation = conversations.find(c => c.contactName === contact.name && c.platform === activePlatform);

        if (existingConversation) {
            handleSendMessage(message, existingConversation.id, existingConversation.platform);
            return existingConversation.id;
        }
        
        const newConversationId = Math.max(0, ...conversations.map(c => c.id)) + 1;
        const newConversation: Conversation = {
            id: newConversationId,
            contactName: contact.name,
            avatarUrl: contact.avatarUrl,
            lastMessage: message,
            timestamp: new Date(),
            unreadCount: 0,
            platform: activePlatform,
            status: 'online',
            email: contact.email,
            phone: '+1-202-555-0199',
        };

        setConversations(prev => [newConversation, ...prev]);
        handleSendMessage(message, newConversationId, activePlatform);
        
        return newConversationId;
    }, [administrators, conversations, activePlatform, handleSendMessage, setConversations]);
    
    const handleUpdateConversationContact = useCallback((updatedContact: Conversation) => {
        setConversations(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    }, [setConversations]);
    
    const handleChangePlatform = useCallback((platform: MessagePlatform) => {
        setActivePlatform(platform);
    }, []);

    const handleLogout = useCallback(() => {
        setCurrentUser(null);
    }, [setCurrentUser]);

    // API Key Handlers
    const handleAddApiKey = useCallback((keyData: { name: string, scopes: string[] }): ApiKey => {
        const newKey: ApiKey = {
            id: `key-${Date.now()}`,
            name: keyData.name,
            key: `sark_live_${[...Array(30)].map(() => Math.random().toString(36)[2]).join('')}`,
            status: 'Active',
            scopes: keyData.scopes,
            createdAt: new Date(),
            lastUsed: null,
        };
        setApiKeys(prev => [newKey, ...prev]);
        return newKey;
    }, [setApiKeys]);

    const handleRevokeApiKey = useCallback((keyId: number | string) => {
        setApiKeys(prev => prev.map(key => key.id === keyId ? { ...key, status: 'Revoked' } : key));
    }, [setApiKeys]);

    const handleDeleteApiKey = useCallback((keyId: number | string) => {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
    }, [setApiKeys]);

    // Domain Handlers
    const handleAddDomain = useCallback((domainName: string) => {
        const newDomain: CustomDomain = {
            id: Date.now(),
            domainName,
            status: 'Pending',
            dnsRecords: [
                { type: 'TXT', host: '@', value: `sar-verification=${Math.random().toString(36).substring(2, 15)}`, ttl: 300 },
            ],
        };
        setCustomDomains(prev => [newDomain, ...prev]);
    }, [setCustomDomains]);

    const handleDeleteDomain = useCallback((domainId: number) => {
        setCustomDomains(prev => prev.filter(d => d.id !== domainId));
    }, [setCustomDomains]);
    
    const handleVerifyDomain = useCallback((domainId: number) => {
        setCustomDomains(prev => prev.map(d => d.id === domainId ? { ...d, status: 'Verifying' } : d));

        setTimeout(() => {
            const success = Math.random() > 0.3;
            setCustomDomains(currentDomains => {
                const domain = currentDomains.find(d => d.id === domainId);
                if (!domain) return currentDomains;

                if (success) {
                    addNotification({ title: 'Domain Verified', description: `Successfully verified "${domain.domainName}".`, icon: faCheckCircle, iconColor: 'text-green-400' });
                    return currentDomains.map(d => d.id === domainId ? { ...d, status: 'Verified' } : d);
                } else {
                    addNotification({ title: 'Verification Failed', description: `Could not verify DNS records for "${domain.domainName}".`, icon: faTimesCircle, iconColor: 'text-red-400' });
                    return currentDomains.map(d => d.id === domainId ? { ...d, status: 'Pending' } : d);
                }
            });
        }, 2500);
    }, [setCustomDomains, addNotification]);

    // Budget Handlers
    const handleAddBudget = useCallback((budget: Omit<Budget, 'id' | 'spent'>) => {
        const spent = transactions
            .filter(t => t.category === budget.category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const newBudget: Budget = {
            ...budget,
            id: Date.now(),
            spent,
        };
        setBudgets(prev => [...prev, newBudget]);
    }, [transactions, setBudgets]);
    
    const handleUpdateBudget = useCallback((updatedBudget: Omit<Budget, 'spent'>) => {
        setBudgets(prev => prev.map(b => {
            if (b.id === updatedBudget.id) {
                const spent = transactions
                    .filter(t => t.category === updatedBudget.category && t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                return { ...b, ...updatedBudget, spent };
            }
            return b;
        }));
    }, [transactions, setBudgets]);

    const handleDeleteBudget = useCallback((budgetId: number) => {
        setBudgets(prev => prev.filter(b => b.id !== budgetId));
    }, [setBudgets]);

    const resetAllData = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            localStorage.clear();
            window.location.reload();
        }, 1000);
    }, []);

    const value = {
        administrators, apps, transactions, tasks, notifications, conversations, messages, apiKeys, customDomains, accounts, budgets, recurringTransactions, currentUser, typingStatus, activePlatform, isLoading,
        handleAddAdmin, handleUpdateAdmin, handleDeleteAdmin, addActivityLog,
        handleAddApp, handleUpdateApp, handleDeleteApp,
        handleAddTransaction,
        handleAddTask, handleToggleTask,
        addNotification, markNotificationsAsRead,
        handleSendMessage, handleStartConversation, handleUpdateConversationContact, handleChangePlatform, handleLogout,
        handleAddApiKey, handleRevokeApiKey, handleDeleteApiKey,
        handleAddDomain, handleDeleteDomain, handleVerifyDomain,
        handleAddBudget, handleUpdateBudget, handleDeleteBudget,
        resetAllData,
    };
    
    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};