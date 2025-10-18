import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faTag, faCreditCard, faHashtag, faReceipt } from '@fortawesome/free-solid-svg-icons';
import type { Transaction } from '../types';
import Card from './ui/Card';

interface ExpenseTransactionDetailProps {
  transaction: Transaction;
  onBack: () => void;
}

const DetailRow: React.FC<{ icon: any; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-800 last:border-b-0">
        <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={icon} className="text-gray-500 w-4" />
            <span className="text-sm text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-semibold text-white">{value}</span>
    </div>
);


const ExpenseTransactionDetail: React.FC<ExpenseTransactionDetailProps> = ({ transaction, onBack }) => {
    return (
        <div className="flex-1 flex flex-col mt-6 bg-[#161B22] p-6 lg:p-8 rounded-xl border border-gray-800 text-gray-300 overflow-y-auto">
             <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 self-start">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Transactions
            </button>
            <Card>
                 <div className="text-center mb-6">
                    <p className={`text-sm ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{transaction.type === 'income' ? 'Income' : 'Expense'}</p>
                    <h1 className="text-5xl font-bold text-white my-2">
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h1>
                    <p className="text-lg text-gray-300">{transaction.description}</p>
                </div>
                
                <div className="space-y-2">
                    <DetailRow 
                        icon={faCalendar} 
                        label="Date" 
                        value={transaction.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    />
                    <DetailRow 
                        icon={faTag} 
                        label="Category" 
                        value={transaction.category}
                    />
                    <DetailRow 
                        icon={faCreditCard} 
                        label="Account" 
                        value={transaction.account}
                    />
                    <DetailRow 
                        icon={faReceipt} 
                        label="Type" 
                        value={transaction.type === 'income' ? 'Income' : 'Expense'}
                    />
                     <DetailRow 
                        icon={faHashtag} 
                        label="Transaction ID" 
                        value={transaction.id}
                    />
                </div>
            </Card>
        </div>
    );
};

export default ExpenseTransactionDetail;