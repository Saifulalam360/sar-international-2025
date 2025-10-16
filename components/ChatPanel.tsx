

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSmile } from '@fortawesome/free-solid-svg-icons';
import type { Conversation, Message as MessageType } from '../types';
import Message from './Message';

interface ChatPanelProps {
    conversation: Conversation;
    messages: MessageType[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ conversation, messages }) => {
    return (
        <div className="flex-1 flex flex-col">
            <header className="flex items-center gap-4 p-4 border-b border-gray-700">
                <img src={conversation.avatarUrl} alt={conversation.contactName} className="w-10 h-10 rounded-full" />
                <div>
                    <h3 className="font-bold">{conversation.contactName}</h3>
                    <p className="text-xs text-green-400">Online</p>
                </div>
            </header>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map(msg => <Message key={msg.id} message={msg} contactAvatarUrl={conversation.avatarUrl} />)}
            </div>
            <footer className="p-4 border-t border-gray-700">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Type a message..."
                        className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-3 pl-4 pr-32 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                         <button className="text-gray-400 hover:text-white p-2"><FontAwesomeIcon icon={faSmile} /></button>
                         <button className="text-gray-400 hover:text-white p-2"><FontAwesomeIcon icon={faPaperclip} /></button>
                         <button className="bg-gray-200 hover:bg-white text-gray-900 rounded-md w-10 h-8 flex items-center justify-center transition-colors"><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ChatPanel;