import React, { useEffect } from 'react';
import type { ManagedApp, Transaction, Account, Administrator, ActivityLog, AppStatus, Notification } from '../types';
import { faExclamationTriangle, faDollarSign, faUserClock } from '@fortawesome/free-solid-svg-icons';

interface RealtimeUpdatesProps {
  setApps: React.Dispatch<React.SetStateAction<ManagedApp[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  addActivityLog: (adminId: number, log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  administrators: Administrator[];
  apps: ManagedApp[];
}

export const useRealtimeUpdates = ({ setApps, setTransactions, setAccounts, addNotification, addActivityLog, administrators, apps }: RealtimeUpdatesProps) => {
  useEffect(() => {
    const interval = setInterval(() => {
        // 1. Simulate app resource changes
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

        // 2. Simulate a new small transaction
        if (Math.random() > 0.8) {
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
            addNotification({
                title: 'New Transaction',
                description: `Received $${newTransaction.amount.toFixed(2)} from ${newTransaction.description}.`,
                icon: faDollarSign,
                iconColor: 'text-green-400',
            });
        }

        // 3. Simulate an app status change
        if (Math.random() > 0.9 && apps.length > 0) {
            const appIndex = Math.floor(Math.random() * apps.length);
            const appToChange = apps[appIndex];
            
            if (appToChange.status === 'Running' || appToChange.status === 'Error') {
                const originalStatus = appToChange.status;
                const tempStatus: AppStatus = 'Deploying';
                
                setApps(prev => prev.map(a => a.id === appToChange.id ? { ...a, status: tempStatus } : a));
                
                setTimeout(() => {
                    setApps(prev => prev.map(a => a.id === appToChange.id ? { ...a, status: originalStatus } : a));
                }, 5000); // Back to original status after 5s

                if (originalStatus === 'Error') {
                    addNotification({
                        title: 'App Recovering',
                        description: `Attempting to restart app "${appToChange.name}" from error state.`,
                        icon: faExclamationTriangle,
                        iconColor: 'text-yellow-400',
                    });
                }
            }
        }

        // 4. Simulate a new activity log for an admin
        if (Math.random() > 0.85 && administrators.length > 0) {
            const adminIndex = Math.floor(Math.random() * administrators.length);
            const admin = administrators[adminIndex];
            addActivityLog(admin.id, {
                action: 'Auto-Logout',
                details: 'User session timed out due to inactivity.',
                ipAddress: '127.0.0.1',
            });
             addNotification({
                title: 'Admin Session Expired',
                description: `Administrator "${admin.name}" was automatically logged out.`,
                icon: faUserClock,
                iconColor: 'text-gray-400',
            });
        }

    }, 3000);

    return () => clearInterval(interval);
  }, [setApps, setTransactions, setAccounts, addNotification, addActivityLog, administrators, apps]);
};