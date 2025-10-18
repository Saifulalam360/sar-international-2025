import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartPie, faUniversity, faDollarSign, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import type { Account } from '../types';
import PageHeader from './common/PageHeader';
import Card from './ui/Card';

interface BalanceDetailViewProps {
  accounts: Account[];
  onBack: () => void;
}

const ACCOUNT_PROGRESS_COLORS: Record<string, string> = {
    'Checking': 'bg-blue-500',
    'Savings': 'bg-green-500',
};

const ACCOUNT_TYPE_STYLES: Record<string, { icon: any, bg: string, text: string }> = {
    'Checking': { icon: faUniversity, bg: 'bg-blue-500/10', text: 'text-blue-400' },
    'Savings': { icon: faDollarSign, bg: 'bg-green-500/10', text: 'text-green-400' },
    'Credit Card': { icon: faCreditCard, bg: 'bg-orange-500/10', text: 'text-orange-400' },
};


const BalanceDetailView: React.FC<BalanceDetailViewProps> = ({ accounts, onBack }) => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    const totalPositiveBalance = accounts
        .filter(acc => acc.balance > 0)
        .reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 self-start">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Finance Dashboard
            </button>
            <PageHeader
                title="Balance Details"
                subtitle="A breakdown of your balance across all accounts."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card title="Total Net Balance" icon={faChartPie}>
                    <p className="text-3xl font-bold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </Card>
                 <Card title="Total Positive Assets" icon={faChartPie}>
                    <p className="text-3xl font-bold text-green-400">${totalPositiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </Card>
            </div>
            <Card>
                <h3 className="text-lg font-bold text-white mb-4">Accounts Breakdown</h3>
                <div className="space-y-4">
                    {accounts.map(account => {
                        const balancePercentage = totalPositiveBalance > 0 && account.balance > 0
                            ? (account.balance / totalPositiveBalance) * 100
                            : 0;
                        const styles = ACCOUNT_TYPE_STYLES[account.type] || { icon: faDollarSign, bg: 'bg-gray-700', text: 'text-gray-300' };

                        return (
                           <div key={account.id} className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${styles.bg}`}>
                                    <FontAwesomeIcon icon={styles.icon} className={styles.text} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold text-white">{account.name}</p>
                                        <p className={`font-bold ${account.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                                            {account.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </p>
                                    </div>
                                     {account.balance > 0 && (
                                        <div className="mt-1">
                                            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${ACCOUNT_PROGRESS_COLORS[account.type] || 'bg-gray-500'}`}
                                                    style={{ width: `${balancePercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default BalanceDetailView;