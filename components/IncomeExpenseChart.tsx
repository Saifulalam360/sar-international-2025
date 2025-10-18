import React, { useMemo, useState } from 'react';
import type { Transaction } from '../types';

// Helper to format date to YYYY-MM
const getMonthYear = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const IncomeExpenseChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const [tooltip, setTooltip] = useState<{ month: string; income: number; expense: number; x: number; y: number } | null>(null);

    const chartData = useMemo(() => {
        const monthlyData: Record<string, { income: number; expense: number }> = {};
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);

        // Initialize last 6 months to ensure they exist
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = getMonthYear(date);
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expense: 0 };
            }
        }
        
        const relevantTransactions = transactions.filter(t => t.date >= sixMonthsAgo);

        relevantTransactions.forEach(t => {
            const month = getMonthYear(t.date);
            if (!monthlyData[month]) {
                // This case should not happen due to pre-initialization, but as a fallback
                monthlyData[month] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                monthlyData[month].income += t.amount;
            } else {
                monthlyData[month].expense += t.amount;
            }
        });

        return Object.entries(monthlyData)
            .map(([month, data]) => ({ month, ...data }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6); // Ensure we only have the most recent 6 months
            
    }, [transactions]);

    const maxAmount = useMemo(() => {
        if (chartData.length === 0) return 1000;
        const max = Math.max(...chartData.map(d => Math.max(d.income, d.expense)));
        return max === 0 ? 1000 : Math.ceil(max / 1000) * 1000; // Round up to nearest 1000
    }, [chartData]);

    const svgWidth = 500;
    const svgHeight = 200;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;
    const barWidth = chartWidth / chartData.length / 3;

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                {/* Y-axis grid lines and labels */}
                {[0, 0.25, 0.5, 0.75, 1].map(tick => (
                    <g key={tick} className="text-gray-600">
                        <line
                            x1={padding.left} y1={padding.top + (1 - tick) * chartHeight}
                            x2={svgWidth - padding.right} y2={padding.top + (1 - tick) * chartHeight}
                            stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2"
                        />
                        <text
                            x={padding.left - 8} y={padding.top + (1 - tick) * chartHeight + 4}
                            textAnchor="end" fontSize="10" fill="currentColor"
                        >
                            ${(tick * maxAmount).toLocaleString()}
                        </text>
                    </g>
                ))}

                {/* Bars and X-axis labels */}
                {chartData.map((data, index) => {
                    const xBase = padding.left + (index * (chartWidth / chartData.length)) + (chartWidth / chartData.length / 2);
                    const incomeHeight = (data.income / maxAmount) * chartHeight;
                    const expenseHeight = (data.expense / maxAmount) * chartHeight;

                    const incomeX = xBase - barWidth - 2;
                    const expenseX = xBase + 2;
                    
                    const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
                        const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                        if(svgRect){
                            setTooltip({ month: data.month, income: data.income, expense: data.expense, x: e.clientX - svgRect.left, y: e.clientY - svgRect.top });
                        }
                    };

                    return (
                        <g key={data.month}>
                            {/* Income Bar */}
                            <rect
                                x={incomeX}
                                y={padding.top + chartHeight - incomeHeight}
                                width={barWidth}
                                height={incomeHeight}
                                fill="#22c55e"
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                            {/* Expense Bar */}
                             <rect
                                x={expenseX}
                                y={padding.top + chartHeight - expenseHeight}
                                width={barWidth}
                                height={expenseHeight}
                                fill="#ef4444"
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                             {/* Hover target */}
                             <rect
                                x={incomeX}
                                y={padding.top}
                                width={barWidth * 2 + 4}
                                height={chartHeight}
                                fill="transparent"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setTooltip(null)}
                            />

                            {/* X-axis label */}
                            <text
                                x={xBase} y={svgHeight - padding.bottom + 15}
                                textAnchor="middle" fontSize="10" fill="currentColor" className="text-gray-500"
                            >
                                {new Date(data.month + '-02').toLocaleString('default', { month: 'short' })}
                            </text>
                        </g>
                    );
                })}
            </svg>
            
            {/* Tooltip */}
            {tooltip && (
                <div 
                    className="absolute bg-[#0D1117] border border-gray-700 rounded-lg p-3 text-xs shadow-lg pointer-events-none transition-opacity"
                    style={{ left: tooltip.x + 15, top: tooltip.y }}
                >
                    <p className="font-bold mb-1">{new Date(tooltip.month + '-02').toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Income: <span className="font-semibold">${tooltip.income.toLocaleString()}</span></p>
                    <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span>Expense: <span className="font-semibold">${tooltip.expense.toLocaleString()}</span></p>
                </div>
            )}
        </div>
    );
};

export default IncomeExpenseChart;