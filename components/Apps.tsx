import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faGlobe, faServer, faMobileAlt, faDatabase, faCubes, faSearch } from '@fortawesome/free-solid-svg-icons';
// Fix: Use relative path for local module import.
import type { ManagedApp, AppStatus } from '../types';
import AppDetailView from './AppDetailView';
import AppManagementModal from './AppManagementModal';
import PageHeader from './common/PageHeader';
import Button from './ui/Button';
// Fix: Use relative path for local module import.
import { useDataContext } from '../contexts/DataContext';

interface AppsProps {
  initialStatusFilter: AppStatus | null;
  onClearFilter: () => void;
  appIdToSelect?: number | null;
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


const Apps: React.FC<AppsProps> = ({ initialStatusFilter, onClearFilter, appIdToSelect }) => {
  const { apps, handleAddApp, handleUpdateApp, handleDeleteApp } = useDataContext();
  const [selectedApp, setSelectedApp] = useState<ManagedApp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AppStatus | 'All'>(initialStatusFilter || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (initialStatusFilter && statusFilter !== initialStatusFilter) {
        onClearFilter();
    }
  }, [statusFilter, initialStatusFilter, onClearFilter]);

  useEffect(() => {
    if (appIdToSelect) {
        const appToSelect = apps.find(app => app.id === appIdToSelect);
        if (appToSelect) {
            setSelectedApp(appToSelect);
        }
    }
  }, [appIdToSelect, apps]);

  const filteredApps = useMemo(() => {
      return apps.filter(app => {
          const statusMatch = statusFilter === 'All' || app.status === statusFilter;
          const searchMatch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
          return statusMatch && searchMatch;
      });
  }, [apps, statusFilter, searchTerm]);

  const handleSelectApp = (app: ManagedApp) => {
    setSelectedApp(app);
  };
  
  const handleBackToList = () => {
    setSelectedApp(null);
  };

  const handleUpdateAndReselect = (updatedApp: ManagedApp) => {
    handleUpdateApp(updatedApp);
    setSelectedApp(updatedApp);
  };

  const handleDeleteAndGoBack = (appId: number) => {
    handleDeleteApp(appId);
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
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
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
            <div className="relative w-full sm:w-64">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-full py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.length > 0 ? filteredApps.map(app => (
              <AppCard key={app.id} app={app} onSelect={() => handleSelectApp(app)} />
            )) : (
                <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16 text-gray-500">
                    <FontAwesomeIcon icon={faCubes} className="text-5xl mb-4" />
                    <h3 className="font-semibold text-lg text-gray-400">No Applications Found</h3>
                    <p>No applications were found that match your current filter and search criteria.</p>
                </div>
            )}
        </div>
      </div>
      {isModalOpen && <AppManagementModal onClose={() => setIsModalOpen(false)} onSave={handleAddApp} />}
    </>
  );
};

export default Apps;