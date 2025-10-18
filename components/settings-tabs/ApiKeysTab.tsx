import React, { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisV, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { ApiKey } from '../../types';
import { useDataContext } from '../../contexts/DataContext';
import { useConfirmation } from '../../contexts/ConfirmationContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import DataTable, { ColumnDefinition } from '../common/DataTable';
import CreateApiKeyModal from '../CreateApiKeyModal';
import ShowNewApiKeyModal from '../ShowNewApiKeyModal';

const API_KEY_STATUS_STYLES: Record<ApiKey['status'], string> = {
    'Active': 'bg-green-500/20 text-green-400',
    'Revoked': 'bg-yellow-500/20 text-yellow-400',
};

const ApiKeysTab: React.FC = () => {
    const { apiKeys, handleAddApiKey, handleRevokeApiKey, handleDeleteApiKey } = useDataContext();
    const confirm = useConfirmation();

    const [isCreateKeyModalOpen, setCreateKeyModalOpen] = useState(false);
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
    const [activeActionMenu, setActiveActionMenu] = useState<number | string | null>(null);
    
    const handleCreateApiKey = useCallback((keyData: { name: string; scopes: string[] }) => {
        const newKey = handleAddApiKey(keyData);
        setCreateKeyModalOpen(false);
        setNewlyCreatedKey(newKey);
    }, [handleAddApiKey]);

    const toggleActionMenu = useCallback((id: number | string) => {
        setActiveActionMenu(prev => prev === id ? null : id);
    }, []);

    const handleRevokeKey = useCallback(async (key: ApiKey) => {
        setActiveActionMenu(null);
        const confirmed = await confirm({
          title: `Revoke "${key.name}"?`,
          message: 'Are you sure you want to revoke this API key? It will no longer be able to access the API.',
          confirmText: 'Revoke Key',
          confirmVariant: 'danger'
        });
        if (confirmed) {
          handleRevokeApiKey(key.id);
        }
    }, [confirm, handleRevokeApiKey]);
    
    const handleDeleteKey = useCallback(async (key: ApiKey) => {
      setActiveActionMenu(null);
      const confirmed = await confirm({
          title: `Delete "${key.name}"?`,
          message: 'Are you sure you want to permanently delete this key? This action is irreversible.',
          confirmText: 'Delete Permanently',
          confirmVariant: 'danger'
      });
      if (confirmed) {
          handleDeleteApiKey(key.id);
      }
    }, [confirm, handleDeleteApiKey]);

    const apiKeyColumns: ColumnDefinition<ApiKey>[] = [
        { key: 'name', header: 'Name' },
        { key: 'key', header: 'Key', render: (key) => <span className="font-mono">{key.key.substring(0, 9)}...{key.key.substring(key.key.length - 4)}</span> },
        { key: 'status', header: 'Status', render: (key) => <span className={`px-2 py-1 text-xs font-bold rounded-full ${API_KEY_STATUS_STYLES[key.status]}`}>{key.status}</span> },
        { key: 'scopes', header: 'Scopes', render: (key) => <div className="flex flex-wrap gap-1">{key.scopes.map(s => <span key={s} className="text-xs bg-gray-700 px-2 py-0.5 rounded">{s}</span>)}</div> },
        { key: 'createdAt', header: 'Created', render: (key) => key.createdAt.toLocaleDateString() },
        { key: 'lastUsed', header: 'Last Used', render: (key) => key.lastUsed ? key.lastUsed.toLocaleDateString() : 'Never' },
        { key: 'actions', header: 'Actions', render: (key) => (
            <div className="relative inline-block text-right">
                <button onClick={() => toggleActionMenu(key.id)} className="p-2 rounded-full hover:bg-gray-700" aria-label="Actions">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </button>
                {activeActionMenu === key.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-[#161B22] border border-gray-700 rounded-md shadow-lg z-10 origin-top-right">
                         <button disabled={key.status === 'Revoked'} onClick={() => handleRevokeKey(key)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            <FontAwesomeIcon icon={faBan} className="w-4 h-4"/>
                            Revoke
                        </button>
                        <button onClick={() => handleDeleteKey(key)} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        )}
    ];

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">API Key Management</h3>
                        <p className="text-sm text-gray-400">Create and manage API keys for external services.</p>
                    </div>
                    <Button onClick={() => setCreateKeyModalOpen(true)} leftIcon={faPlus}>
                        Create API Key
                    </Button>
                </div>
                <DataTable columns={apiKeyColumns} data={apiKeys} />
            </Card>
            {isCreateKeyModalOpen && (
                <CreateApiKeyModal
                onClose={() => setCreateKeyModalOpen(false)}
                onSave={handleCreateApiKey}
                />
            )}
            {newlyCreatedKey && (
                <ShowNewApiKeyModal
                apiKey={newlyCreatedKey}
                onClose={() => setNewlyCreatedKey(null)}
                />
            )}
        </>
    );
};

export default ApiKeysTab;