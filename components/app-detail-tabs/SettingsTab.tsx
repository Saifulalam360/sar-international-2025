import React, { useState } from 'react';
import type { ManagedApp } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button';
import Card from '../ui/Card';
import EnvVarModal from '../EnvVarModal';
import { useConfirmation } from '../../../contexts/ConfirmationContext';
import { useToast } from '../../../contexts/ToastContext';

interface SettingsTabProps {
    app: ManagedApp;
    setApp: React.Dispatch<React.SetStateAction<ManagedApp>>;
    onDelete: (appId: number) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ app, setApp, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variableToEdit, setVariableToEdit] = useState<{ key: string, value: string } | undefined>(undefined);
    const confirm = useConfirmation();
    const { addToast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApp(prev => ({...prev, [e.target.name]: e.target.value }));
    };

    const handleAddVariable = () => {
        setVariableToEdit(undefined);
        setIsModalOpen(true);
    };

    const handleEditVariable = (key: string, value: string) => {
        setVariableToEdit({ key, value });
        setIsModalOpen(true);
    };

    const handleDeleteVariable = async (keyToDelete: string) => {
        const confirmed = await confirm({
            title: `Delete "${keyToDelete}"?`,
            message: 'Are you sure you want to delete this environment variable?',
            confirmText: 'Delete Variable',
            confirmVariant: 'danger'
        });
        if (confirmed) {
            const newEnvVars = { ...app.environmentVariables };
            delete newEnvVars[keyToDelete];
            setApp(prev => ({ ...prev, environmentVariables: newEnvVars }));
            addToast({ message: `Variable "${keyToDelete}" deleted.`, type: 'info' });
        }
    };

    const handleSaveVariable = (variable: { key: string; value: string }, originalKey?: string) => {
        const newEnvVars = { ...app.environmentVariables };
        if (originalKey && originalKey !== variable.key) {
            delete newEnvVars[originalKey];
        }
        newEnvVars[variable.key] = variable.value;
        setApp(prev => ({...prev, environmentVariables: newEnvVars }));
        addToast({ message: `Variable "${variable.key}" saved.`, type: 'success' });
    };
    
    const handleDeleteApp = async () => {
        const confirmed = await confirm({
            title: `Delete "${app.name}"?`,
            message: 'Are you sure you want to delete this application? This action is permanent and cannot be undone.',
            confirmText: 'Delete Application',
            confirmVariant: 'danger'
        });
        if (confirmed) {
            onDelete(app.id);
        }
    };

    return (
        <>
            <div className="space-y-6">
                <Card title="Application Settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Application Name</label>
                            <input type="text" id="name" name="name" value={app.name} onChange={handleInputChange} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="repository" className="block text-sm font-medium text-gray-400 mb-1">Git Repository</label>
                            <input type="text" id="repository" name="repository" value={app.repository} onChange={handleInputChange} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600" />
                        </div>
                    </div>
                </Card>

                <Card title="Environment Variables">
                     <div className="space-y-2 font-mono text-sm">
                        {Object.entries(app.environmentVariables).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 p-2 bg-[#0D1117] rounded border border-gray-800/50">
                                <span className="text-gray-400">{key}=</span>
                                <input type="text" value={String(value)} readOnly className="flex-1 text-white bg-transparent border-none focus:ring-0 p-0" />
                                <button onClick={() => handleEditVariable(key, String(value))} className="text-gray-500 hover:text-white"><FontAwesomeIcon icon={faPen}/></button>
                                <button onClick={() => handleDeleteVariable(key)} className="text-gray-500 hover:text-red-400"><FontAwesomeIcon icon={faTrash}/></button>
                            </div>
                        ))}
                    </div>
                     <Button variant="secondary" className="mt-4" leftIcon={faPlus} onClick={handleAddVariable}>Add Variable</Button>
                </Card>

                <div className="bg-red-900/20 p-6 rounded-lg border border-red-500/30">
                    <h3 className="text-lg font-bold text-red-300 mb-2">Danger Zone</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">Delete this application</p>
                            <p className="text-sm text-red-400/80">Once deleted, it will be gone forever. Please be certain.</p>
                        </div>
                        <Button variant="danger" onClick={handleDeleteApp} leftIcon={faTrash}>
                            Delete Application
                        </Button>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <EnvVarModal 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveVariable}
                    initialData={variableToEdit}
                />
            )}
        </>
    );
};

export default SettingsTab;