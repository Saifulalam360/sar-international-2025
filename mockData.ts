import {
  ManagedApp,
  Administrator,
  Transaction,
  Task,
  Notification,
  Conversation,
  Message,
  ApiKey,
  CustomDomain,
  Account,
  Budget,
  RecurringTransaction,
} from './types';
import { ALL_PERMISSIONS } from './constants';
import { faExclamationTriangle, faDollarSign, faUserClock, faTasks } from '@fortawesome/free-solid-svg-icons';

// Dates
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

// Data generators
const generateResourceHistory = () => Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 10);

export const mockAdministrators: Administrator[] = [
  {
    id: 1,
    name: 'Saiful Alam Rafi',
    email: 'saiful.alam@example.com',
    avatarUrl: `https://i.pravatar.cc/150?u=1`,
    role: 'System Administrator',
    status: 'Active',
    lastLogin: hoursAgo(1),
    twoFactorEnabled: true,
    permissions: ALL_PERMISSIONS,
    activityLogs: [
        { id: 1, timestamp: hoursAgo(2), action: 'Login', details: 'Successful login', ipAddress: '192.168.1.1' },
        { id: 2, timestamp: hoursAgo(1), action: 'Update App', details: 'Updated "Dashboard UI"', ipAddress: '192.168.1.1' },
    ],
    storageUsage: { used: 15.5, total: 50 },
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatarUrl: `https://i.pravatar.cc/150?u=2`,
    role: 'Manager',
    status: 'Active',
    lastLogin: hoursAgo(5),
    twoFactorEnabled: false,
    permissions: ['manage_users', 'deploy_apps', 'view_reports', 'manage_billing'],
     activityLogs: [
        { id: 3, timestamp: hoursAgo(5), action: 'Login', details: 'Successful login', ipAddress: '203.0.113.5' },
    ],
    storageUsage: { used: 25.0, total: 50 },
  },
   {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatarUrl: `https://i.pravatar.cc/150?u=3`,
    role: 'Support Staff',
    status: 'Inactive',
    lastLogin: daysAgo(10),
    twoFactorEnabled: true,
    permissions: ['manage_support_tickets'],
    activityLogs: [],
    storageUsage: { used: 5.2, total: 25 },
  },
   {
    id: 4,
    name: 'Emily White',
    email: 'emily.white@example.com',
    avatarUrl: `https://i.pravatar.cc/150?u=4`,
    role: 'Support Staff',
    status: 'Suspended',
    lastLogin: daysAgo(3),
    twoFactorEnabled: false,
    permissions: [],
     activityLogs: [],
    storageUsage: { used: 2.1, total: 25 },
  },
];

export const mockManagedApps: ManagedApp[] = [
  {
    id: 1,
    name: 'Main Dashboard UI',
    platform: 'Web App',
    status: 'Running',
    repository: 'github.com/sar-international/dashboard',
    lastDeployed: daysAgo(1),
    resources: {
      cpu: generateResourceHistory(),
      memory: generateResourceHistory(),
      storage: { used: 25, total: 50 },
    },
    environmentVariables: { 'DATABASE_URL': 'postgres://...', 'API_KEY': 'secret_key' },
    deployments: [
      { id: 1, version: 'v1.2.3', timestamp: daysAgo(1), status: 'Success' },
      { id: 2, version: 'v1.2.2', timestamp: daysAgo(5), status: 'Success' },
    ],
    logs: [
        {id: 1, timestamp: hoursAgo(1), level: 'INFO', message: 'User 1 logged in.'},
        {id: 2, timestamp: hoursAgo(2), level: 'WARN', message: 'High memory usage detected.'},
    ]
  },
    {
    id: 2,
    name: 'Public API',
    platform: 'API Service',
    status: 'Running',
    repository: 'github.com/sar-international/api',
    lastDeployed: daysAgo(3),
    resources: {
      cpu: generateResourceHistory(),
      memory: generateResourceHistory(),
      storage: { used: 10, total: 20 },
    },
    environmentVariables: { 'NODE_ENV': 'production' },
    deployments: [
       { id: 3, version: 'v2.0.1', timestamp: daysAgo(3), status: 'Success' },
    ],
    logs: [
        {id: 3, timestamp: new Date(), level: 'INFO', message: 'GET /v1/users 200 OK'},
    ]
  },
  {
    id: 3,
    name: 'Marketing Website',
    platform: 'Web App',
    status: 'Stopped',
    repository: 'github.com/sar-international/website',
    lastDeployed: daysAgo(10),
    resources: {
      cpu: generateResourceHistory(),
      memory: generateResourceHistory(),
      storage: { used: 5, total: 10 },
    },
    environmentVariables: {},
    deployments: [],
    logs: []
  },
   {
    id: 4,
    name: 'Internal Wiki',
    platform: 'Web App',
    status: 'Error',
    repository: 'github.com/sar-international/wiki',
    lastDeployed: daysAgo(2),
    resources: {
      cpu: generateResourceHistory(),
      memory: generateResourceHistory(),
      storage: { used: 8, total: 15 },
    },
    environmentVariables: {},
    deployments: [
         { id: 4, version: 'v1.0.0', timestamp: daysAgo(2), status: 'Failed' },
    ],
    logs: [
        {id: 4, timestamp: hoursAgo(3), level: 'ERROR', message: 'Database connection failed: timeout.'},
    ]
  },
   {
    id: 5,
    name: 'Primary DB',
    platform: 'Database',
    status: 'Deploying',
    repository: 'github.com/sar-international/database-infra',
    lastDeployed: hoursAgo(1),
    resources: {
      cpu: generateResourceHistory(),
      memory: generateResourceHistory(),
      storage: { used: 120, total: 200 },
    },
    environmentVariables: {},
    deployments: [],
    logs: []
  },
];

