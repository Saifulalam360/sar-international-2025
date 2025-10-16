import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faGlobe, faServer, faMobileAlt, faDatabase, faCubes } from '@fortawesome/free-solid-svg-icons';
import type { ManagedApp, AppStatus } from '../types';
import AppDetailView from './AppDetailView';
import AppManagementModal from './AppManagementModal';
import PageHeader from './common/PageHeader';
import Button from './ui/Button';

interface AppsProps {
  apps: ManagedApp[];
  onAddApp: (newAppData: Omit<ManagedApp, 'id' | 'lastDeployed' | 'resources' | 'environmentVariables' | 'deployments' | 'logs' | 'status'>) => void;
  onUpdateApp: (updatedApp: ManagedApp) => void;
  onDeleteApp: (appId: number) => void;
  initialStatusFilter: AppStatus | null;
  onClearFilter: () => void;
}

const PLATFORM_ICONS: Record<ManagedApp['platform'], any> = {
  'Web App': { icon: faGlobe, color: 'text-blue-400' },
  'API Service': { icon: faServer, color: 'text-purple-400' },
  'Mobile App': { icon: faMobileAlt, color: 'text-green-400' },
  'Database': { icon: faDatabase, color: 'text-orange-400' },
};

const STATUS_INDICATORS: Record<ManagedApp['status'], string> = {
  Running: 'bg-green-500',
  Stopped: 'bg-gray-500',
  Deploying: 'bg-blue-500 animate-pulse',
  Error: 'bg-red-500',
};

const Sparkline: React.FC<{ data: number[]; color: string; id: string }> = ({ data, color, id }) => {
    const svgWidth = 100;
    const svgHeight = 20;
    const maxVal = Math.max(...data, 1);
    
    if (data.length < 2) return null;
    
    const points = data.map((d, i) => `${(i / (data.length - 1)) * svgWidth},${svgHeight - (d / maxVal) * (svgHeight - 4) - 2}`).join(' ');
    
    return (
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto" preserveAspectRatio="none">
            <polyline fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" points={points} />
        </svg>
    );
};


const AppCard: React.FC<{ app: ManagedApp; onSelect: () => void }> = ({ app, onSelect }) => (
  <div onClick={onSelect} className="bg-[#0D1117] p-5 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors duration-200 cursor-pointer flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-4">
        <FontAwesomeIcon icon={PLATFORM_ICONS[app.platform].icon} className={`${PLATFORM_ICONS[app.platform].color} text-2xl`} />
        <div>
          <h3 className="font-bold text-white text-lg">{app.name}</h3>
          <p className="text-sm text-gray-400">{app.platform}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${STATUS_INDICATORS[app.status]}`}></div>
        <span className="text-xs font-semibold">{app.status}</span>
      </div>
    </div>
    <div className="flex-1 space-y-3">
      <div>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>CPU</span>
              <span>{app.resources.cpu[app.resources.cpu.length -1]}%</span>
          </div>
          <Sparkline data={app.resources.cpu} color="#3b82f6" id={`cpu-${app.id}`} />
      </div>
       <div>
          <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <span>Memory</span>
              <span>{app.resources.memory[app.resources.memory.length -1]}%</span>
          </div>
          <Sparkline data={app.resources.memory} color="#22c55e" id={`mem-${app.id}`} />
      </div>
    </div>
    <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-700">
      Last Deployed: {app.lastDeployed.toLocaleDateString()}
    </div>
  </div>
);


const Apps: React.FC<AppsProps> = ({ apps, onAddApp, onUpdateApp, onDeleteApp, initialStatusFilter, onClearFilter }) => {
  const [selectedApp, setSelectedApp] = useState<ManagedApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'All'>(initialStatusFilter || 'All');
  
  // Effect to reset the parent's filter state if the user changes the filter locally.
  // This prevents the filter from being "stuck" if they navigate away and then back.
  useEffect(() => {
    if (initialStatusFilter && statusFilter !== initialStatusFilter) {
        onClearFilter();
    }
  }, [statusFilter, initialStatusFilter, onClearFilter]);

  const filteredApps = useMemo(() => {
      if (statusFilter === 'All') return apps;
      return apps.filter(app => app.status === statusFilter);
  }, [apps, statusFilter]);

  const handleSelectApp = (app: ManagedApp) => {
    setSelectedApp(app);
  };
  
  const handleBackToList = () => {
    setSelectedApp(null);
  };

  const handleUpdateAndReselect = (updatedApp: ManagedApp) => {
    onUpdateApp(updatedApp);
    setSelectedApp(updatedApp); // Reselect the app to show updated state
  };

  const handleDeleteAndGoBack = (appId: number) => {
    onDeleteApp(appId);
    setSelectedApp(null);
  };

  if (selectedApp) {
    return <AppDetailView app={selectedApp} onUpdate={handleUpdateAndReselect} onDelete={handleDeleteAndGoBack} onBack={handleBackToList} />;
  }
  
  const FILTER_OPTIONS: Array<AppStatus | 'All'> = ['All', 'Running', 'Stopped', 'Deploying', 'Error'];

  return (
    <>
      <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
        <PageHeader 
            title="Application Management"
            subtitle="Deploy, monitor, and manage your applications."
            icon={faCubes}
        >
            <Button onClick={() => setIsModalOpen(true)} leftIcon={faPlus}>
                Create Application
            </Button>
        </PageHeader>
        
        <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-gray-400">Filter by status:</span>
            <div className="flex items-center bg-[#0D1117] rounded-full p-1">
                {FILTER_OPTIONS.map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${statusFilter === status ? 'bg-gray-200 text-black' : 'text-gray-400 hover:text-white'}`}
                    >
                        {status.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.length > 0 ? filteredApps.map(app => (
              <AppCard key={app.id} app={app} onSelect={() => handleSelectApp(app)} />
            )) : (
                <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 text-gray-500">
                    <p>No applications found for the "{statusFilter}" filter.</p>
                </div>
            )}
        </div>
      </div>
      {isModalOpen && <AppManagementModal onClose={() => setIsModalOpen(false)} onSave={onAddApp} />}
    </>
  );
};

export default Apps;