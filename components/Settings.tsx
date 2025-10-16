import React, { useState } from 'react';
import type { Administrator } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisV, faEye, faTrash, faUsersCog, faCogs, faServer, faPowerOff, faKey, faToggleOn, faBroom, faDownload, faPalette, faBell, faGlobe } from '@fortawesome/free-solid-svg-icons';
import AdminManagementModal from './AdminManagementModal';
import PageHeader from './common/PageHeader';
import Button from './ui/Button';
import Tabs, { Tab } from './common/Tabs';
import DataTable, { ColumnDefinition } from './common/DataTable';

interface SettingsProps {
  administrators: Administrator[];
  onAddAdmin: (newAdminData: Omit<Administrator, 'id' | 'avatarUrl' | 'status' | 'lastLogin' | 'twoFactorEnabled' | 'permissions' | 'activityLogs' | 'storageUsage'>) => void;
  onUpdateAdmin: (updatedAdmin: Administrator) => void;
  onDeleteAdmin: (adminId: number) => void;
  onSelectAdmin: (admin: Administrator) => void;
}

const STATUS_STYLES: Record<Administrator['status'], string> = {
    'Active': 'bg-green-500/20 text-green-400',
    'Inactive': 'bg-gray-500/20 text-gray-400',
    'Suspended': 'bg-red-500/20 text-red-400',
};

