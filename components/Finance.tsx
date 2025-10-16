import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faPlus, faArrowUp, faArrowDown, faPiggyBank, faReceipt, faUtensils, faLightbulb, faFilm, faQuestionCircle, faWallet, faCalendarAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import type { Account, Budget, Transaction, TransactionCategory } from '../types';
import AddTransactionModal from './AddTransactionModal';
import PageHeader from './common/PageHeader';
import Button from './ui/Button';
import Card from './ui/Card';

interface FinanceProps {
  accounts: Account[];
  budgets: Budget[];
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORY_DETAILS: Record<TransactionCategory, { icon: any; color: string }> = {
    'Groceries': { icon: faUtensils, color: '#22c55e' },
    'Utilities': { icon: faLightbulb, color: '#f97316' },
    'Entertainment': { icon: faFilm, color: '#a855f7' },
    'Salary': { icon: faPiggyBank, color: '#3b82f6' },
    'Freelance': { icon: faReceipt, color: '#8b5cf6' },
    'Other': { icon: faQuestionCircle, color: '#6b7280' },
};

const ExpenseDonutChart: React.FC<{ expenses: Transaction[] }> = ({ expenses }) => {
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses === 0) {
        return (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
                <div>
                    <FontAwesomeIcon icon={faReceipt} className="text-4xl mb-2" />
                    <p>No expense data for this period.</p>
                </div>
            </div>
        );
    }

    const expenseByCategory = useMemo(() => expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<TransactionCategory, number>), [expenses]);

    let cumulativePercentage = 0;
    const segments = Object.entries(expenseByCategory).map(([category, amount]) => {
        const percentage = (Number(amount) / totalExpenses) * 100;
        const startAngle = cumulativePercentage;
        cumulativePercentage += percentage;
        return {
            category: category as TransactionCategory,
            percentage,
            startAngle,
            color: CATEGORY_DETAILS[category as TransactionCategory]?.color || '#9ca3af',
        };
    });

    return (
        <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6 flex-wrap">
            <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                     <circle cx="18" cy="18" r="15.915" fill="none" stroke="#374151" strokeWidth="2.5" />
                    {segments.map(segment => (
                         <circle
                            key={segment.category}
                            cx="18" cy="18" r="15.915"
                            fill="none"
                            stroke={segment.color}
                            strokeWidth="3"
                            strokeDasharray={`${segment.percentage}, 100`}
                            strokeDashoffset={-segment.startAngle}
                            transform="rotate(-90 18 18)"
                            strokeLinecap="round"
                         />
                    ))}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-xs text-gray-400">Total Spent</span>
                    <span className="text-xl font-bold text-white">${totalExpenses.toFixed(2)}</span>
                </div>
            </div>
             <div className="space-y-2 flex-1 min-w-[150px]">
                {segments.map(s => (
                    <div 
                        key={s.category} 
                        className="flex items-center justify-between gap-2 p-1 rounded-md"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }}></div>
                            <span className="text-sm">{s.category}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-400">{s.percentage.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BudgetTracker: React.FC<{ budget: Budget }> = ({ budget }) => {
    const percentage = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;
    const barColorClasses = percentage > 90 ? 'bg-red-500' 
        : percentage > 75 ? 'bg-orange-500' 
        : 'bg-blue-500';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold">{budget.category}</span>
                <span className="text-xs text-gray-400">${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</span>
            </div>
             <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div 
                    className={`${barColorClasses} h-1.5 rounded-full`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

const Finance: React.FC<FinanceProps> = ({ accounts, budgets, transactions, onAddTransaction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { totalBalance, monthlyIncome, monthlyExpenses } = useMemo(() => {
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const monthlyTransactions = transactions.filter(t => t.date >= startOfMonth);

        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return { totalBalance, monthlyIncome, monthlyExpenses };
    }, [accounts, transactions]);
    
    const monthlyExpenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense' && t.date >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)), [transactions]);

    return (
        <>
            <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
                <PageHeader
                    title="Finance Dashboard"
                    subtitle="Your personal finance overview."
                    icon={faChartPie}
                >
                    <Button onClick={() => setIsModalOpen(true)} leftIcon={faPlus}>
                        Add Transaction
                    </Button>
                </PageHeader>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                     <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2"><FontAwesomeIcon icon={faWallet}/>Total Balance</h3>
                        <p className="text-3xl font-bold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2"><FontAwesomeIcon icon={faArrowUp} className="text-green-400"/>Monthly Income</h3>
                        <p className="text-3xl font-bold text-green-400">${monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                     <div className="bg-[#0D1117] p-6 rounded-lg border border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2"><FontAwesomeIcon icon={faArrowDown} className="text-red-400"/>Monthly Expenses</h3>
                        <p className="text-3xl font-bold text-red-400">${monthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
                
                 {/* Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card title="Expense Breakdown">
                        <ExpenseDonutChart expenses={monthlyExpenseTransactions} />
                    </Card>
                    <Card title="Budget Tracking">
                         <div className="space-y-4">
                            {budgets.filter(b => b.limit > 0).map(b => <BudgetTracker key={b.category} budget={b} />)}
                         </div>
                    </Card>
                </div>

                {/* Recent Transactions */}
                 <Card title="Recent Transactions" className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-[#161B22]">
                                <tr>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Account</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {transactions.slice(0, 10).map((t) => (
                                    <tr key={t.id}>
                                        <td className="px-6 py-4 font-semibold">{t.description}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FontAwesomeIcon icon={CATEGORY_DETAILS[t.category].icon} style={{color: CATEGORY_DETAILS[t.category].color}} />
                                                <span>{t.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{t.date.toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-gray-400">{t.account}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            {isModalOpen && <AddTransactionModal accounts={accounts} onClose={() => setIsModalOpen(false)} onSave={onAddTransaction} />}
        </>
    );
};

export default Finance;