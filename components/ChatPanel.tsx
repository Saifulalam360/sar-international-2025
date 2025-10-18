import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faPaperclip, faSmile, faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import type { Conversation, Message as MessageType } from '../types';
import Message from './Message';
import { useDataContext } from '../contexts/DataContext';
import { useTextareaAutoResize } from '../hooks/useTextareaAutoResize';

interface ChatPanelProps {
    conversation: Conversation;
    messages: MessageType[];
    onBack: () => void;
    onShowDetails: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ conversation, messages, onBack, onShowDetails }) => {
    const { handleSendMessage, typingStatus } = useDataContext();
    const [newMessage, setNewMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useTextareaAutoResize(textareaRef, newMessage);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            handleSendMessage(newMessage.trim(), conversation.id, conversation.platform);
            setNewMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    
    const isContactTyping = typingStatus[conversation.id];

    const getPlatformChatTitle = () => {
        switch (conversation.platform) {
            case 'whatsapp':
                return 'WhatsApp Chat with ';
            case 'messenger':
                return 'Messenger Chat with ';
            default:
                return '';
        }
    };

    const getPlaceholderText = () => {
        switch (conversation.platform) {
            case 'whatsapp':
                return 'Type a WhatsApp message...';
            case 'messenger':
                return 'Type a Messenger message...';
            default:
                return 'Type a message...';
        }
    };

    const HeaderContent = () => (
      <>
        <img src={conversation.avatarUrl} alt={conversation.contactName} className="w-10 h-10 rounded-full" />
        <div className="flex-1 overflow-hidden">
            <h3 className="font-bold truncate">{getPlatformChatTitle()}{conversation.contactName}</h3>
            {isContactTyping ? (
                <p className="text-xs text-purple-400 animate-pulse">typing...</p>
            ) : (
                <p className="text-xs text-green-400">Online</p>
            )}
        </div>
      </>
    );

    return (
        <div className="flex-1 flex flex-col h-full">
             {/* Mobile Header */}
            <header className="md:hidden flex items-center gap-3 p-4 border-b border-gray-700 flex-shrink-0">
                <button onClick={onBack} className="text-gray-400 hover:text-white p-2 -ml-2">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <HeaderContent />
                <button onClick={onShowDetails} className="text-gray-400 hover:text-white p-2 -mr-2">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </button>
            </header>
            {/* Desktop Header */}
            <header className="hidden md:flex items-center gap-4 p-4 border-b border-gray-700 flex-shrink-0">
                <HeaderContent />
            </header>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map(msg => <Message key={msg.id} message={msg} contactAvatarUrl={conversation.avatarUrl} />)}
                <div ref={messagesEndRef} />
            </div>
            <footer className="p-4 border-t border-gray-700">
                 <form onSubmit={handleSubmit} className="flex items-start gap-2 bg-[#0D1117] border border-gray-700 rounded-xl p-2">
                    <button type="button" className="text-gray-400 hover:text-white p-2 mt-1.5 rounded-full hover:bg-gray-700/50 transition-colors">
                        <FontAwesomeIcon icon={faSmile} size="lg" />
                    </button>
                    <textarea 
                        ref={textareaRef}
                        rows={1}
                        placeholder={getPlaceholderText()}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-500 resize-none max-h-24 overflow-y-auto py-2.5"
                    />
                    <button type="button" className="text-gray-400 hover:text-white p-2 mt-1.5 rounded-full hover:bg-gray-700/50 transition-colors">
                        <FontAwesomeIcon icon={faPaperclip} size="lg" />
                    </button>
                    <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg w-10 h-10 flex items-center justify-center flex-shrink-0 transition-colors self-end">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatPanel;