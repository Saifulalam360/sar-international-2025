import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faTasks, faBell, faDollarSign, faArrowUp, faArrowDown, faUsers, faCheckCircle, faRocket, faExclamationCircle, faStopCircle, faCircleNotch, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import type { Administrator, Task, ManagedApp, Account, Transaction, AppStatus } from '../types';
import Card from './ui/Card';

interface DashboardProps {
    administrators: Administrator[];
    tasks: Task[];
    apps: ManagedApp[];
    accounts: Account[];
    transactions: Transaction[];
    onNavigate: (view: string, params?: Record<string, any>) => void;
}

const StatCard: React.FC<{ icon: any; label: string; value: string | number; color: string; onClick?: () => void }> = ({ icon, label, value, color, onClick }) => (
    <div
        className={`bg-[#0D1117] p-4 rounded-lg flex items-center gap-4 border border-gray-800 ${onClick ? 'cursor-pointer hover:border-gray-600 transition-colors duration-200' : ''}`}
        onClick={onClick}
    >
        <div className={`w-10 h-10 rounded-md flex items-center justify-center`}>
            <FontAwesomeIcon icon={icon} className={color} size="lg" />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-white font-bold text-2xl">{value}</p>
        </div>
    </div>
);

// FIX: Destructured onNavigate from props to make it available within the component.
const AppStatusChart: React.FC<{ apps: ManagedApp[], onNavigate: DashboardProps['onNavigate'] }> = ({ apps, onNavigate }) => {
    const statusCounts = useMemo(() => {
        return apps.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<AppStatus, number>);
    }, [apps]);

    const totalApps = apps.length;

    if (totalApps === 0) {
        return <div className="text-center text-gray-500 py-10">No applications found.</div>;
    }

    const STATUS_DETAILS: Record<AppStatus, { color: string; icon: any }> = {
        Running: { color: '#22c55e', icon: faCheckCircle },
        Stopped: { color: '#6b7280', icon: faStopCircle },
        Deploying: { color: '#3b82f6', icon: faCircleNotch },
        Error: { color: '#ef4444', icon: faExclamationCircle },
    };

    let cumulativePercentage = 0;
    const segments = (Object.keys(statusCounts) as AppStatus[]).map(status => {
        const percentage = (statusCounts[status] / totalApps) * 100;
        const startAngle = cumulativePercentage;
        cumulativePercentage += percentage;
        return {
            status,
            percentage,
            startAngle,
            color: STATUS_DETAILS[status].color,
        };
    });

    return (
        <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 flex-wrap">
            <div className="relative w-36 h-36 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#374151" strokeWidth="2" />
                    {segments.map(segment => (
                         <circle
                            key={segment.status}
                            cx="18" cy="18" r="15.915"
                            fill="none"
                            stroke={segment.color}
                            strokeWidth="2.5"
                            strokeDasharray={`${segment.percentage}, 100`}
                            strokeDashoffset={-segment.startAngle}
                            transform="rotate(-90 18 18)"
                            strokeLinecap="round"
                         />
                    ))}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold text-white">
                        {totalApps}
                    </span>
                    <span className="text-xs text-gray-400">
                        Total Apps
                    </span>
                </div>
            </div>
             <div className="space-y-2 flex-1 min-w-[150px]">
                {(Object.keys(STATUS_DETAILS) as AppStatus[]).map(status => (
                    <div 
                        key={status} 
                        className="flex items-center justify-between gap-2 cursor-pointer hover:bg-[#0D1117] p-2 rounded-md transition-colors duration-200" 
                        onClick={() => onNavigate('Apps', { statusFilter: status })}
                    >
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_DETAILS[status].color }}></div>
                           <span className="text-sm flex-1">{status}</span>
                        </div>
                        <span className="text-sm font-bold text-white">{statusCounts[status] || 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ administrators, tasks, apps, accounts, transactions, onNavigate }) => {
    const dashboardData = useMemo(() => {
        const activeProjects = apps.length;
        const today = new Date().toDateString();
        const tasksDueToday = tasks.filter(t => !t.completed && new Date(t.dueDate).toDateString() === today).length;
        
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentTransactions = transactions.filter(t => t.date >= thirtyDaysAgo);
        const incomeLast30Days = recentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenseLast30Days = recentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        const recentActivity = [
            ...tasks.filter(t => t.completed).slice(0, 2).map(t => ({ id: `t-${t.id}`, type: 'Task Completed', text: t.title, time: '1h ago', icon: faCheckCircle, color: 'text-green-400' })),
            ...apps.flatMap(a => a.deployments).slice(0, 2).map(d => ({ id: `d-${d.id}`, type: 'Deployment', text: `${apps.find(a => a.deployments.includes(d))?.name} ${d.version}`, time: '4h ago', icon: faRocket, color: 'text-blue-400' })),
        ].sort(() => Math.random() - 0.5); // Random sort for demo
        
        const upcomingTasks = tasks.filter(t => !t.completed).sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()).slice(0, 4);

        return {
            activeProjects,
            tasksDueToday,
            totalBalance,
            incomeLast30Days,
            expenseLast30Days,
            recentActivity,
            upcomingTasks,
        };
    }, [administrators, tasks, apps, accounts, transactions]);

    const maxFinancialValue = Math.max(dashboardData.incomeLast30Days, dashboardData.expenseLast30Days, 1);

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Welcome Header */}
            <div className="lg:col-span-3 xl:col-span-4 bg-[#161B22] p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome back, SAIFUL!</h1>
                    <p className="text-gray-400">Here's a snapshot of your dashboard today.</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 md:mt-0 w-full md:w-auto">
                    <StatCard icon={faProjectDiagram} label="Active Projects" value={dashboardData.activeProjects} color="text-blue-400" onClick={() => onNavigate('Apps')} />
                    <StatCard icon={faTasks} label="Tasks Due" value={dashboardData.tasksDueToday} color="text-yellow-400" onClick={() => onNavigate('Calendar')} />
                    <StatCard icon={faBell} label="Notifications" value="7" color="text-red-400" />
                </div>
            </div>

            {/* Financial Overview */}
            <Card title="Financial Overview" icon={faDollarSign} className="xl:col-span-2">
                <p className="text-gray-400 text-sm">Total Balance</p>
                <p className="text-3xl font-bold text-white mb-4">${dashboardData.totalBalance.toLocaleString('en-US')}</p>
                <div className="space-y-4 text-sm">
                    <div>
                        <div className="flex justify-between items-center mb-1 text-green-400">
                            <span><FontAwesomeIcon icon={faArrowUp} /> Income (30d)</span>
                            <span className="font-bold">${dashboardData.incomeLast30Days.toLocaleString('en-US')}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div 
                                className="bg-green-500 h-1.5 rounded-full" 
                                style={{ width: `${(dashboardData.incomeLast30Days / maxFinancialValue) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1 text-red-400">
                            <span><FontAwesomeIcon icon={faArrowDown} /> Expenses (30d)</span>
                            <span className="font-bold">${dashboardData.expenseLast30Days.toLocaleString('en-US')}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                             <div 
                                className="bg-red-500 h-1.5 rounded-full"
                                style={{ width: `${(dashboardData.expenseLast30Days / maxFinancialValue) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                </div>
            </Card>
            
             {/* Application Status */}
            <Card title="Application Status" className="xl:col-span-2">
                <AppStatusChart apps={apps} onNavigate={onNavigate} />
            </Card>

            {/* Team Members */}
            <Card title="Team Members" icon={faUsers}>
                 <div className="space-y-3">
                    {administrators.slice(0, 4).map(admin => (
                        <div key={admin.id} className="flex items-center justify-between cursor-pointer hover:bg-[#0D1117] p-1 -m-1 rounded-md transition-colors" onClick={() => onNavigate('Settings', { adminId: admin.id })}>
                            <div className="flex items-center gap-3">
                                <img src={admin.avatarUrl} alt={admin.name} className="w-10 h-10 rounded-full"/>
                                <div>
                                    <p className="text-sm font-semibold text-white">{admin.name}</p>
                                    <p className="text-xs text-gray-400">{admin.role}</p>
                                </div>
                            </div>
                             <span className={`text-xs px-2 py-0.5 rounded-full ${admin.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{admin.status}</span>
                        </div>
                    ))}
                 </div>
            </Card>

             {/* Recent Activity */}
            <Card title="Recent Activity" className="lg:col-span-2">
                <div className="space-y-4">
                    {dashboardData.recentActivity.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <FontAwesomeIcon icon={item.icon} className={item.color} />
                            <div className="flex-1">
                                <p className="text-sm text-white">{item.text}</p>
                                <p className="text-xs text-gray-500">{item.type}</p>
                            </div>
                            <span className="text-xs text-gray-500">{item.time}</span>
                        </div>
                    ))}
                </div>
            </Card>

             {/* Upcoming Tasks */}
            <Card title="Upcoming Tasks" icon={faClipboardList}>
                 <div className="space-y-3">
                    {dashboardData.upcomingTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center bg-[#0D1117] p-2 rounded-md">
                            <p className="text-sm text-white truncate">{task.title}</p>
                            <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{task.dueDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</p>
                        </div>
                    ))}
                 </div>
            </Card>
        </div>
    );
};

export default Dashboard;