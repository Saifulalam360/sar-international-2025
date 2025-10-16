import type { Task, Administrator, ManagedApp, Account, Transaction, Conversation, Message } from './types';

// MOCK DATA - In a real app, this would come from an API
export const initialTasks: Task[] = [
    { id: 1, title: 'Finalize Q4 Report', description: 'Review and finalize the quarterly financial report.', dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7), priority: 'High', completed: false },
    { id: 2, title: 'Team Standup', description: 'Daily team sync-up meeting.', dueDate: new Date(), priority: 'Medium', completed: true },
    { id: 3, title: 'Deploy new feature', description: 'Deploy the new user authentication feature to production.', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), priority: 'High', completed: false },
    { id: 4, title: 'Client Follow-up', description: 'Call back client from Acme Corp.', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)), priority: 'Medium', completed: false },
    { id: 5, title: 'Update Dependencies', description: 'Update all project dependencies to latest versions.', dueDate: new Date(new Date().setDate(new Date().getDate() + 10)), priority: 'Low', completed: false },
];

export const initialAdministrators: Administrator[] = [
  { id: 1, name: 'SAIFUL ALAM RAFI', email: 'saiful@example.com', role: 'System Administrator', status: 'Active', avatarUrl: 'https://picsum.photos/id/237/100/100', lastLogin: new Date('2023-10-26T10:00:00Z'), twoFactorEnabled: true, permissions: ['sudo_access', 'manage_users', 'view_reports', 'deploy_apps'], activityLogs: [{id: 1, timestamp: new Date(), action: 'Logged In', details: 'User logged in successfully', ipAddress: '192.168.1.1'}, {id: 2, timestamp: new Date(Date.now() - 3600000), action: 'Updated Settings', details: 'Changed theme to Dark', ipAddress: '192.168.1.1'}], storageUsage: { used: 7.8, total: 25 } },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'Manager', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=jane', lastLogin: new Date(), twoFactorEnabled: false, permissions: ['view_reports'], activityLogs: [], storageUsage: { used: 5, total: 25 } },
  { id: 3, name: 'John Smith', email: 'john@example.com', role: 'Support Staff', status: 'Inactive', avatarUrl: 'https://i.pravatar.cc/150?u=john', lastLogin: new Date(Date.now() - 86400000 * 5), twoFactorEnabled: true, permissions: [], activityLogs: [], storageUsage: { used: 2, total: 25 } },
];

export const initialApps: ManagedApp[] = [
  { id: 1, name: 'Main Web App', platform: 'Web App', repository: 'github.com/sar-international/webapp', status: 'Running', lastDeployed: new Date('2023-10-25T14:30:00Z'), resources: { cpu: [10, 12, 15, 14, 20, 18, 25, 22, 20, 18, 24, 26], memory: [45, 48, 50, 55, 52, 58, 60, 58, 55, 62, 65, 63], storage: { used: 15.2, total: 50 } }, environmentVariables: { 'NODE_ENV': 'production', 'DB_HOST': 'db.example.com' }, deployments: [{ id: 1, version: 'v2.1.0', timestamp: new Date('2023-10-25T14:30:00Z'), status: 'Success' }, {id: 2, version: 'v2.0.1', timestamp: new Date('2023-10-22T11:00:00Z'), status: 'Success'}], logs: [{ id: 1, timestamp: new Date(), level: 'INFO', message: 'Server started on port 80' }, { id: 2, timestamp: new Date(Date.now()-10000), level: 'WARN', message: 'High memory usage detected' }] },
  { id: 2, name: 'Auth API', platform: 'API Service', repository: 'github.com/sar-international/auth-api', status: 'Running', lastDeployed: new Date('2023-10-24T10:00:00Z'), resources: { cpu: [5, 6, 8, 7, 9, 8, 10, 11, 9, 8, 10, 12], memory: [20, 22, 25, 24, 28, 26, 30, 29, 27, 32, 35, 33], storage: { used: 5.1, total: 20 } }, environmentVariables: { 'NODE_ENV': 'production', 'JWT_SECRET': '********' }, deployments: [{ id: 1, version: 'v1.5.2', timestamp: new Date('2023-10-24T10:00:00Z'), status: 'Success' }], logs: [] },
  { id: 3, name: 'Analytics DB', platform: 'Database', repository: 'internal', status: 'Error', lastDeployed: new Date('2023-10-20T18:00:00Z'), resources: { cpu: [2, 3, 2, 4, 3, 5, 4, 3, 2, 4, 5, 4], memory: [70, 72, 75, 74, 78, 76, 80, 79, 77, 82, 85, 83], storage: { used: 35.8, total: 100 } }, environmentVariables: {}, deployments: [], logs: [{id: 1, timestamp: new Date(), level: 'ERROR', message: 'Failed to connect to primary cluster'}] },
  { id: 4, name: 'Mobile Gateway', platform: 'API Service', repository: 'github.com/sar-international/mobile-gateway', status: 'Stopped', lastDeployed: new Date('2023-09-15T12:00:00Z'), resources: { cpu: [0, 0, 0, 0], memory: [0, 0, 0, 0], storage: { used: 0.5, total: 10 } }, environmentVariables: {}, deployments: [], logs: [] },
];

