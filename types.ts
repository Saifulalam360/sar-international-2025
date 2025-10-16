
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  completed: boolean;
}

export type AdministratorStatus = 'Active' | 'Inactive' | 'Suspended';
export type AdministratorRole = 'System Administrator' | 'Manager' | 'Support Staff';

export interface ActivityLog {
    id: number;
    timestamp: Date;
    action: string;
    details: string;
    ipAddress: string;
}

export interface Administrator {
  id: number;
  name: string;
  email: string;
  role: AdministratorRole;
  status: AdministratorStatus;
  avatarUrl: string;
  lastLogin: Date;
  twoFactorEnabled: boolean;
  permissions: string[];
  activityLogs: ActivityLog[];
  storageUsage: {
      used: number; // in GB
      total: number; // in GB
  };
}

export type AppPlatform = 'Web App' | 'API Service' | 'Mobile App' | 'Database';
export type AppStatus = 'Running' | 'Stopped' | 'Deploying' | 'Error';

export interface Deployment {
    id: number;
    version: string;
    timestamp: Date;
    status: 'Success' | 'Failed';
}

export interface LogEntry {
    id: number;
    timestamp: Date;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
}

export interface ManagedApp {
    id: number;
    name: string;
    platform: AppPlatform;
    repository: string;
    status: AppStatus;
    lastDeployed: Date;
    resources: {
        cpu: number[]; // Timeseries data
        memory: number[]; // Timeseries data
        storage: { used: number; total: number }; // in GB
    };
    environmentVariables: Record<string, string>;
    deployments: Deployment[];
    logs: LogEntry[];
}

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'Groceries' | 'Utilities' | 'Entertainment' | 'Salary' | 'Freelance' | 'Other';

export interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    account: string;
    date: Date;
}

export interface Account {
    id: number;
    name: string;
    balance: number;
}

export interface Budget {
    category: TransactionCategory;
    limit: number;
    spent: number;
}

export interface Conversation {
    id: number;
    contactName: string;
    lastMessage: string;
    timestamp: string;
    avatarUrl: string;
    unreadCount: number;
    status: 'online' | 'offline' | 'away';
}

export interface Message {
    id: number;
    text: string;
    timestamp: string;
    sender: 'me' | 'contact';
}
