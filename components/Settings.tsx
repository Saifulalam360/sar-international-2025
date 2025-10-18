import React from 'react';
import type { Administrator } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsersCog, faCogs, faServer, faKey, faBell, faGlobe, faDatabase, faLink, faCodeBranch, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import PageHeader from './common/PageHeader';
import Tabs, { Tab } from './common/Tabs';
import { useDataContext } from '../contexts/DataContext';

// Import newly created modular tab components
import GeneralTab from './settings-tabs/GeneralTab';
import AdministrationTab from './settings-tabs/AdministrationTab';
import ApiKeysTab from './settings-tabs/ApiKeysTab';
import DevOpsTab from './settings-tabs/DevOpsTab';
import CloudHostingTab from './settings-tabs/CloudHostingTab';
import IntegrationsTab from './settings-tabs/IntegrationsTab';
import CoreSystemTab from './settings-tabs/CoreSystemTab';
import StorageTab from './settings-tabs/StorageTab';
import SystemDataTab from './settings-tabs/SystemDataTab';


interface SettingsProps {
  onSelectAdmin: (admin: Administrator) => void;
}

const Settings: React.FC<SettingsProps> = ({ onSelectAdmin }) => {
  const dataContext = useDataContext();

  const TABS: Tab[] = [
    { 
        id: 'general', 
        label: 'General', 
        icon: faCogs,
        content: <GeneralTab />
    },
    { 
        id: 'administration', 
        label: 'Administration', 
        icon: faUsersCog,
        content: <AdministrationTab onSelectAdmin={onSelectAdmin} />
    },
    {
      id: 'api-keys',
      label: 'API Keys',
      icon: faKey,
      content: <ApiKeysTab />
    },
    {
      id: 'devops',
      label: 'DevOps',
      icon: faCodeBranch,
      content: <DevOpsTab />
    },
    {
        id: 'cloud-hosting',
        label: 'Cloud & Hosting',
        icon: faCloudUploadAlt,
        content: <CloudHostingTab />
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: faLink,
      content: <IntegrationsTab />
    },
    { 
        id: 'core', 
        label: 'Core System', 
        icon: faServer,
        content: <CoreSystemTab />
    },
    {
      id: 'storage',
      label: 'Storage',
      icon: faDatabase, // Using a different icon for variety
      content: <StorageTab />
    },
    {
      id: 'system-data',
      label: 'System Data',
      icon: faDatabase,
      content: <SystemDataTab />
    },
  ];

  return (
    <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
      <PageHeader 
          title="Settings"
          subtitle="Manage your application's configuration and administrator accounts."
      />
      <Tabs tabs={TABS} />
    </div>
  );
};

export default Settings;