export const initialAccounts: Account[] = [
    { id: 1, name: 'Checking Account', balance: 5230.50 },
    { id: 2, name: 'Savings Account', balance: 12800.75 },
];

export const initialTransactions: Transaction[] = [
    { id: 1, description: 'Monthly Salary', amount: 4500, type: 'income', category: 'Salary', account: 'Checking Account', date: new Date(new Date().setDate(2)) },
    { id: 2, description: 'Grocery Shopping', amount: 125.40, type: 'expense', category: 'Groceries', account: 'Checking Account', date: new Date(new Date().setDate(new Date().getDate() - 3)) },
    { id: 3, description: 'Electricity Bill', amount: 75.20, type: 'expense', category: 'Utilities', account: 'Checking Account', date: new Date(new Date().setDate(new Date().getDate() - 5)) },
    { id: 4, description: 'Freelance Project', amount: 750, type: 'income', category: 'Freelance', account: 'Checking Account', date: new Date(new Date().setDate(new Date().getDate() - 10)) },
    { id: 5, description: 'Dinner Out', amount: 55.00, type: 'expense', category: 'Entertainment', account: 'Checking Account', date: new Date(new Date().setDate(new Date().getDate() - 1)) },
];


export const initialConversations: Conversation[] = [
    { id: 1, contactName: 'Jane Cooper', lastMessage: 'Hey, are we still on for the meeting tomorrow?', timestamp: '10:42 AM', avatarUrl: 'https://i.pravatar.cc/150?u=jane', unreadCount: 2, status: 'online' },
    { id: 2, contactName: 'John Doe', lastMessage: 'Sounds good, I will check it out.', timestamp: '9:30 AM', avatarUrl: 'https://i.pravatar.cc/150?u=john', unreadCount: 0, status: 'offline' },
    { id: 3, contactName: 'Robert Fox', lastMessage: 'The new designs are ready for review.', timestamp: 'Yesterday', avatarUrl: 'https://i.pravatar.cc/150?u=robert', unreadCount: 0, status: 'away' },
];

export const initialMessages: Message[] = [
    { id: 1, text: 'Hey, how is the project going?', timestamp: '10:30 AM', sender: 'contact' },
    { id: 2, text: 'Pretty good! I am almost done with the dashboard component.', timestamp: '10:31 AM', sender: 'me' },
    { id: 3, text: 'Great to hear! Let me know if you need any help.', timestamp: '10:32 AM', sender: 'contact' },
    { id: 4, text: 'Will do. Thanks!', timestamp: '10:33 AM', sender: 'me' },
    { id: 5, text: 'Hey, are we still on for the meeting tomorrow?', timestamp: '10:42 AM', sender: 'contact' },
];
