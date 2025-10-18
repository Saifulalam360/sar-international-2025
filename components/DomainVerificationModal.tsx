import React, { useState } from 'react';
// Fix: Use relative path for local module import.
import type { CustomDomain, DnsRecord } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface DomainVerificationModalProps {
  domain: CustomDomain;
  onClose: () => void;
  onVerify: (domainId: number) => void;
}

const DnsRecordRow: React.FC<{ record: DnsRecord }> = ({ record }) => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (field: 'host' | 'value', text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(field);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const CopyButton: React.FC<{ field: 'host' | 'value', text: string }> = ({ field, text }) => (
        <button
            onClick={() => handleCopy(field, text)}
            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100"
            aria-label={`Copy ${field}`}
        >
            <FontAwesomeIcon icon={copied === field ? faCheck : faCopy} className={copied === field ? 'text-green-400' : ''} />
        </button>
    );

    return (
        <tr className="border-b border-gray-800 last:border-b-0">
            <td className="px-4 py-3 font-mono text-gray-400">{record.type}</td>
            <td className="px-4 py-3 font-mono">
                <div className="flex justify-between items-center group">
                    <span>{record.host}</span>
                    <CopyButton field="host" text={record.host} />
                </div>
            </td>
            <td className="px-4 py-3 font-mono break-all">
                <div className="flex justify-between items-center group">
                    <span>{record.value}</span>
                    <CopyButton field="value" text={record.value} />
                </div>
            </td>
            <td className="px-4 py-3 font-mono text-gray-400">{record.ttl}</td>
        </tr>
    );
};


const DomainVerificationModal: React.FC<DomainVerificationModalProps> = ({ domain, onClose, onVerify }) => {
  return (
    <Modal title={`Verify ${domain.domainName}`} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          To verify your domain, add the following DNS records to your domain provider's settings. Records may take a few minutes to propagate.
        </p>
        <div className="bg-[#0D1117] rounded-lg border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-[#161B22] text-xs text-gray-500 uppercase">
                    <tr>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left w-1/4">Host</th>
                        <th className="px-4 py-2 text-left">Value</th>
                        <th className="px-4 py-2 text-left">
                            <div className="flex items-center gap-1.5 group relative">
                                TTL
                                <FontAwesomeIcon icon={faInfoCircle} className="cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 px-3 py-1.5 rounded-md shadow-lg text-xs font-medium whitespace-nowrap bg-black/80 backdrop-blur-sm border border-gray-700 text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                    Time To Live (in seconds). Your provider's default is usually fine.
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {domain.dnsRecords.map((record, index) => (
                        <DnsRecordRow key={index} record={record} />
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Done
          </Button>
          <Button type="button" onClick={() => onVerify(domain.id)}>
            Verify Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DomainVerificationModal;