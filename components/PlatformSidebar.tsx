
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox, faPaperPlane, faVoicemail } from '@fortawesome/free-solid-svg-icons';

const PlatformSidebar: React.FC = () => {
  return (
    <aside className="w-20 bg-[#0D1117] p-4 flex flex-col items-center gap-6">
      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-2xl">
        M
      </div>
      <nav className="flex flex-col gap-4">
        <button className="w-12 h-12 rounded-lg bg-[#161B22] flex items-center justify-center text-purple-400" title="Inbox">
          <FontAwesomeIcon icon={faInbox} size="lg" />
        </button>
        <button className="w-12 h-12 rounded-lg hover:bg-[#161B22] flex items-center justify-center text-gray-400" title="Sent">
          <FontAwesomeIcon icon={faPaperPlane} size="lg" />
        </button>
        <button className="w-12 h-12 rounded-lg hover:bg-[#161B22] flex items-center justify-center text-gray-400" title="Voicemail">
          <FontAwesomeIcon icon={faVoicemail} size="lg" />
        </button>
      </nav>
    </aside>
  );
};

export default PlatformSidebar;