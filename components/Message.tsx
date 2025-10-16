

import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
    message: MessageType;
    contactAvatarUrl: string;
}

const Message: React.FC<MessageProps> = ({ message, contactAvatarUrl }) => {
    const isMe = message.sender === 'me';
    return (
        <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
            {!isMe && <img src={contactAvatarUrl} alt="avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${isMe ? 'bg-blue-900 rounded-br-none' : 'bg-[#161B22] rounded-bl-none'}`}>
                <p className="text-sm">{message.text}</p>
                 <p className={`text-xs mt-1 text-right ${isMe ? 'text-blue-200/50' : 'text-gray-500'}`}>{message.timestamp}</p>
            </div>
        </div>
    );
};

export default Message;