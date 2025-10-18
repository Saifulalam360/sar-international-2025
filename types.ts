import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type AppStatus = 'Running' | 'Stopped' | 'Deploying' | 'Error';

export interface ManagedApp {
  id: number;
  name: string;
  platform: 'Web App' | 'API Service' | 'Mobile App' | 'Database';
  status: AppStatus;
  repository: string;
  lastDeployed: Date;
  resources: {
    cpu: number[]; // as percentage
    memory: number[]; // as percentage
    storage: {
      used: number; // in GB
      total: number; // in GB
    };
  };
  environmentVariables: Record<string, string>;
  deployments: Deployment[];
  logs: LogEntry[];
}

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

export interface Administrator {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'System Administrator' | 'Manager' | 'Support Staff';
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: Date;
  twoFactorEnabled: boolean;
  permissions: string[];
  activityLogs: ActivityLog[];
  storageUsage: {
    used: number;
    total: number;
  };
}

export interface ActivityLog {
  id: number;
  timestamp: Date;
  action: string;
  details: string;
  ipAddress: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'Salary' | 'Freelance' | 'Groceries' | 'Utilities' | 'Entertainment' | 'Software' | 'Hardware' | 'Other';

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
    type: 'Checking' | 'Savings' | 'Credit Card';
    balance: number;
    currency: string;
    // Bank Account specific
    accountNumber?: string;
    routingNumber?: string;
    // Credit Card specific
    cardHolderName?: string;
    cardNumber?: string;
    expiryDate?: string; // MM/YY
    cvv?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  icon: IconDefinition;
  iconColor: string;
}

export type MessagePlatform = 'default' | 'whatsapp' | 'messenger';

export interface Conversation {
  id: number;
  contactName: string;
  avatarUrl: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  platform: MessagePlatform;
  status: 'online' | 'offline';
  email?: string;
  phone?: string;
}

export interface Message {
  id: number;
  conversationId: number;
  text: string;
  timestamp: Date;
  sender: 'me' | 'contact';
  platform: MessagePlatform;
}

export interface SearchResults {
  apps: ManagedApp[];
  administrators: Administrator[];
  transactions: Transaction[];
  tasks: Task[];
  notifications: Notification[];
}

export interface ApiKey {
    id: number | string;
    name: string;
    key: string;
    status: 'Active' | 'Revoked';
    scopes: string[];
    createdAt: Date;
    lastUsed: Date | null;
}

export interface Integration {
  name: string;
  description: string;
  connected: boolean;
  account: string | null;
  icon: IconDefinition;
}

export interface CloudProvider {
  name: string;
  description: string;
  connected: boolean;
  projectUrl: string | null;
  icon: IconDefinition;
}

export interface CustomDomain {
  id: number;
  domainName: string;
  status: 'Verified' | 'Pending' | 'Verifying';
  dnsRecords: DnsRecord[];
}

export interface DnsRecord {
  type: 'TXT' | 'CNAME';
  host: string;
  value: string;
  ttl: number;
}

export interface Budget {
    id: number;
    category: TransactionCategory;
    limit: number;
    spent: number;
}

export interface RecurringTransaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: TransactionCategory;
    frequency: 'monthly' | 'yearly';
    nextDueDate: Date;
}