export const mockAccounts: Account[] = [
    { 
        id: 1, 
        name: 'Checking Account', 
        type: 'Checking', 
        balance: 25340.50, 
        currency: 'USD',
        accountNumber: '**** **** **** 1234',
        routingNumber: '021000021'
    },
    { 
        id: 2, 
        name: 'Business Savings', 
        type: 'Savings', 
        balance: 89500.00, 
        currency: 'USD',
        accountNumber: '**** **** **** 5678',
    },
    {
        id: 3,
        name: 'Corporate Credit Card',
        type: 'Credit Card',
        balance: -2345.80,
        currency: 'USD',
        cardHolderName: 'Saiful Alam Rafi',
        cardNumber: '**** **** **** 9876',
        expiryDate: '12/26',
        cvv: '***'
    }
];

export const mockTransactions: Transaction[] = [
    { id: 1, description: 'Stripe Payout', amount: 12000, type: 'income', category: 'Salary', account: 'Checking Account', date: daysAgo(2) },
    { id: 2, description: 'Amazon AWS Services', amount: 1500.75, type: 'expense', category: 'Software', account: 'Credit Card', date: daysAgo(3) },
    { id: 3, description: 'Freelance Project', amount: 2500, type: 'income', category: 'Freelance', account: 'Checking Account', date: daysAgo(5) },
    { id: 4, description: 'Office Depot Supplies', amount: 250.20, type: 'expense', category: 'Hardware', account: 'Checking Account', date: daysAgo(7) },
    { id: 5, description: 'Lunch with Client', amount: 85.50, type: 'expense', category: 'Entertainment', account: 'Credit Card', date: daysAgo(8) },
    { id: 6, description: 'Verizon Wireless', amount: 180.45, type: 'expense', category: 'Utilities', account: 'Credit Card', date: daysAgo(10) },
    { id: 7, description: 'Client X Payment', amount: 5000, type: 'income', category: 'Freelance', account: 'Checking Account', date: daysAgo(12) },
];

export const mockTasks: Task[] = [
    { id: 1, title: 'Deploy v2.1.0 to production', description: 'Deploy new version with updated UI.', dueDate: daysFromNow(2), priority: 'High', completed: false },
    { id: 2, title: 'Review Q3 Financials', description: 'Prepare report for the board meeting.', dueDate: daysFromNow(5), priority: 'Medium', completed: false },
    { id: 3, title: 'Onboard new support staff', description: 'John Smith needs access to Zendesk.', dueDate: daysAgo(1), priority: 'Low', completed: true },
    { id: 4, title: 'Fix API login bug', description: 'Users reporting 500 errors on login.', dueDate: now, priority: 'High', completed: false },
    { id: 5, title: 'Update company handbook', description: 'Add new remote work policy.', dueDate: daysFromNow(10), priority: 'Low', completed: false },
    { id: 6, title: 'Plan Q4 marketing campaign', description: 'Coordinate with marketing team.', dueDate: daysFromNow(7), priority: 'Medium', completed: false },
];

export const mockNotifications: Notification[] = [
    { id: 1, title: 'App "Internal Wiki" in Error State', description: 'Database connection failed: timeout.', timestamp: hoursAgo(3), read: false, icon: faExclamationTriangle, iconColor: 'text-red-400' },
    { id: 2, title: 'New Payout Received', description: 'Stripe Payout for $12,000.00 was processed.', timestamp: daysAgo(2), read: true, icon: faDollarSign, iconColor: 'text-green-400' },
    { id: 3, title: 'Admin Session Expired', description: 'Administrator "Jane Doe" was automatically logged out.', timestamp: hoursAgo(5), read: true, icon: faUserClock, iconColor: 'text-gray-400' },
    { id: 4, title: 'Task Due Today', description: 'Task "Fix API login bug" is due today.', timestamp: hoursAgo(8), read: false, icon: faTasks, iconColor: 'text-yellow-400' },
];

