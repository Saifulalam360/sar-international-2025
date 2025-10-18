import React, { useState } from 'react';
// Fix: Use relative path for local module import.
import type { ManagedApp } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface AppManagementModalProps {
  onClose: () => void;
  onSave: (app: Omit<ManagedApp, 'id' | 'lastDeployed' | 'resources' | 'environmentVariables' | 'deployments' | 'logs' | 'status'>) => void;
}

const AppManagementModal: React.FC<AppManagementModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<ManagedApp['platform']>('Web App');
  const [repository, setRepository] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !repository) {
      alert('Please fill in all fields.');
      return;
    }

    onSave({ name, platform, repository });
    onClose();
  };
  
  return (
    <Modal title="Create New Application" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Application Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., My Awesome Project"
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-400 mb-1">Platform</label>
          <select
            id="platform"
            value={platform}
            onChange={e => setPlatform(e.target.value as ManagedApp['platform'])}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Web App">Web App</option>
            <option value="API Service">API Service</option>
            <option value="Mobile App">Mobile App</option>
            <option value="Database">Database</option>
          </select>
        </div>
        <div>
          <label htmlFor="repository" className="block text-sm font-medium text-gray-400 mb-1">Git Repository URL</label>
          <input
            type="text"
            id="repository"
            value={repository}
            onChange={e => setRepository(e.target.value)}
            placeholder="e.g., github.com/user/repo.git"
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AppManagementModal;
