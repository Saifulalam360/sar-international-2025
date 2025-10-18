import React, { useState, useMemo } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import type { Administrator } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface NewConversationModalProps {
  administrators: Administrator[];
  currentUser: Administrator;
  onClose: () => void;
  onSave: (contactId: number, message: string) => Promise<number | null>;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ administrators, currentUser, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState<Administrator | null>(null);
  const [message, setMessage] = useState('');

  const availableContacts = useMemo(() =>
    administrators.filter(admin =>
      admin.id !== currentUser.id && admin.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [administrators, currentUser, searchTerm]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin || !message.trim()) {
      alert('Please select a contact and write a message.');
      return;
    }
    await onSave(selectedAdmin.id, message.trim());
    onClose();
  };

  return (
    <Modal title="New Message" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contact-search" className="block text-sm font-medium text-gray-400 mb-1">To:</label>
          {selectedAdmin ? (
            <div className="flex items-center gap-2 bg-[#0D1117] border border-gray-700 rounded-lg p-2">
              <img src={selectedAdmin.avatarUrl} alt={selectedAdmin.name} className="w-6 h-6 rounded-full" />
              <span className="text-sm">{selectedAdmin.name}</span>
              <button type="button" onClick={() => setSelectedAdmin(null)} className="ml-auto text-xs text-red-400 hover:underline">
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                id="contact-search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Search for an administrator..."
              />
              {searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-[#0D1117] border border-gray-700 rounded-lg max-h-40 overflow-y-auto">
                  {availableContacts.length > 0 ? (
                    availableContacts.map(admin => (
                      <div
                        key={admin.id}
                        onClick={() => { setSelectedAdmin(admin); setSearchTerm(''); }}
                        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#161B22]"
                      >
                        <img src={admin.avatarUrl} alt={admin.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-semibold text-sm">{admin.name}</p>
                          <p className="text-xs text-gray-500">{admin.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-center text-gray-500">No contacts found.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!selectedAdmin || !message.trim()}>
            Send Message
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewConversationModal;
