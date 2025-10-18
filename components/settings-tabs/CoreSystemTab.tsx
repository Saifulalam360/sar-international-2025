import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faKey, faToggleOn, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';
import ToggleSwitch from '../ui/ToggleSwitch';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

const CoreSystemTab: React.FC = () => {
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [coreSettings, setCoreSettings] = useState({
        maintenanceMode: false,
        maintenanceMessage: 'Our system is currently down for scheduled maintenance. We should be back online shortly.',
        googleAnalyticsId: 'UA-12345-67',
        stripeApiKey: 'pk_test_************************',
        enableNewDashboardUI: false,
        activateBetaReporting: true,
    });

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCoreSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSettingToggle = (name: keyof typeof coreSettings, value: boolean) => {
        setCoreSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        await new Promise(res => setTimeout(res, 1000));
        setIsSaving(false);
        addToast({ message: `Core System settings saved!`, type: 'success' });
    };
    
    return (
        <div className="space-y-6">
            <Card title="Maintenance Mode" icon={faPowerOff}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="font-medium text-gray-200">Activate Maintenance Mode</p>
                        <p className="text-xs text-gray-500">Puts the application offline for all users except administrators.</p>
                    </div>
                    <ToggleSwitch checked={coreSettings.maintenanceMode} onChange={(isChecked) => handleSettingToggle('maintenanceMode', isChecked)} />
                </div>
                {coreSettings.maintenanceMode && (
                    <div>
                        <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-400 mb-1">Maintenance Message</label>
                        <textarea id="maintenanceMessage" name="maintenanceMessage" value={coreSettings.maintenanceMessage} onChange={handleSettingsChange} rows={3} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600" />
                    </div>
                )}
            </Card>

            <Card title="API Integrations" icon={faKey}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-400 mb-1">Google Analytics ID</label>
                        <input type="text" id="googleAnalyticsId" name="googleAnalyticsId" value={coreSettings.googleAnalyticsId} onChange={handleSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="stripeApiKey" className="block text-sm font-medium text-gray-400 mb-1">Stripe API Key</label>
                        <input type="text" id="stripeApiKey" name="stripeApiKey" value={coreSettings.stripeApiKey} onChange={handleSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-gray-600" />
                    </div>
                </div>
            </Card>

            <Card title="Feature Flags" icon={faToggleOn}>
                <div className="space-y-4 divide-y divide-gray-800">
                    <div className="flex items-center justify-between pt-4 first:pt-0">
                        <div>
                            <p className="font-medium text-gray-200">Enable New Dashboard UI</p>
                            <p className="text-xs text-gray-500">Allow users to opt-in to the new experimental UI.</p>
                        </div>
                        <ToggleSwitch checked={coreSettings.enableNewDashboardUI} onChange={(isChecked) => handleSettingToggle('enableNewDashboardUI', isChecked)} />
                    </div>
                    <div className="flex items-center justify-between pt-4">
                        <div>
                            <p className="font-medium text-gray-200">Activate Beta Reporting Engine</p>
                            <p className="text-xs text-gray-500">Use the new, faster reporting engine for generating insights.</p>
                        </div>
                        <ToggleSwitch checked={coreSettings.activateBetaReporting} onChange={(isChecked) => handleSettingToggle('activateBetaReporting', isChecked)} />
                    </div>
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

export default CoreSystemTab;