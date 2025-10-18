import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface EnvVarModalProps {
  onClose: () => void;
  onSave: (variable: { key: string; value: string }, originalKey?: string) => void;
  initialData?: { key: string; value: string };
}

const EnvVarModal: React.FC<EnvVarModalProps> = ({ onClose, onSave, initialData }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setKey(initialData.key);
      setValue(initialData.value);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !value.trim()) {
      alert('Both key and value are required.');
      return;
    }
    onSave({ key, value }, isEditing ? initialData?.key : undefined);
    onClose();
  };

  return (
    <Modal title={isEditing ? 'Edit Environment Variable' : 'Add Environment Variable'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="key" className="block text-sm font-medium text-gray-400 mb-1">Key</label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={e => setKey(e.target.value)}
            disabled={isEditing}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            placeholder="e.g., DATABASE_URL"
            required
          />
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-400 mb-1">Value</label>
          <input
            type="text"
            id="value"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., postgres://..."
            required
          />
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Add Variable'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EnvVarModal;
