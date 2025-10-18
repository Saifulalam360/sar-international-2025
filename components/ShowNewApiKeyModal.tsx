import React, { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
// Fix: Use relative path for local module import.
import type { ApiKey } from '../types';

interface ShowNewApiKeyModalProps {
  apiKey: ApiKey;
  onClose: () => void;
}

const ShowNewApiKeyModal: React.FC<ShowNewApiKeyModalProps> = ({ apiKey, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey.key).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <Modal title="API Key Created Successfully" onClose={onClose}>
      <div className="space-y-6">
        <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-500/30 flex items-start gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-300 mt-1"/>
            <div>
                <h3 className="font-semibold text-yellow-300">Please save this secret key!</h3>
                <p className="text-sm text-yellow-400/80">This is the only time you will be able to see this key. Store it in a secure location.</p>
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{apiKey.name}</label>
            <div className="flex items-center gap-2 bg-[#0D1117] border border-gray-700 rounded-lg p-2">
                <input
                    type="text"
                    value={apiKey.key}
                    readOnly
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-mono text-gray-300"
                />
                <Button variant="secondary" onClick={handleCopy} leftIcon={copied ? faCheck : faCopy}>
                    {copied ? 'Copied!' : 'Copy'}
                </Button>
            </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ShowNewApiKeyModal;
