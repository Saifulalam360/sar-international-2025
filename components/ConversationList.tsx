import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faComments } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
// Fix: Use relative path for local module import.
import type { Conversation, Administrator } from '../types';
// Fix: Use relative path for local module import.
import { useDataContext } from '../contexts/DataContext';
import NewConversationModal from './NewConversationModal';

interface ConversationListProps {
    onSelectConversation: (conversation: Conversation) => void;
    selectedConversationId?: number;
    administrators: Administrator[];
    currentUser: Administrator;
    onStartConversation: (contactId: number, message: string) => Promise<number | null>;
}

const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (messageDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ConversationList: React.FC<ConversationListProps> = ({ 
    onSelectConversation, 
    selectedConversationId,
    administrators,
    currentUser,
    onStartConversation,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { conversations, activePlatform } = useDataContext();

    const filteredConversations = useMemo(() => {
        return conversations
            .filter(convo => 
                convo.platform === activePlatform &&
                convo.contactName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [conversations, searchTerm, activePlatform]);

    const handleSaveNewConversation = async (contactId: number, message: string) => {
        const newConversationId = await onStartConversation(contactId, message);
        if (newConversationId) {
            // A bit of a hack to satisfy the type, as we only have the ID here.
            // App.tsx will find the full conversation object.
            onSelectConversation({ id: newConversationId } as Conversation);
        }
        return newConversationId;
    };


    return (
      <>
        <div className="w-80 flex flex-col border-r border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-8 h-8 rounded-full hover:bg-gray-700/50 flex items-center justify-center text-gray-400"
                        aria-label="New Message"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
                 <div className="relative mt-4">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0D1117] border border-gray-600 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" 
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                    filteredConversations.map(convo => (
                        <div 
                            key={convo.id}
                            onClick={() => onSelectConversation(convo)}
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#0D1117] relative transition-colors duration-150 ${selectedConversationId === convo.id ? 'bg-[#0D1117]' : ''}`}
                        >
                            {selectedConversationId === convo.id && <div className="absolute left-0 top-0 h-full w-1 bg-purple-500 rounded-r-full"></div>}
                            <div className="relative">
                                <img src={convo.avatarUrl} alt={convo.contactName} className="w-12 h-12 rounded-full" />
                                {convo.status === 'online' && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-[#161B22]"></span>}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-sm truncate">{convo.contactName}</h3>
                                        {convo.platform === 'whatsapp' && <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 text-xs" />}
                                        {convo.platform === 'messenger' && <FontAwesomeIcon icon={faFacebookMessenger} className="text-blue-500 text-xs" />}
                                    </div>
                                    <p className="text-xs text-gray-500">{formatTimestamp(convo.timestamp)}</p>
                                </div>
                                <div className="flex justify-between items-start">
                                    <p className="text-xs text-gray-400 truncate">{convo.lastMessage}</p>
                                    {convo.unreadCount > 0 && <span className="text-xs bg-purple-600 text-white rounded-full px-2 py-0.5 font-semibold">{convo.unreadCount}</span>}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 p-8 flex flex-col items-center justify-center h-full">
                        <FontAwesomeIcon icon={faComments} className="text-4xl mb-4 text-gray-600" />
                        <h4 className="font-semibold text-gray-400">No Conversations</h4>
                        <p className="text-xs">No conversations match your search in this platform.</p>
                    </div>
                )}
            </div>
        </div>
        {isModalOpen && (
            <NewConversationModal
                administrators={administrators}
                currentUser={currentUser}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNewConversation}
            />
        )}
      </>
    );
};

export default ConversationList;