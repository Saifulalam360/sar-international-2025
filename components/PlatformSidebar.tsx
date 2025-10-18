import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
// Fix: Use relative path for local module import.
import type { MessagePlatform } from '../types';

interface PlatformSidebarProps {
  activePlatform: MessagePlatform;
  onChangePlatform: (platform: MessagePlatform) => void;
}

const PlatformSidebar: React.FC<PlatformSidebarProps> = ({ activePlatform, onChangePlatform }) => {
  const platforms: { id: MessagePlatform, name: string, icon: any }[] = [
    { id: 'default', name: 'Platform', icon: faInbox },
    { id: 'whatsapp', name: 'WhatsApp', icon: faWhatsapp },
    { id: 'messenger', name: 'Messenger', icon: faFacebookMessenger },
  ];

  return (
    <aside className="w-20 bg-[#0D1117] p-4 flex flex-col items-center gap-6">
      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-2xl">
        M
      </div>
      <nav className="flex flex-col gap-4">
        {platforms.map(p => (
          <button
            key={p.id}
            onClick={() => onChangePlatform(p.id)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200 ${
              activePlatform === p.id
                ? 'bg-[#161B22] text-purple-400'
                : 'text-gray-400 hover:bg-[#161B22]'
            }`}
            title={p.name}
          >
            <FontAwesomeIcon icon={p.icon} size="lg" />
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default PlatformSidebar;
