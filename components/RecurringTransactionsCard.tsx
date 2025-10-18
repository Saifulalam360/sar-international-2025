import React from 'react';
import type { RecurringTransaction } from '../types';
import Card from './ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

interface RecurringTransactionsCardProps {
    transactions: RecurringTransaction[];
}

const RecurringTransactionsCard: React.FC<RecurringTransactionsCardProps> = ({ transactions }) => {
    return (
        <Card title="Recurring Transactions" icon={faSync}>
            <div className="space-y-3">
                {transactions.length > 0 ? (
                    transactions.map(t => (
                        <div key={t.id} className="flex items-center justify-between bg-[#0D1117] p-3 rounded-lg border border-gray-800">
                            <div>
                                <p className="font-semibold text-white">{t.description}</p>
                                <p className="text-xs text-gray-400">
                                    Next: {t.nextDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{t.frequency}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4 flex flex-col items-center">
                        <FontAwesomeIcon icon={faSync} className="text-3xl mb-3 text-gray-600" />
                        <p className="text-sm">No recurring transactions found.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default RecurringTransactionsCard;