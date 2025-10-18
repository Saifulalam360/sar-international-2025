import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faReceipt, faCreditCard, faSync, faBullseye, faArrowUp, faArrowDown, faChartPie, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { useDataContext } from '../contexts/DataContext';
import type { Transaction, Account } from '../types';
import PageHeader from './common/PageHeader';
import Button from './ui/Button';
import Card from './ui/Card';
import DataTable, { ColumnDefinition } from './common/DataTable';
import AddTransactionModal from './AddTransactionModal';
import RecurringTransactionsCard from './RecurringTransactionsCard';
import ManageBudgetsModal from './ManageBudgetsModal';
import AccountDetailView from './AccountDetailView';
import BalanceDetailView from './BalanceDetailView';
import SummaryCard from './ui/SummaryCard';
import BudgetsCard from './BudgetsCard';
import AccountCard from './ui/AccountCard';
import IncomeExpenseChart from './IncomeExpenseChart';
import ExpenseTransactionDetail from './ExpenseTransactionDetail';
import ExpenseDetailView from './ExpenseDetailView';

const Finance: React.FC = () => {
    const { accounts, transactions, handleAddTransaction, budgets, recurringTransactions, handleAddBudget, handleUpdateBudget, handleDeleteBudget } = useDataContext();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'accounts'>('dashboard');
    const [detailView, setDetailView] = useState<{ type: 'transaction' | 'account' | 'balance' | 'expense_analysis', data?: any } | null>(null);

    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [isBudgetModalOpen, setBudgetModalOpen] = useState(false);

    const financialSummary = useMemo(() => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentTransactions = transactions.filter(t => t.date >= thirtyDaysAgo);
        const income = recentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = recentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        return {
            totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
            incomeLast30Days: income,
            expensesLast30Days: expenses,
        };
    }, [accounts, transactions]);
    
    const transactionColumns: ColumnDefinition<Transaction>[] = [
       {
            key: 'type',
            header: '',
            render: (t) => (
                 <div className="w-8 text-center">
                    <FontAwesomeIcon 
                        icon={t.type === 'income' ? faArrowUp : faArrowDown} 
                        className={`p-1.5 rounded-full bg-opacity-20 ${t.type === 'income' ? 'text-green-400 bg-green-400' : 'text-red-400 bg-red-400'}`} 
                    />
                 </div>
            )
        },
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
            render: (t) => t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        },
        {
            key: 'account',
            header: 'Account'
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (t) => (
                <span className="font-semibold text-white">
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
            )
        },
        {
            key: 'actions',
            header: '',
            render: (t) => (
                <button className="text-gray-500 hover:text-white">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </button>
            )
        }
    ];

    const handleBackFromDetail = () => setDetailView(null);

    const renderDashboard = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <SummaryCard
                    title="Total Balance"
                    icon={faChartPie}
                    amount={`$${financialSummary.totalBalance.toLocaleString('en-US')}`}
                    bgColor="bg-gradient-to-br from-purple-600 to-blue-600"
                    iconColor="text-purple-200"
                    onClick={() => setDetailView({ type: 'balance' })}
                    footerText="Click to view details"
                />
                <SummaryCard
                    title="Income (30d)"
                    icon={faArrowUp}
                    amount={`$${financialSummary.incomeLast30Days.toLocaleString('en-US')}`}
                    bgColor="bg-gradient-to-br from-green-600 to-teal-600"
                    iconColor="text-green-200"
                />
                <SummaryCard
                    title="Expenses (30d)"
                    icon={faArrowDown}
                    amount={`$${financialSummary.expensesLast30Days.toLocaleString('en-US')}`}
                    bgColor="bg-gradient-to-br from-red-600 to-orange-600"
                    iconColor="text-red-200"
                    onClick={() => {
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        const recentExpenses = transactions.filter(t => t.type === 'expense' && t.date >= thirtyDaysAgo);
                        setDetailView({ type: 'expense_analysis', data: recentExpenses });
                    }}
                    footerText="Click to analyze expenses"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Monthly Overview">
                        <IncomeExpenseChart transactions={transactions} />
                    </Card>
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FontAwesomeIcon icon={faReceipt} className="text-gray-500" />
                                Recent Transactions
                            </h3>
                            <Button variant="secondary" className="!py-1 !px-3 !text-xs" onClick={() => setActiveTab('transactions')}>View All</Button>
                        </div>
                        <DataTable columns={transactionColumns} data={transactions.slice(0, 5)} onRowClick={(t) => setDetailView({ type: 'transaction', data: t })} />
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <FontAwesomeIcon icon={faCreditCard} className="text-gray-500" />
                                Accounts
                            </h3>
                             <Button variant="secondary" className="!py-1 !px-3 !text-xs" onClick={() => setActiveTab('accounts')}>View All</Button>
                        </div>
                        <div className="space-y-3">
                            {accounts.slice(0, 3).map(acc => (
                                <AccountCard 
                                    key={acc.id} 
                                    account={acc} 
                                    onClick={() => setDetailView({ type: 'account', data: acc })}
                                />
                            ))}
                        </div>
                    </Card>
                    <BudgetsCard budgets={budgets} onManageClick={() => setBudgetModalOpen(true)} />
                    <RecurringTransactionsCard transactions={recurringTransactions} />
                </div>
            </div>
        </>
    );

    const renderAllTransactionsView = () => (
         <Card>
            <DataTable columns={transactionColumns} data={transactions} onRowClick={(t) => setDetailView({ type: 'transaction', data: t })} />
        </Card>
    );

    const renderAllAccountsView = () => (
        <Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(acc => (
                    <AccountCard 
                        key={acc.id} 
                        account={acc} 
                        onClick={() => setDetailView({ type: 'account', data: acc })}
                    />
                ))}
            </div>
        </Card>
    );

    const renderActiveTabView = () => {
        switch (activeTab) {
            case 'transactions':
                return renderAllTransactionsView();
            case 'accounts':
                return renderAllAccountsView();
            case 'dashboard':
            default:
                return renderDashboard();
        }
    };
    
    const renderPageContent = () => {
        if (detailView) {
            switch (detailView.type) {
                case 'transaction':
                    return <ExpenseTransactionDetail transaction={detailView.data} onBack={handleBackFromDetail} />;
                case 'account':
                    return <AccountDetailView account={detailView.data} onBack={handleBackFromDetail} />;
                case 'balance':
                    return <BalanceDetailView accounts={accounts} onBack={handleBackFromDetail} />;
                case 'expense_analysis':
                    return <ExpenseDetailView expenses={detailView.data} onBack={handleBackFromDetail} />;
                default:
                    setDetailView(null); // Fallback for safety
                    return null;
            }
        }
        return renderActiveTabView();
    };
    
    const TABS = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'transactions', label: 'Transactions' },
      { id: 'accounts', label: 'Accounts' },
    ];

    const getPageTitle = () => {
        if (detailView) return "Details";
        switch (activeTab) {
            case 'transactions': return "All Transactions";
            case 'accounts': return "All Accounts";
            default: return "Financial Overview";
        }
    };

    return (
        <>
            <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
                {!detailView && (
                    <>
                        <PageHeader
                            title={getPageTitle()}
                            subtitle="Track your income, expenses, and budgets."
                        >
                            <Button onClick={() => setTransactionModalOpen(true)} leftIcon={faPlus}>Add Transaction</Button>
                        </PageHeader>
                        
                        <div className="flex items-center bg-[#0D1117] rounded-full p-1 mb-6 self-start">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${activeTab === tab.id ? 'bg-gray-200 text-black' : 'text-gray-400 hover:bg-gray-700/50'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}
                
                {renderPageContent()}
            </div>
            {isTransactionModalOpen && <AddTransactionModal accounts={accounts} onClose={() => setTransactionModalOpen(false)} onSave={handleAddTransaction} />}
            {isBudgetModalOpen && <ManageBudgetsModal budgets={budgets} onClose={() => setBudgetModalOpen(false)} onAdd={handleAddBudget} onUpdate={handleUpdateBudget} onDelete={handleDeleteBudget} />}
        </>
    );
};

export default Finance;
