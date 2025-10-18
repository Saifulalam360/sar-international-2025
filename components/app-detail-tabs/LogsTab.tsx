import React from 'react';
import type { LogEntry } from '../../types';

const LOG_LEVEL_COLORS: Record<LogEntry['level'], string> = {
    INFO: 'text-cyan-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400'
};

interface LogsTabProps {
    logs: LogEntry[];
}

const LogsTab: React.FC<LogsTabProps> = ({ logs }) => {
    return (
        <div className="bg-[#010409] font-mono text-xs text-gray-300 p-4 rounded-lg border border-gray-800 h-96 overflow-y-auto">
            {logs.map(log => (
                <p key={log.id}>
                    <span className="text-gray-500 mr-4">{log.timestamp.toLocaleTimeString()}</span>
                    <span className={`${LOG_LEVEL_COLORS[log.level]} font-bold mr-2`}>{log.level}</span>
                    {log.message}
                </p>
            ))}
        </div>
    );
};

export default LogsTab;
