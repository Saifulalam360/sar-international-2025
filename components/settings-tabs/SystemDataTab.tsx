import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCloudUploadAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useDataContext } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SystemDataTab: React.FC = () => {
    const { resetAllData, isLoading } = useDataContext();
    const { addToast } = useToast();
    const confirm = useConfirmation();

    const [resetConfirmation, setResetConfirmation] = useState('');

    const handleFactoryReset = async () => {
        const confirmed = await confirm({
            title: 'ARE YOU ABSOLUTELY SURE?',
            message: 'This will permanently delete all data, including users, applications, and financial records. This action cannot be undone.',
            confirmText: 'Reset System',
            confirmVariant: 'danger'
        });
        if (confirmed) {
            resetAllData();
            setResetConfirmation('');
        }
    };
    
    return (
        <div className="space-y-6">
            <Card title="Export Data" icon={faDownload}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label htmlFor="exportType" className="block text-sm font-medium text-gray-400 mb-1">Data Type</label>
                        <select id="exportType" className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                        <option>All Users</option>
                        <option>Financial Transactions</option>
                        <option>Application Logs</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-400 mb-1">Format</label>
                        <select id="exportFormat" className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                        <option>CSV</option>
                        <option>JSON</option>
                        </select>
                    </div>
                    <Button onClick={() => addToast({message: 'Generating data export...', type: 'info'})}>Export Data</Button>
                </div>
            </Card>

            <Card title="Import Data" icon={faCloudUploadAlt}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label htmlFor="importType" className="block text-sm font-medium text-gray-400 mb-1">Data Type</label>
                        <select id="importType" className="w-full bg-[#161B22] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600">
                        <option>New Users (CSV)</option>
                        <option>Transactions (CSV)</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="importFile" className="block text-sm font-medium text-gray-400 mb-1">File</label>
                        <input type="file" id="importFile" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600/20 file:text-purple-300 hover:file:bg-purple-600/40" />
                    </div>
                    <Button onClick={() => addToast({message: 'Starting data import process...', type: 'info'})}>Import Data</Button>
                </div>
            </Card>
            
            <div className="bg-red-900/20 p-6 rounded-lg border-2 border-red-500/30">
                <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-3"><FontAwesomeIcon icon={faExclamationTriangle}/>Danger Zone</h3>
                <div className="space-y-6 divide-y divide-red-500/30">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 pt-6 first:pt-0">
                        <div>
                            <p className="font-semibold text-gray-200">Prune Old Data</p>
                            <p className="text-sm text-red-400/80">Permanently delete activity logs older than 90 days.</p>
                        </div>
                        <Button variant="danger" onClick={async () => (await confirm({title: 'Prune Old Data?', message: 'Are you sure you want to delete old log data?', confirmText: 'Prune', confirmVariant: 'danger'})) && addToast({message: 'Old logs pruned.', type: 'info'})}>
                            Prune Data
                        </Button>
                    </div>
                    <div className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                            <div>
                                <p className="font-semibold text-gray-200">Factory Reset</p>
                                <p className="text-sm text-red-400/80">This will wipe all data from the system. This cannot be undone.</p>
                            </div>
                            <Button variant="danger" disabled={resetConfirmation !== 'RESET ALL DATA' || isLoading} onClick={handleFactoryReset}>
                                {isLoading ? 'Resetting...' : 'Reset System'}
                            </Button>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="resetConfirmation" className="block text-sm font-semibold text-red-300 mb-1">To confirm, type "RESET ALL DATA"</label>
                            <input 
                                type="text" 
                                id="resetConfirmation" 
                                value={resetConfirmation}
                                onChange={(e) => setResetConfirmation(e.target.value)}
                                className="w-full md:w-1/2 bg-[#161B22] border border-red-500/50 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-400 placeholder:text-gray-500"
                                placeholder="RESET ALL DATA"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemDataTab;