import React, { useState, useMemo } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { PERMISSION_CATEGORIES, ALL_PERMISSIONS } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface CreateApiKeyModalProps {
  onClose: () => void;
  onSave: (data: { name: string; scopes: string[] }) => void;
}

const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [scopeSearchTerm, setScopeSearchTerm] = useState('');

  const filteredPermissions = useMemo(() => {
    if (!scopeSearchTerm) {
      return PERMISSION_CATEGORIES;
    }
    const lowercasedFilter = scopeSearchTerm.toLowerCase();
    const filtered: Record<string, string[]> = {};

    for (const category in PERMISSION_CATEGORIES) {
      const matchingScopes = PERMISSION_CATEGORIES[category].filter(scope =>
        scope.toLowerCase().includes(lowercasedFilter)
      );
      if (matchingScopes.length > 0) {
        filtered[category] = matchingScopes;
      }
    }
    return filtered;
  }, [scopeSearchTerm]);

  const visibleScopes = useMemo(() => Object.values(filteredPermissions).flat(), [filteredPermissions]);


  const handleScopeChange = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  const handleSelectAllVisible = () => {
    setSelectedScopes(prev => [...new Set([...prev, ...visibleScopes])]);
  };

  const handleClearAllVisible = () => {
    setSelectedScopes(prev => prev.filter(s => !visibleScopes.includes(s)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Please provide a name for the API key.');
      return;
    }
    if (selectedScopes.length === 0) {
      alert('Please select at least one permission scope for the API key.');
      return;
    }
    onSave({ name, scopes: selectedScopes });
  };

  return (
    <Modal title="Create New API Key" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Key Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., My Production Key"
            required
          />
        </div>
        <div className="space-y-4">
            <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search permissions..."
                    value={scopeSearchTerm}
                    onChange={(e) => setScopeSearchTerm(e.target.value)}
                    className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
            </div>
           <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-400">
              Permissions ({selectedScopes.length} selected)
            </label>
            <div className="flex gap-2">
                <button type="button" onClick={handleSelectAllVisible} className="text-xs font-semibold text-blue-400 hover:underline">Select Visible</button>
                <button type="button" onClick={handleClearAllVisible} className="text-xs font-semibold text-gray-400 hover:underline">Clear Visible</button>
            </div>
          </div>
          <div className="p-3 bg-[#0D1117] rounded-lg border border-gray-800 max-h-60 overflow-y-auto space-y-4">
            {/* Fix: Use Object.keys to iterate and ensure 'scopes' is correctly typed. */}
            {Object.keys(filteredPermissions).map(category => {
                const scopes = filteredPermissions[category];
                return (
                    <div key={category}>
                        <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 px-1">{category}</h4>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                            {scopes.map(permission => (
                                <label key={permission} htmlFor={`${permission}-checkbox`} className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-gray-800/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id={`${permission}-checkbox`}
                                        checked={selectedScopes.includes(permission)}
                                        onChange={() => handleScopeChange(permission)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-4 h-4 rounded flex items-center justify-center bg-[#0D1117] border-2 border-gray-600 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex-shrink-0">
                                        <svg className="w-2.5 h-2.5 text-white hidden peer-checked:block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-300 font-mono select-none">{permission}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
             {Object.keys(filteredPermissions).length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">No permissions found.</p>
             )}
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Key
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateApiKeyModal;