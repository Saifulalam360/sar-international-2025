
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import type { Conversation } from '../types';

interface ConversationListProps {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    selectedConversationId?: number;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, onSelectConversation, selectedConversationId }) => {
    return (
        <div className="w-80 flex flex-col border-r border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold">Messages</h2>
                 <div className="relative mt-4">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input type="text" placeholder="Search..." className="w-full bg-[#0D1117] border border-gray-600 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map(convo => (
                    <div 
                        key={convo.id}
                        onClick={() => onSelectConversation(convo)}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#0D1117] ${selectedConversationId === convo.id ? 'bg-[#0D1117]' : ''}`}
                    >
                        <div className="relative">
                            <img src={convo.avatarUrl} alt={convo.contactName} className="w-12 h-12 rounded-full" />
                            {convo.status === 'online' && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-[#161B22]"></span>}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-sm truncate">{convo.contactName}</h3>
                                <p className="text-xs text-gray-500">{convo.timestamp}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <p className="text-xs text-gray-400 truncate">{convo.lastMessage}</p>
                                {convo.unreadCount > 0 && <span className="text-xs bg-purple-600 text-white rounded-full px-2 py-0.5 font-semibold">{convo.unreadCount}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConversationList;