import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface Tab {
    id: string;
    label: string;
    icon: IconDefinition;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    initialTabId?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, initialTabId }) => {
    const [activeTab, setActiveTab] = useState(initialTabId || tabs[0]?.id);

    return (
        <div>
            <div className="flex border-b border-gray-700 mb-6">
                {tabs.map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id)} 
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                    >
                        <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex-1">
                {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default Tabs;
