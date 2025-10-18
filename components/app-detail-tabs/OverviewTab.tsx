import React, { useState } from 'react';
import type { ManagedApp } from '../../types';

const ResourceChart: React.FC<{ title: string; data: number[], color: string }> = ({ title, data, color }) => {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number } | null>(null);
    const svgHeight = 80;
    const svgWidth = 400;
    const padding = { top: 10, right: 0, bottom: 20, left: 25 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const maxVal = 100; // Use a fixed max of 100 for percentages
    
    const getCoords = (val: number, index: number) => ({
        x: padding.left + (index / (data.length - 1)) * chartWidth,
        y: padding.top + chartHeight - (val / maxVal) * chartHeight,
    });

    const path = data.length > 1 ? data.map((d, i) => `${getCoords(d, i).x},${getCoords(d, i).y}`).join(' L ') : '';
    
    const gridLines = [0, 25, 50, 75, 100];

    return (
        <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 flex-1">
            <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-sm font-semibold">{title}</h4>
                <p className="text-2xl font-bold text-white">{data[data.length-1]}<span className="text-base font-normal text-gray-400">%</span></p>
            </div>
            <div className="relative">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" className="w-full h-24">
                    {/* Grid Lines and Labels */}
                    {gridLines.map(line => {
                        const y = getCoords(line, 0).y;
                        return (
                            <g key={line}>
                                <line x1={padding.left} y1={y} x2={svgWidth - padding.right} y2={y} stroke="#374151" strokeWidth="0.25" />
                                <text x={0} y={y + 3} fill="#6b7280" fontSize="8">{line}%</text>
                            </g>
                        );
                    })}
                    
                    {/* Line */}
                    {path && <path d={`M ${path}`} fill="none" stroke={color} strokeWidth="1.5" />}
                    
                    {/* Interactive Points */}
                    {data.map((d, i) => {
                        const { x, y } = getCoords(d, i);
                        return (
                            <circle 
                                key={i}
                                cx={x} cy={y} r="6"
                                fill="transparent"
                                onMouseEnter={() => setTooltip({ x, y, value: d })}
                                onMouseLeave={() => setTooltip(null)}
                            />
                        );
                    })}
                </svg>
                {/* Tooltip */}
                {tooltip && (
                    <div 
                        className="absolute bg-black text-white text-xs rounded py-1 px-2 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                        style={{ left: `${(tooltip.x / svgWidth) * 100}%`, top: tooltip.y - 8 }}
                    >
                        {tooltip.value}%
                    </div>
                )}
            </div>
        </div>
    )
};

interface OverviewTabProps {
    app: ManagedApp;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ app }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
                <ResourceChart title="CPU Usage" data={app.resources.cpu} color="#3b82f6" />
                <ResourceChart title="Memory Usage" data={app.resources.memory} color="#22c55e" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800">
                    <h4 className="text-sm font-semibold mb-2">Storage</h4>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(app.resources.storage.used / app.resources.storage.total) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">{app.resources.storage.used} GB / {app.resources.storage.total} GB</p>
                </div>
                <div className="bg-[#0D1117] p-4 rounded-lg border border-gray-800">
                    <h4 className="text-sm font-semibold mb-2">Key Details</h4>
                    <p className="text-xs text-gray-400"><strong>Repo:</strong> <a href={`https://${app.repository}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{app.repository}</a></p>
                    <p className="text-xs text-gray-400"><strong>Last Deployed:</strong> {app.lastDeployed.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
