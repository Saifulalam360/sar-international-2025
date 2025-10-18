import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGlobe, faServer, faMobileAlt, faDatabase, faPlay, faStop, faSync, faRocket, faFileCode, faTerminal, faCog, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { ManagedApp } from '../types';
import Tabs, { Tab } from './common/Tabs';
import Button from './ui/Button';
import OverviewTab from './app-detail-tabs/OverviewTab';
import DeploymentsTab from './app-detail-tabs/DeploymentsTab';
import LogsTab from './app-detail-tabs/LogsTab';
import SettingsTab from './app-detail-tabs/SettingsTab';
import { useToast } from '../../contexts/ToastContext';
import { useDataContext } from '../../contexts/DataContext';

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

const AppDetailView: React.FC<AppDetailViewProps> = ({ app, onUpdate, onDelete, onBack }) => {
    const [editableApp, setEditableApp] = useState<ManagedApp>(app);
    const { addToast } = useToast();
    const { isLoading } = useDataContext();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditableApp(app);
    }, [app]);

    const handleSaveChanges = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            onUpdate(editableApp);
            setIsSaving(false);
            addToast({ message: 'Changes saved successfully!', type: 'success' });
        }, 1000);
    };
    
    const handleStatusChange = (status: ManagedApp['status']) => {
        const updatedApp = { ...editableApp, status };
        setEditableApp(updatedApp);
        onUpdate(updatedApp); // Status changes are immediate
        addToast({ message: `App status changed to ${status}`, type: 'info' });
    };
    
    const handleRestart = () => {
        // Simulate a restart process
        addToast({ message: 'Restarting application...', type: 'info' });
        handleStatusChange('Deploying');
        setTimeout(() => {
            handleStatusChange('Running');
            addToast({ message: 'Application restarted successfully!', type: 'success' });
        }, 2000);
    };

    const TABS: Tab[] = [
        { 
            id: 'overview', 
            label: 'Overview', 
            icon: faFileCode,
            content: <OverviewTab app={editableApp} />
        },
        { 
            id: 'deployments', 
            label: 'Deployments', 
            icon: faRocket,
            content: <DeploymentsTab deployments={editableApp.deployments} />
        },
        { 
            id: 'logs', 
            label: 'Logs', 
            icon: faTerminal,
            content: <LogsTab logs={editableApp.logs} />
        },
        { 
            id: 'settings', 
            label: 'Settings', 
            icon: faCog,
            content: <SettingsTab app={editableApp} setApp={setEditableApp} onDelete={onDelete} />
        },
    ];

    return (
        <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 gap-4">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4">
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Back to All Applications
                    </button>
                    <div className="flex items-center gap-4">
                        <FontAwesomeIcon icon={PLATFORM_ICONS[editableApp.platform].icon} className={`${PLATFORM_ICONS[editableApp.platform].color} text-4xl`} />
                        <div>
                            <h1 className="text-3xl font-bold text-white">{editableApp.name}</h1>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${STATUS_INDICATORS[editableApp.status]}`}>{editableApp.status}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 self-start md:self-auto w-full sm:w-auto">
                     <Button 
                        onClick={handleSaveChanges} 
                        leftIcon={isSaving ? faSpinner : faSave} 
                        disabled={isSaving || isLoading}
                     >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <div className="isolate inline-flex rounded-md shadow-sm w-full sm:w-auto">
                        <button type="button" className="relative inline-flex items-center justify-center flex-1 sm:flex-grow-0 gap-2 rounded-l-md bg-[#0D1117] px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-[#161B22] focus:z-10 disabled:opacity-50" onClick={() => handleStatusChange('Running')} disabled={editableApp.status === 'Running' || editableApp.status === 'Deploying'}>
                            <FontAwesomeIcon icon={faPlay} />
                            Start
                        </button>
                        <button type="button" className="relative -ml-px inline-flex items-center justify-center flex-1 sm:flex-grow-0 gap-2 bg-[#0D1117] px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-[#161B22] focus:z-10 disabled:opacity-50" onClick={() => handleStatusChange('Stopped')} disabled={editableApp.status === 'Stopped'}>
                            <FontAwesomeIcon icon={faStop} />
                            Stop
                        </button>
                        <button type="button" className="relative -ml-px inline-flex items-center justify-center flex-1 sm:flex-grow-0 gap-2 rounded-r-md bg-[#0D1117] px-3 py-2 text-sm font-semibold text-gray-300 ring-1 ring-inset ring-gray-700 hover:bg-[#161B22] focus:z-10" onClick={handleRestart}>
                            <FontAwesomeIcon icon={faSync} />
                            Restart
                        </button>
                    </div>
                </div>
            </div>
            
            <Tabs tabs={TABS} />
        </div>
    );
};

export default AppDetailView;