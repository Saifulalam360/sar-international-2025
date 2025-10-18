import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faReceipt, faHashtag, faChartPie, faFilter } from '@fortawesome/free-solid-svg-icons';
import type { Transaction, TransactionCategory } from '../types';
import PageHeader from './common/PageHeader';
import Card from './ui/Card';
import DataTable, { ColumnDefinition } from './common/DataTable';
import ExpenseTransactionDetail from './ExpenseTransactionDetail';
import { useDataContext } from '../contexts/DataContext';

interface ExpenseDetailViewProps {
  expenses: Transaction[]; // Expects pre-filtered expenses (e.g., last 30 days)
  onBack: () => void;
}

const PIE_CHART_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#f97316'];

const CategoryPieChart: React.FC<{ data: { category: string, amount: number }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>No data for this period.</p>
            </div>
        );
    }

    let cumulativePercentage = 0;

    const getCoordsForPercentage = (percentage: number) => {
        const x = Math.cos(2 * Math.PI * percentage);
        const y = Math.sin(2 * Math.PI * percentage);
        return [x, y];
    };

    return (
        <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="relative w-48 h-48">
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90">
                    {data.map((item, index) => {
                        const percentage = item.amount / total;
                        const [startX, startY] = getCoordsForPercentage(cumulativePercentage);
                        cumulativePercentage += percentage;
                        const [endX, endY] = getCoordsForPercentage(cumulativePercentage);
                        const largeArcFlag = percentage > 0.5 ? 1 : 0;

                        const pathData = [
                            `M ${startX} ${startY}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            'L 0 0',
                        ].join(' ');

                        return <path key={item.category} d={pathData} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />;
                    })}
                </svg>
            </div>
            <div className="space-y-2 text-sm">
                {data.map((item, index) => (
                    <div key={item.category} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] }}></div>
                        <span className="font-semibold text-white">{item.category}</span>
                        <span className="text-gray-400">(${(item.amount).toLocaleString()})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ExpenseDetailView: React.FC<ExpenseDetailViewProps> = ({ expenses, onBack }) => {
    const { accounts } = useDataContext();
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const [filters, setFilters] = useState<{
        dateRange: '7d' | '30d' | 'month';
        category: TransactionCategory | 'all';
        account: string | 'all';
    }>({
        dateRange: '30d',
        category: 'all',
        account: 'all',
    });

    const allCategories = useMemo(() => {
        const uniqueCategories = new Set(expenses.map(e => e.category));
        return Array.from(uniqueCategories);
    }, [expenses]);
    
    const allAccountNames = useMemo(() => accounts.map(a => a.name), [accounts]);

    const filteredExpenses = useMemo(() => {
        let data = [...expenses];
        const now = new Date();

        // Date Range Filter
        if (filters.dateRange === '7d') {
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            data = data.filter(e => e.date >= sevenDaysAgo);
        } else if (filters.dateRange === 'month') {
            data = data.filter(e => e.date.getFullYear() === now.getFullYear() && e.date.getMonth() === now.getMonth());
        }
        // '30d' is the default and already pre-filtered via props

        // Category Filter
        if (filters.category !== 'all') {
            data = data.filter(e => e.category === filters.category);
        }

        // Account Filter
        if (filters.account !== 'all') {
            data = data.filter(e => e.account === filters.account);
        }
        
        return data;
    }, [expenses, filters]);
    
    const summaryMetrics = useMemo(() => {
        const total = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);
        const count = filteredExpenses.length;
        return {
            total,
            count,
            average: count > 0 ? total / count : 0,
        };
    }, [filteredExpenses]);

    const categoryDistribution = useMemo(() => {
        const distribution: Record<string, number> = {};
        filteredExpenses.forEach(e => {
            distribution[e.category] = (distribution[e.category] || 0) + e.amount;
        });
        return Object.entries(distribution)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);
    }, [filteredExpenses]);

    const transactionColumns: ColumnDefinition<Transaction>[] = [
        // Same columns as before
        {
            key: 'description',
            header: 'Description',
            render: (t) => (
                <div>
                    <p className="font-semibold text-white">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.category}</p>
                </div>
            )
        },
        {
            key: 'date',
            header: 'Date',
            render: (t) => t.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        },
        {
            key: 'account',
            header: 'Account'
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (t) => (
                <span className="font-semibold text-red-400">
                    -${t.amount.toFixed(2)}
                </span>
            )
        }
    ];
    
    if (selectedTransaction) {
        return (
            <ExpenseTransactionDetail 
                transaction={selectedTransaction} 
                onBack={() => setSelectedTransaction(null)} 
            />
        );
    }

    return (
        <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
             <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 self-start">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Finance Dashboard
            </button>
            <PageHeader
                title="Expense Analysis"
                subtitle="Filter and visualize your spending habits."
            />

            <Card className="mb-6">
                 <div className="flex flex-wrap items-center gap-4">
                    <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
                    <select value={filters.dateRange} onChange={e => setFilters(f => ({ ...f, dateRange: e.target.value as any }))} className="bg-[#0D1117] border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="30d">Last 30 Days</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="month">This Month</option>
                    </select>
                    <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value as any }))} className="bg-[#0D1117] border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="all">All Categories</option>
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                     <select value={filters.account} onChange={e => setFilters(f => ({ ...f, account: e.target.value as any }))} className="bg-[#0D1117] border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                        <option value="all">All Accounts</option>
                        {allAccountNames.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                 </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1 space-y-4">
                    <Card><p className="text-sm text-gray-400">Total Expenses</p><p className="text-2xl font-bold text-red-400">${summaryMetrics.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
                    <Card><p className="text-sm text-gray-400">Transactions</p><p className="text-2xl font-bold text-white">{summaryMetrics.count}</p></Card>
                    <Card><p className="text-sm text-gray-400">Average Cost</p><p className="text-2xl font-bold text-white">${summaryMetrics.average.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="Expenses by Category" icon={faChartPie}>
                        <CategoryPieChart data={categoryDistribution} />
                    </Card>
                </div>
            </div>
            
            <Card>
                <DataTable 
                    columns={transactionColumns} 
                    data={filteredExpenses} 
                    onRowClick={(transaction) => setSelectedTransaction(transaction)}
                />
            </Card>
        </div>
    );
};

export default ExpenseDetailView;
