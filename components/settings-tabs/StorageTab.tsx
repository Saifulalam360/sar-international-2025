import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';
import ToggleSwitch from '../ui/ToggleSwitch';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

const StorageTab: React.FC = () => {
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [storageSettings, setStorageSettings] = useState({
        logRetentionDays: 90,
        enableUserQuotas: true,
        defaultUserQuotaGB: 25,
    });
    
    // Mock data for storage visualization
    const totalStorage = { used: 158.4, total: 500 };
    const storageBreakdown = [
        { service: 'Application Data', used: 75.2, color: 'bg-blue-500' },
        { service: 'User Files', used: 45.8, color: 'bg-purple-500' },
        { service: 'Database', used: 35.1, color: 'bg-green-500' },
        { service: 'System Logs', used: 2.3, color: 'bg-yellow-500' },
    ];

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setStorageSettings(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSettingToggle = (name: keyof typeof storageSettings, value: boolean) => {
        setStorageSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        await new Promise(res => setTimeout(res, 1000));
        setIsSaving(false);
        addToast({ message: `Storage settings saved!`, type: 'success' });
    };

    return (
        <div className="space-y-6">
            <Card title="Overall Storage Usage">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>{totalStorage.used.toFixed(1)} GB Used</span>
                    <span>{totalStorage.total} GB Total Capacity</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 relative overflow-hidden">
                    <div className="absolute h-full bg-gray-700 w-full"></div>
                    <div className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${(totalStorage.used / totalStorage.total) * 100}%` }}></div>
                </div>
            </Card>

            <Card title="Storage Breakdown">
                <div className="space-y-4">
                    {storageBreakdown.map(item => (
                        <div key={item.service}>
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>{item.service}</span>
                                <span>{item.used} GB</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div className={`${item.color} h-1.5 rounded-full`} style={{ width: `${(item.used / totalStorage.used) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title="Storage Policies">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="logRetentionDays" className="block text-sm font-medium text-gray-400 mb-1">Log Retention Policy</label>
                        <select name="logRetentionDays" id="logRetentionDays" value={storageSettings.logRetentionDays} onChange={handleSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                            <option value="30">Delete logs after 30 days</option>
                            <option value="90">Delete logs after 90 days</option>
                            <option value="365">Delete logs after 1 year</option>
                            <option value="0">Never delete logs</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 space-y-4 divide-y divide-gray-800">
                    <div className="flex items-center justify-between pt-4 first:pt-0">
                        <div>
                            <p className="font-medium text-gray-200">Enable User Storage Quotas</p>
                            <p className="text-xs text-gray-500">Limit the amount of storage each administrator can use.</p>
                        </div>
                        <ToggleSwitch checked={storageSettings.enableUserQuotas} onChange={(isChecked) => handleSettingToggle('enableUserQuotas', isChecked)} />
                    </div>
                    {storageSettings.enableUserQuotas && (
                        <div className="pl-4 pt-4">
                            <label htmlFor="defaultUserQuotaGB" className="block text-sm font-medium text-gray-400 mb-1">Default Quota (GB)</label>
                            <input type="number" name="defaultUserQuotaGB" id="defaultUserQuotaGB" value={storageSettings.defaultUserQuotaGB} onChange={handleSettingsChange} className="w-full md:w-1/2 bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600" />
                        </div>
                    )}
                </div>
            </Card>
            <div className="flex justify-end pt-2">
                <Button onClick={handleSaveChanges} disabled={isSaving} leftIcon={isSaving ? faSpinner : faSave}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
};

export default StorageTab;