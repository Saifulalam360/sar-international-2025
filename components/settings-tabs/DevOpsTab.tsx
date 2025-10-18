import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faChartLine, faToggleOn, faKey, faPlay, faCheckCircle, faTimesCircle, faCircleNotch, faLock } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ToggleSwitch from '../ui/ToggleSwitch';
import { useToast } from '../../contexts/ToastContext';

const DevOpsTab: React.FC = () => {
    const { addToast } = useToast();
    const [featureFlags, setFeatureFlags] = useState({
        'new-user-dashboard': true,
        'beta-reporting-engine': false,
        'ai-assisted-search': true,
    });

    const mockPipelines = [
        { id: 1, branch: 'main', commit: 'a1b2c3d', status: 'Success' as const, duration: '2m 15s', triggeredBy: 'saiful' },
        { id: 2, branch: 'feat/new-ui', commit: 'e4f5g6h', status: 'Failed' as const, duration: '1m 30s', triggeredBy: 'jane' },
        { id: 3, branch: 'main', commit: 'i7j8k9l', status: 'In Progress' as const, duration: '1m 05s', triggeredBy: 'webhook' },
        { id: 4, branch: 'fix/login-bug', commit: 'm0n1o2p', status: 'Success' as const, duration: '3m 02s', triggeredBy: 'john' },
    ];
    const mockServices = [
        { name: 'API Gateway', status: 'Healthy' as const, responseTime: '45ms' },
        { name: 'Main Database (PostgreSQL)', status: 'Healthy' as const, responseTime: '60ms' },
        { name: 'Redis Cache', status: 'Degraded' as const, responseTime: '250ms' },
        { name: 'Background Job Processor', status: 'Healthy' as const, responseTime: '15ms' },
    ];

    const handleFeatureFlagToggle = (flagName: keyof typeof featureFlags) => {
        setFeatureFlags(prev => ({ ...prev, [flagName]: !prev[flagName] }));
    };

    const PIPELINE_STATUS_MAP = {
        'Success': { icon: faCheckCircle, color: 'text-green-400' },
        'Failed': { icon: faTimesCircle, color: 'text-red-400' },
        'In Progress': { icon: faCircleNotch, color: 'text-blue-400 animate-spin' },
    };
    const SERVICE_STATUS_MAP = {
        'Healthy': 'bg-green-500',
        'Degraded': 'bg-yellow-500',
        'Offline': 'bg-red-500',
    };

    return (
        <div className="space-y-6">
            <Card title="CI/CD Pipelines" icon={faSync} subtitle="Automate your build, test, and deployment workflows.">
            <div className="flex justify-end mb-4">
                <Button leftIcon={faPlay} onClick={() => addToast({message: 'Starting a new pipeline...', type: 'info'})}>Run Pipeline</Button>
            </div>
            <div className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-[#161B22]">
                    <tr>
                    <th className="px-6 py-3">Branch</th>
                    <th className="px-6 py-3">Commit</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Triggered By</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {mockPipelines.map(p => (
                    <tr key={p.id}>
                        <td className="px-6 py-4 font-semibold text-purple-400 font-mono">{p.branch}</td>
                        <td className="px-6 py-4 font-mono text-gray-400">{p.commit}</td>
                        <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 font-semibold ${PIPELINE_STATUS_MAP[p.status].color}`}>
                            <FontAwesomeIcon icon={PIPELINE_STATUS_MAP[p.status].icon} />
                            <span>{p.status}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4">{p.duration}</td>
                        <td className="px-6 py-4">{p.triggeredBy}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </Card>

            <Card title="Infrastructure Monitoring" icon={faChartLine} subtitle="Real-time health and performance metrics of your services.">
            <div className="space-y-3">
                {mockServices.map(service => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-[#0D1117] rounded-lg border border-gray-800">
                    <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${SERVICE_STATUS_MAP[service.status]}`}></div>
                    <div>
                        <p className="font-semibold text-white">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.status}</p>
                    </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-300">{service.responseTime}</p>
                </div>
                ))}
            </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Feature Flags" icon={faToggleOn} subtitle="Enable or disable features without deploying new code.">
                <div className="space-y-4 divide-y divide-gray-800">
                <div className="flex items-center justify-between pt-4 first:pt-0">
                    <div>
                        <p className="font-medium text-gray-200">New User Dashboard</p>
                        <p className="text-xs text-gray-500">Enable the redesigned dashboard experience.</p>
                    </div>
                    <ToggleSwitch checked={featureFlags['new-user-dashboard']} onChange={() => handleFeatureFlagToggle('new-user-dashboard')} />
                </div>
                <div className="flex items-center justify-between pt-4">
                    <div>
                        <p className="font-medium text-gray-200">Beta Reporting Engine</p>
                        <p className="text-xs text-gray-500">Use the new, faster reporting engine.</p>
                    </div>
                    <ToggleSwitch checked={featureFlags['beta-reporting-engine']} onChange={() => handleFeatureFlagToggle('beta-reporting-engine')} />
                </div>
                <div className="flex items-center justify-between pt-4">
                    <div>
                        <p className="font-medium text-gray-200">AI-Assisted Search</p>
                        <p className="text-xs text-gray-500">Power the main search bar with AI.</p>
                    </div>
                    <ToggleSwitch checked={featureFlags['ai-assisted-search']} onChange={() => handleFeatureFlagToggle('ai-assisted-search')} />
                </div>
                </div>
            </Card>
            <Card title="Secrets Management" icon={faKey} subtitle="Securely manage API keys and other sensitive data.">
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="p-4 bg-[#0D1117] rounded-full mb-4 border border-gray-700">
                    <FontAwesomeIcon icon={faLock} className="text-purple-400 text-2xl"/>
                </div>
                <p className="text-gray-400 text-sm mb-4">All secrets are encrypted and stored in a secure vault.</p>
                <Button variant="secondary" onClick={() => addToast({message: 'Navigating to Secrets Vault...', type: 'info'})}>Manage Secrets</Button>
                </div>
            </Card>
            </div>
        </div>
    );
};

export default DevOpsTab;