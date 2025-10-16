import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGlobe, faServer, faMobileAlt, faDatabase, faPlay, faStop, faSync, faRocket, faFileCode, faTerminal, faCog, faTrash, faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import type { ManagedApp, LogEntry } from '../types';
import Tabs, { Tab } from './common/Tabs';
import Button from './ui/Button';

interface AppDetailViewProps {
    app: ManagedApp;
    onUpdate: (app: ManagedApp) => void;
    onDelete: (appId: number) => void;
    onBack: () => void;
}

const PLATFORM_ICONS: Record<ManagedApp['platform'], any> = {
  'Web App': { icon: faGlobe, color: 'text-blue-400' },
  'API Service': { icon: faServer, color: 'text-purple-400' },
  'Mobile App': { icon: faMobileAlt, color: 'text-green-400' },
  'Database': { icon: faDatabase, color: 'text-orange-400' },
};

const STATUS_INDICATORS: Record<ManagedApp['status'], string> = {
  Running: 'bg-green-500/20 text-green-400 border-green-500/30',
  Stopped: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Deploying: 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse',
  Error: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const LOG_LEVEL_COLORS: Record<LogEntry['level'], string> = {
    INFO: 'text-cyan-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400'
};

const ResourceChart: React.FC<{ title: string; data: number[], color: string }> = ({ title, data, color }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);
    const svgHeight = 80;
    const svgWidth = 400;
    const padding = { top: 10, right: 0, bottom: 20, left: 25 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const maxVal = 100; // Use a fixed max of 100 for percentages
    
    const getCoords = (val: number, index: number) => ({
        x: padding.left + (index / (data.length - 1)) * chartWidth,
        y: padding.top + chartHeight - (val / maxVal) * chartHeight,
    });

    const path = data.map((d, i) => `${getCoords(d, i).x},${getCoords(d, i).y}`).join(' L ');
    
    const gridLines = [0, 25, 50, 75, 100];

    return (
        <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 flex-1">
            <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-sm font-semibold">{title}</h4>
                <p className="text-2xl font-bold text-white">{data[data.length-1]}<span className="text-base font-normal text-gray-400">%</span></p>
            </div>
            <div className="relative">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" className="w-full h-24">
                    {/* Grid Lines and Labels */}
                    {gridLines.map(line => {
                        const y = getCoords(line, 0).y;
                        return (
                            <g key={line}>
                                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#374151" strokeWidth="0.25" />
                                <text x={0} y={y + 3} fill="#6b7280" fontSize="8">{line}%</text>
                            </g>
                        );
                    })}
                    
                    {/* Line */}
                    <path d={`M ${path}`} fill="none" stroke={color} strokeWidth="1.5" />
                    
                    {/* Interactive Points */}
                    {data.map((d, i) => {
                        const { x, y } = getCoords(d, i);
                        return (
                            <circle 
                                key={i}
                                cx={x} cy={y} r="6"
                                fill="transparent"
                                onMouseEnter={() => setTooltip({ x, y, value: d })}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        );
                    })}
                </svg>
                {/* Tooltip */}
                {tooltip && (
                    <div 
                        className="absolute bg-black text-white text-xs rounded py-1 px-2 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                        style={{ left: `${(tooltip.x / svgWidth) * 100}%`, top: tooltip.y - 8 }}
                    >
                        {tooltip.value}%
                    </div>
                )}
            </div>
        </div>
    )
};

const AppDetailView: React.FC<AppDetailViewProps> = ({ app, onUpdate, onDelete, onBack }) => {
    
    const handleStatusChange = (status: ManagedApp['status']) => {
        onUpdate({ ...app, status });
    };
    
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete the application "${app.name}"? This action cannot be undone.`)) {
            onDelete(app.id);
        }
    }

    const TABS: Tab[] = [
        { 
            id: 'overview', 
            label: 'Overview', 
            icon: faFileCode,
            content: (
                <div className="space-y-6">
                     <div className="flex flex-col sm:flex-row gap-6">
                        <ResourceChart title="CPU Usage" data={app.resources.cpu} color="#3b82f6" />
                        <ResourceChart title="Memory Usage" data={app.resources.memory} color="#22c55e" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800">
                            <h4 className="text-sm font-semibold mb-2">Storage</h4>
                            <div className="w-full bg-gray-800 rounded-full h-1.5">
                                <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(app.resources.storage.used / app.resources.storage.total) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 text-right">{app.resources.storage.used} GB / {app.resources.storage.total} GB</p>
                        </div>
                        <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800">
                            <h4 className="text-sm font-semibold mb-2">Key Details</h4>
                            <p className="text-xs text-gray-400"><strong>Repo:</strong> <a href={`https://${app.repository}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{app.repository}</a></p>
                            <p className="text-xs text-gray-400"><strong>Last Deployed:</strong> {app.lastDeployed.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            ) 
        },
        { 
            id: 'deployments', 
            label: 'Deployments', 
            icon: faRocket,
            content: (
                <div className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-[#161B22]">
                            <tr>
                                <th className="px-6 py-3">Version</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {app.deployments.map(d => (
                                <tr key={d.id}>
                                    <td className="px-6 py-4 font-mono font-semibold">{d.version}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${d.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{d.status}</span></td>
                                    <td className="px-6 py-4 text-gray-400">{d.timestamp.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) 
        },
        { 
            id: 'logs', 
            label: 'Logs', 
            icon: faTerminal,
            content: (
                <div className="bg-[#010409] font-mono text-xs text-gray-300 p-4 rounded-lg border border-gray-800 h-96 overflow-y-auto">
                    {app.logs.map(log => (
                        <p key={log.id}><span className="text-gray-500 mr-4">{log.timestamp.toLocaleTimeString()}</span><span className={`${LOG_LEVEL_COLORS[log.level]} font-bold mr-2`}>{log.level}</span>{log.message}</p>
                    ))}
                </div>
            ) 
        },
        { 
            id: 'settings', 
            label: 'Settings', 
            icon: faCog,
            content: (
                <div className="space-y-6">
                    <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-lg font-bold text-white mb-4">Environment Variables</h3>
                         <div className="space-y-2 font-mono text-sm">
                            {Object.entries(app.environmentVariables).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-2 p-2 bg-[#0D1117] rounded">
                                    <span className="text-gray-400">{key}=</span>
                                    <span className="flex-1 text-white bg-transparent">{value}</span>
                                    <button className="text-gray-500 hover:text-white"><FontAwesomeIcon icon={faPen}/></button>
                                    <button className="text-gray-500 hover:text-red-400"><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                            ))}
                        </div>
                         <Button variant="secondary" className="mt-4" leftIcon={faPlus}>Add Variable</Button>
                    </div>
                     <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/30">
                        <h3 className="text-lg font-bold text-red-300 mb-2">Danger Zone</h3>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">Delete this application</p>
                                <p className="text-sm text-red-400/80">Once deleted, it will be gone forever. Please be certain.</p>
                            </div>
                            <Button variant="danger" onClick={handleDelete} leftIcon={faTrash}>
                                Delete Application
                            </Button>
                        </div>
                    </div>
                </div>
            ) 
        },
    ];

    return (
        <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back to All Applications
                    </button>
                    <div className="flex items-center gap-4">
                        <FontAwesomeIcon icon={PLATFORM_ICONS[app.platform].icon} className={`${PLATFORM_ICONS[app.platform].color} text-4xl`} />
                        <div>
                            <h1 className="text-3xl font-bold text-white">{app.name}</h1>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${STATUS_INDICATORS[app.status]}`}>{app.status}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => handleStatusChange('Running')} disabled={app.status === 'Running' || app.status === 'Deploying'}>
                        <FontAwesomeIcon icon={faPlay} /><span>Start</span>
                    </Button>
                    <Button variant="secondary" onClick={() => handleStatusChange('Stopped')} disabled={app.status === 'Stopped'}>
                        <FontAwesomeIcon icon={faStop} /><span>Stop</span>
                    </Button>
                     <Button variant="secondary">
                        <FontAwesomeIcon icon={faSync} /><span>Restart</span>
                    </Button>
                </div>
            </div>
            
            <Tabs tabs={TABS} />
        </div>
    );
};

export default AppDetailView;