const Settings: React.FC<SettingsProps> = ({
  administrators,
  onAddAdmin,
  onDeleteAdmin,
  onSelectAdmin,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  // State for General Settings
  const [generalSettings, setGeneralSettings] = useState({
    theme: 'Dark',
    accentColor: '#60a5fa',
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    language: 'en-US',
    timezone: 'UTC-5',
  });

  // State for Core System Settings
  const [coreSettings, setCoreSettings] = useState({
    maintenanceMode: false,
    maintenanceMessage: 'Our system is currently down for scheduled maintenance. We should be back online shortly.',
    googleAnalyticsId: 'UA-12345-67',
    stripeApiKey: 'pk_test_************************',
    enableNewDashboardUI: false,
    activateBetaReporting: true,
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // Use a type assertion for checkbox input
    const checked = (e.target as HTMLInputElement).checked;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleCoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;
    setCoreSettings(prev => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  }

  const handleAddAdmin = (newAdminData: Parameters<typeof onAddAdmin>[0]) => {
    onAddAdmin(newAdminData);
    setIsModalOpen(false);
  };

  const toggleActionMenu = (adminId: number) => {
    setActiveActionMenu(activeActionMenu === adminId ? null : adminId);
  };

  const handleSelectAndCloseMenu = (admin: Administrator) => {
    onSelectAdmin(admin);
    setActiveActionMenu(null);
  };

  const handleDeleteAndCloseMenu = (admin: Administrator) => {
    if (window.confirm(`Are you sure you want to delete ${admin.name}?`)) {
      onDeleteAdmin(admin.id);
    }
    setActiveActionMenu(null);
  };

  const adminColumns: ColumnDefinition<Administrator>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (admin) => (
        <div className="flex items-center gap-3">
          <img className="w-10 h-10 rounded-full" src={admin.avatarUrl} alt={admin.name} />
          <div>
            <div className="font-semibold text-white">{admin.name}</div>
            <div className="text-xs text-gray-400">{admin.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
    },
    {
      key: 'status',
      header: 'Status',
      render: (admin) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${STATUS_STYLES[admin.status]}`}>
          {admin.status}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (admin) => <span className="whitespace-nowrap">{admin.lastLogin.toLocaleDateString()}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (admin) => (
        <div className="relative inline-block text-right">
            <button onClick={() => toggleActionMenu(admin.id)} className="p-2 rounded-full hover:bg-gray-700" aria-label="Actions">
                <FontAwesomeIcon icon={faEllipsisV} />
            </button>
            {activeActionMenu === admin.id && (
                <div className="absolute right-0 mt-2 w-40 bg-[#161B22] border border-gray-700 rounded-md shadow-lg z-10">
                    <button onClick={() => handleSelectAndCloseMenu(admin)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700">
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4"/>
                        View Profile
                    </button>
                    <button onClick={() => handleDeleteAndCloseMenu(admin)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
                        Delete
                    </button>
                </div>
            )}
        </div>
      )
    }
  ];

  const TABS: Tab[] = [
    { 
        id: 'general', 
        label: 'General Settings', 
        icon: faCogs,
        content: (
            <div className="space-y-8">
              {/* Appearance Settings */}
              <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><FontAwesomeIcon icon={faPalette} />Appearance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
                    <select name="theme" id="theme" value={generalSettings.theme} onChange={handleGeneralSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                      <option>Dark</option>
                      <option>Light</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="accentColor" className="block text-sm font-medium text-gray-400 mb-1">Accent Color</label>
                    <input type="color" name="accentColor" id="accentColor" value={generalSettings.accentColor} onChange={handleGeneralSettingsChange} className="w-full h-10 bg-[#161B22] border border-gray-700 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-gray-600" />
                  </div>
                </div>
              </div>

              {/* Notifications Settings */}
              <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><FontAwesomeIcon icon={faBell} />Notifications</h3>
                <div className="space-y-4">
                  {['emailNotifications', 'pushNotifications', 'weeklySummary'].map(id => (
                    <label key={id} htmlFor={id} className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">
                        {id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <input type="checkbox" id={id} name={id} checked={generalSettings[id as keyof typeof generalSettings] as boolean} onChange={handleGeneralSettingsChange} className="form-checkbox h-5 w-5 bg-transparent border-gray-600 rounded-md text-blue-500 focus:ring-blue-500" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Language & Region Settings */}
              <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><FontAwesomeIcon icon={faGlobe} />Language & Region</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                    <select name="language" id="language" value={generalSettings.language} onChange={handleGeneralSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                      <option value="en-US">English (United States)</option>
                      <option value="es-ES">Español (España)</option>
                      <option value="fr-FR">Français (France)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-400 mb-1">Timezone</label>
                    <select name="timezone" id="timezone" value={generalSettings.timezone} onChange={handleGeneralSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (Greenwich Mean Time)</option>
                      <option>UTC+8 (China Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save General Settings</Button>
              </div>
            </div>
        ) 
    },
    { 
        id: 'administration', 
        label: 'Administration', 
        icon: faUsersCog,
        content: (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Manage Administrator Accounts</h3>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={faPlus}>
                  Add Administrator
                </Button>
              </div>
              <DataTable columns={adminColumns} data={administrators} />
            </>
        ) 
    },
    { 
        id: 'core', 
        label: 'Core System', 
        icon: faServer,
        content: (
            <div className="space-y-8">
              {/* Maintenance Mode */}
              <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><FontAwesomeIcon icon={faPowerOff} className="text-red-400" />Maintenance Mode</h3>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400">Put the application into maintenance mode.</p>
                  <input type="checkbox" id="maintenanceMode" name="maintenanceMode" checked={coreSettings.maintenanceMode} onChange={handleCoreSettingsChange} className="form-checkbox h-5 w-5 bg-transparent border-gray-600 rounded-md text-red-500 focus:ring-red-500" />
                </div>
                {coreSettings.maintenanceMode && (
                  <div>
                    <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-400 mb-1">Maintenance Message</label>
                    <textarea id="maintenanceMessage" name="maintenanceMessage" value={coreSettings.maintenanceMessage} onChange={handleCoreSettingsChange} rows={3} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600" />
                  </div>
                )}
              </div>

              {/* API Integrations */}
              <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><FontAwesomeIcon icon={faKey} />API Integrations</h3>
                <div className="space-y-4">
                   <div>
                    <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-400 mb-1">Google Analytics ID</label>
                    <input type="text" id="googleAnalyticsId" name="googleAnalyticsId" value={coreSettings.googleAnalyticsId} onChange={handleCoreSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gray-600" />
                   </div>
                   <div>
                    <label htmlFor="stripeApiKey" className="block text-sm font-medium text-gray-400 mb-1">Stripe API Key</label>
                    <input type="text" id="stripeApiKey" name="stripeApiKey" value={coreSettings.stripeApiKey} onChange={handleCoreSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gray-600" />
                   </div>
                </div>
              </div>

              {/* Feature Flags */}
              <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3"><FontAwesomeIcon icon={faToggleOn} />Feature Flags</h3>
                <div className="space-y-4">
                  <label htmlFor="enableNewDashboardUI" className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">Enable New Dashboard UI</span>
                      <input type="checkbox" id="enableNewDashboardUI" name="enableNewDashboardUI" checked={coreSettings.enableNewDashboardUI} onChange={handleCoreSettingsChange} className="form-checkbox h-5 w-5 bg-transparent border-gray-600 rounded-md text-blue-500 focus:ring-blue-500" />
                  </label>
                   <label htmlFor="activateBetaReporting" className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">Activate Beta Reporting Engine</span>
                      <input type="checkbox" id="activateBetaReporting" name="activateBetaReporting" checked={coreSettings.activateBetaReporting} onChange={handleCoreSettingsChange} className="form-checkbox h-5 w-5 bg-transparent border-gray-600 rounded-md text-blue-500 focus:ring-blue-500" />
                  </label>
                </div>
              </div>

               {/* System Actions */}
              <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">System Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="secondary" leftIcon={faBroom}>Clear Application Cache</Button>
                    <Button variant="secondary" leftIcon={faDownload}>Export System Logs</Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Core Settings</Button>
              </div>
            </div>
        )
    },
  ];

  return (
    <>
      <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
        <PageHeader 
            title="Settings"
            subtitle="Manage your application's configuration and administrator accounts."
        />
        <Tabs tabs={TABS} />
      </div>
      {isModalOpen && (
        <AdminManagementModal
          mode="add"
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddAdmin}
        />
      )}
    </>
  );
};

export default Settings;