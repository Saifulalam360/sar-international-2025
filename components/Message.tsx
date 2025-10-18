import React from 'react';
// Fix: Use relative path for local module import.
import type { Message as MessageType } from '../types';

interface MessageProps {
    message: MessageType;
    contactAvatarUrl: string;
}

const Message: React.FC<MessageProps> = ({ message, contactAvatarUrl }) => {
    const isMe = message.sender === 'me';
    const platform = message.platform;

    const getBubbleClasses = () => {
        if (platform === 'whatsapp') {
            return isMe ? 'bg-[#075E54] text-white rounded-br-none' : 'bg-[#202C33] text-white rounded-bl-none';
        }
        if (platform === 'messenger') {
            return isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-[#3E4042] text-white rounded-bl-none';
        }
        return isMe ? 'bg-blue-900 rounded-br-none' : 'bg-[#161B22] rounded-bl-none';
    };
    
    const getTimestampClasses = () => {
        if (platform === 'whatsapp') {
            return isMe ? 'text-green-200/50' : 'text-gray-400/70';
        }
         if (platform === 'messenger') {
            return isMe ? 'text-blue-200/60' : 'text-gray-400/80';
        }
        return isMe ? 'text-blue-200/50' : 'text-gray-500';
    }

    return (
        <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {!isMe && <img src={contactAvatarUrl} alt="avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${getBubbleClasses()}`}>
                <p className="text-sm">{message.text}</p>
                 <p className={`text-xs mt-1 text-right ${getTimestampClasses()}`}>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
    );
};

export default Message;