export const mockConversations: Conversation[] = [
    { id: 1, contactName: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=2', lastMessage: 'Sure, I will look into it now.', timestamp: hoursAgo(0.5), unreadCount: 0, platform: 'default', status: 'online', email: 'jane.doe@example.com', phone: '+1-202-555-0142' },
    { id: 2, contactName: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=3', lastMessage: 'Okay, sounds good!', timestamp: hoursAgo(1.5), unreadCount: 2, platform: 'whatsapp', status: 'offline', email: 'john.smith@example.com', phone: '+1-202-555-0188' },
    { id: 3, contactName: 'Emily White', avatarUrl: 'https://i.pravatar.cc/150?u=4', lastMessage: 'Can you resend the invoice?', timestamp: daysAgo(1), unreadCount: 0, platform: 'messenger', status: 'online', email: 'emily.white@example.com', phone: '+1-202-555-0199' },
    { id: 4, contactName: 'Client Support', avatarUrl: 'https://i.pravatar.cc/150?u=5', lastMessage: 'Thank you for reaching out.', timestamp: daysAgo(1.2), unreadCount: 1, platform: 'default', status: 'offline', email: 'support@example.com', phone: '+1-202-555-0121' },
];

export const mockMessages: Message[] = [
    { id: 1, conversationId: 1, text: 'Hey Jane, can you check the deployment status for the Public API?', timestamp: hoursAgo(0.52), sender: 'me', platform: 'default' },
    { id: 2, conversationId: 1, text: 'Sure, I will look into it now.', timestamp: hoursAgo(0.5), sender: 'contact', platform: 'default' },
    { id: 3, conversationId: 2, text: 'Hi John, the task for onboarding is completed.', timestamp: hoursAgo(1.51), sender: 'me', platform: 'whatsapp' },
    { id: 4, conversationId: 2, text: 'Okay, sounds good!', timestamp: hoursAgo(1.5), sender: 'contact', platform: 'whatsapp' },
    { id: 5, conversationId: 3, text: 'Can you resend the invoice?', timestamp: daysAgo(1), sender: 'contact', platform: 'messenger' },
];

export const mockApiKeys: ApiKey[] = [
    { id: 1, name: 'Production Key', key: 'sark_live_abc123def456ghi789jkl0mno1p', status: 'Active', scopes: ['deploy_apps', 'access_logs'], createdAt: daysAgo(30), lastUsed: hoursAgo(2) },
    { id: 2, name: 'Staging Key', key: 'sark_test_qrstuvwxyzaBcDeFgHiJkLmNoPqRs', status: 'Active', scopes: ['deploy_apps'], createdAt: daysAgo(90), lastUsed: daysAgo(5) },
    { id: 3, name: 'Old Analytics Key', key: 'sark_live_TuVwXyZ1234567890aBcDeFgHiJ', status: 'Revoked', scopes: ['view_reports'], createdAt: daysAgo(180), lastUsed: daysAgo(45) },
];

export const mockCustomDomains: CustomDomain[] = [
    { id: 1, domainName: 'api.sar-international.com', status: 'Verified', dnsRecords: [{ type: 'CNAME', host: 'api', value: 'endpoint.render.com', ttl: 3600 }] },
    { id: 2, domainName: 'app.example.com', status: 'Pending', dnsRecords: [{ type: 'TXT', host: '@', value: 'sar-verification=xyz123abc456', ttl: 300 }] },
];

export const mockBudgets: Budget[] = [
    { id: 1, category: 'Software', limit: 2000, spent: 1500.75 },
    { id: 2, category: 'Hardware', limit: 1000, spent: 250.20 },
    { id: 3, category: 'Entertainment', limit: 500, spent: 85.50 },
    { id: 4, category: 'Utilities', limit: 500, spent: 180.45 },
];

export const mockRecurringTransactions: RecurringTransaction[] = [
    { id: 1, description: 'Amazon AWS', amount: 1500, type: 'expense', category: 'Software', frequency: 'monthly', nextDueDate: daysFromNow(5) },
    { id: 2, description: 'Office Rent', amount: 5000, type: 'expense', category: 'Utilities', frequency: 'monthly', nextDueDate: daysFromNow(10) },
    { id: 3, description: 'Client Retainer', amount: 7500, type: 'income', category: 'Freelance', frequency: 'monthly', nextDueDate: daysFromNow(15) },
];