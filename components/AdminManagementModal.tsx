import React, { useState } from 'react';
import type { Administrator } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface AdminManagementModalProps {
  mode: 'add';
  onClose: () => void;
  onSave: (admin: Omit<Administrator, 'id' | 'avatarUrl' | 'status' | 'lastLogin' | 'twoFactorEnabled' | 'permissions' | 'activityLogs' | 'storageUsage'>) => void;
}

const AdminManagementModal: React.FC<AdminManagementModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Administrator['role']>('Support Staff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please fill in both name and email.');
      return;
    }

    onSave({ name, email, role });
    onClose();
  };
  
  const modalTitle = 'Add New Administrator';
  const saveButtonText = 'Add Administrator';

  return (
    <Modal title={modalTitle} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">Role</label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value as Administrator['role'])}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="System Administrator">System Administrator</option>
            <option value="Manager">Manager</option>
            <option value="Support Staff">Support Staff</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {saveButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminManagementModal;