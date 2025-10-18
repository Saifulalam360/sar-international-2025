import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faTasks, faBell, faDollarSign, faArrowUp, faArrowDown, faUsers, faCheckCircle, faRocket, faExclamationCircle, faStopCircle, faCircleNotch, faClipboardList, faCubes, faHistory } from '@fortawesome/free-solid-svg-icons';
// Fix: Use relative path for local module import.
import type { Task, ManagedApp, AppStatus } from '../types';
import Card from './ui/Card';
// Fix: Use relative path for local module import.
import { useDataContext } from '../contexts/DataContext';

interface DashboardProps {
    onNavigate: (view: string, params?: Record<string, any>) => void;
}

interface Trend {
    value: string;
    direction: 'up' | 'down';
}

const StatCard: React.FC<{ icon: any; label: string; value: string | number; color: string; onClick?: () => void; trend?: Trend }> = ({ icon, label, value, color, onClick, trend }) => (
    <div
        className={`bg-[#0D1117] p-4 rounded-lg flex items-center gap-4 border border-gray-800 ${onClick ? 'cursor-pointer hover:border-gray-700 transition-colors duration-200' : ''}`}
        onClick={onClick}
    >
        <div className={`w-10 h-10 rounded-md flex items-center justify-center`}>
            <FontAwesomeIcon icon={icon} className={color} size="lg" />
        </div>
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-white font-bold text-2xl">{value}</p>
                 {trend && (
                    <span className={`text-xs font-semibold flex items-center gap-1 ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        <FontAwesomeIcon icon={trend.direction === 'up' ? faArrowUp : faArrowDown} size="xs" />
                        {trend.value}
                    </span>
                )}
            </div>
        </div>
    </div>
);

const AppStatusChart: React.FC<{ apps: ManagedApp[], onNavigate: DashboardProps['onNavigate'] }> = ({ apps, onNavigate }) => {
    const statusCounts = useMemo(() => {
        return apps.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<AppStatus, number>);
    }, [apps]);

    const totalApps = apps.length;

    if (totalApps === 0) {
        return (
            <div className="text-center text-gray-500 py-10 flex flex-col items-center justify-center h-full">
                <FontAwesomeIcon icon={faCubes} className="text-4xl mb-3 text-gray-600" />
                <h4 className="font-semibold text-gray-400">No Applications</h4>
                <p className="text-xs">Add an application to see its status here.</p>
            </div>
        );
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

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-blue-500',
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { administrators, tasks, apps, accounts, transactions, notifications } = useDataContext();

    const dashboardData = useMemo(() => {
        const activeProjects = apps.length;
        const today = new Date();
        today.setHours(0,0,0,0);

        const tasksDueToday = tasks.filter(t => !t.completed && new Date(t.dueDate).setHours(0,0,0,0) === today.getTime()).length;
        const appsInError = apps.filter(app => app.status === 'Error').length;
        
        const unreadNotifications = notifications.filter(n => !n.read).length;
        const notificationCount = tasksDueToday + appsInError + unreadNotifications;
        
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentTransactions = transactions.filter(t => t.date >= thirtyDaysAgo);
        const incomeLast30Days = recentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenseLast30Days = recentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const netLast30Days = incomeLast30Days - expenseLast30Days;
        
        const incomeVsExpensePercentage = incomeLast30Days + expenseLast30Days > 0 
            ? (incomeLast30Days / (incomeLast30Days + expenseLast30Days)) * 100 
            : 50;


        const rawActivity = [
            ...tasks.filter(t => t.completed).map(t => ({ id: `t-${t.id}`, type: 'Task Completed', text: t.title, time: new Date(t.dueDate.getTime() + 3600000), icon: faCheckCircle, color: 'text-green-400' })),
            ...apps.flatMap(a => a.deployments).map(d => ({ id: `d-${d.id}`, type: 'Deployment', text: `${apps.find(a => a.deployments.includes(d))?.name} ${d.version}`, time: d.timestamp, icon: faRocket, color: 'text-blue-400' })),
        ];

        const recentActivity = rawActivity.sort((a,b) => b.time.getTime() - a.time.getTime()).slice(0, 4);

        const upcomingTasks = tasks.filter(t => !t.completed).sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()).slice(0, 4);

        return {
            activeProjects,
            tasksDueToday,
            notificationCount,
            totalBalance,
            incomeLast30Days,
            expenseLast30Days,
            netLast30Days,
            incomeVsExpensePercentage,
            recentActivity,
            upcomingTasks,
        };
    }, [administrators, tasks, apps, accounts, transactions, notifications]);

    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Welcome Header */}
            <div className="md:col-span-2 bg-[#161B22] p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome back, SAIFUL!</h1>
                    <p className="text-gray-400">Here's a snapshot of your dashboard today.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 md:mt-0 w-full md:w-auto">
                    <StatCard icon={faProjectDiagram} label="Active Projects" value={dashboardData.activeProjects} color="text-blue-400" onClick={() => onNavigate('Apps')} trend={{ value: '+2', direction: 'up' }} />
                    <StatCard icon={faTasks} label="Tasks Due" value={dashboardData.tasksDueToday} color="text-yellow-400" onClick={() => onNavigate('Calendar')} />
                    <StatCard icon={faBell} label="Notifications" value={dashboardData.notificationCount} color="text-red-400" />
                </div>
            </div>

            {/* Financial Overview */}
            <Card title="Financial Overview" icon={faDollarSign} className="md:col-span-1">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Total Balance</span>
                            <span className="text-2xl font-bold text-white">${dashboardData.totalBalance.toLocaleString('en-US')}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-4">
                        <div className="flex justify-between">
                            <div className="text-center">
                                <p className="text-xs text-green-400 flex items-center gap-1"><FontAwesomeIcon icon={faArrowUp}/>Income (30d)</p>
                                <p className="font-bold text-lg text-white">${dashboardData.incomeLast30Days.toLocaleString('en-US')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-400">Net (30d)</p>
                                <p className={`font-bold text-lg ${dashboardData.netLast30Days >= 0 ? 'text-green-400' : 'text-red-400'}`}>${dashboardData.netLast30Days.toLocaleString('en-US')}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-red-400 flex items-center gap-1"><FontAwesomeIcon icon={faArrowDown}/>Expenses (30d)</p>
                                <p className="font-bold text-lg text-white">${dashboardData.expenseLast30Days.toLocaleString('en-US')}</p>
                            </div>
                        </div>
                        <div className="mt-2 w-full bg-red-500/30 rounded-full h-2">
                            <div className="bg-green-500/80 h-2 rounded-full" style={{ width: `${dashboardData.incomeVsExpensePercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </Card>
            
             {/* Application Status */}
            <Card title="Application Status" className="md:col-span-1">
                <AppStatusChart apps={apps} onNavigate={onNavigate} />
            </Card>

            {/* Team Members */}
            <Card title="Team Members" icon={faUsers}>
                 <div className="space-y-3">
                    {administrators.slice(0, 4).length > 0 ? (
                        administrators.slice(0, 4).map(admin => (
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
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-4 flex flex-col items-center">
                            <FontAwesomeIcon icon={faUsers} className="text-3xl mb-3 text-gray-600" />
                            <p className="text-sm">No team members found.</p>
                        </div>
                    )}
                 </div>
            </Card>

             {/* Recent Activity */}
            <Card title="Recent Activity" className="md:col-span-1">
                {dashboardData.recentActivity.length > 0 ? (
                    <div className="relative pl-6">
                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-800 rounded-full"></div>
                        {dashboardData.recentActivity.map(item => (
                            <div key={item.id} className="relative mb-5 last:mb-0">
                                <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-[#161B22] border-2 border-gray-700 flex items-center justify-center">
                                    <FontAwesomeIcon icon={item.icon} className={`${item.color} text-xs`} />
                                </div>
                                <div className="pl-2">
                                    <p className="text-sm text-white leading-tight">{item.text}</p>
                                    <p className="text-xs text-gray-500">{item.type} &bull; {item.time.toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                        <FontAwesomeIcon icon={faHistory} className="text-3xl mb-3 text-gray-600" />
                        <p className="text-sm">No recent activity to show.</p>
                    </div>
                )}
            </Card>

             {/* Upcoming Tasks */}
            <Card title="Upcoming Tasks" icon={faClipboardList} className="md:col-span-2">
                 <div className="space-y-3">
                    {dashboardData.upcomingTasks.length > 0 ? (
                        dashboardData.upcomingTasks.map(task => (
                            <div key={task.id} className="flex justify-between items-center bg-[#0D1117] p-3 rounded-md hover:bg-[#010409] transition-colors cursor-pointer" onClick={() => onNavigate('Calendar')}>
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`}></div>
                                    <p className="text-sm text-white truncate">{task.title}</p>
                                </div>
                                <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{task.dueDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-4 flex flex-col items-center">
                            <FontAwesomeIcon icon={faTasks} className="text-3xl mb-3 text-gray-600" />
                            <p className="text-sm">No upcoming tasks.</p>
                        </div>
                    )}
                 </div>
            </Card>
        </div>
    );
};

export default Dashboard;