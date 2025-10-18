import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faBell, faGlobe, faSpinner, faSave } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';
import ToggleSwitch from '../ui/ToggleSwitch';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

const GeneralTab: React.FC = () => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    theme: 'Dark',
    accentColor: '#60a5fa',
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    language: 'en-US',
    timezone: 'UTC-5',
  });

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value, }));
  };
  
  const handleSettingToggle = (name: keyof typeof generalSettings, value: boolean) => {
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await new Promise(res => setTimeout(res, 1000));
    setIsSaving(false);
    addToast({ message: `General settings saved!`, type: 'success' });
  };

  return (
    <div className="space-y-6">
      <Card title="Appearance" icon={faPalette}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-400 mb-1">Theme</label>
            <select name="theme" id="theme" value={generalSettings.theme} onChange={handleSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
              <option>Dark</option>
              <option>Light</option>
            </select>
          </div>
          <div>
            <label htmlFor="accentColor" className="block text-sm font-medium text-gray-400 mb-1">Accent Color</label>
            <input type="color" name="accentColor" id="accentColor" value={generalSettings.accentColor} onChange={handleSettingsChange} className="w-full h-10 bg-[#161B22] border border-gray-700 rounded-lg p-1 focus:outline-none focus:ring-1 focus:ring-gray-600" />
          </div>
        </div>
      </Card>

      <Card title="Notifications" icon={faBell}>
        <div className="space-y-4 divide-y divide-gray-800">
          <div className="flex items-center justify-between pt-4 first:pt-0">
            <div>
                <p className="font-medium text-gray-200">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive important updates and alerts via email.</p>
            </div>
            <ToggleSwitch checked={generalSettings.emailNotifications} onChange={(isChecked) => handleSettingToggle('emailNotifications', isChecked)} />
          </div>
            <div className="flex items-center justify-between pt-4">
            <div>
                <p className="font-medium text-gray-200">Push Notifications</p>
                <p className="text-xs text-gray-500">Get native desktop notifications.</p>
            </div>
            <ToggleSwitch checked={generalSettings.pushNotifications} onChange={(isChecked) => handleSettingToggle('pushNotifications', isChecked)} />
          </div>
            <div className="flex items-center justify-between pt-4">
            <div>
                <p className="font-medium text-gray-200">Weekly Summary</p>
                <p className="text-xs text-gray-500">Receive a summary of your dashboard activity every week.</p>
            </div>
            <ToggleSwitch checked={generalSettings.weeklySummary} onChange={(isChecked) => handleSettingToggle('weeklySummary', isChecked)} />
          </div>
        </div>
      </Card>

      <Card title="Language & Region" icon={faGlobe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-400 mb-1">Language</label>
            <select name="language" id="language" value={generalSettings.language} onChange={handleSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
              <option value="en-US">English (United States)</option>
              <option value="es-ES">Español (España)</option>
              <option value="fr-FR">Français (France)</option>
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-400 mb-1">Timezone</label>
            <select name="timezone" id="timezone" value={generalSettings.timezone} onChange={handleSettingsChange} className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC+0 (Greenwich Mean Time)</option>
              <option>UTC+8 (China Standard Time)</option>
            </select>
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

export default GeneralTab;