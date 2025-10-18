import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faEyeSlash, faCopy, faCheck, faCreditCard, faUniversity, faSimCard } from '@fortawesome/free-solid-svg-icons';
import type { Account, Transaction } from '../types';
import { useDataContext } from '../contexts/DataContext';
import Card from './ui/Card';
import DataTable, { ColumnDefinition } from './common/DataTable';
import ExpenseTransactionDetail from './ExpenseTransactionDetail';

interface AccountDetailViewProps {
  account: Account;
  onBack: () => void;
}

const InfoRow: React.FC<{ label: string, value: string, isSensitive?: boolean, onCopy: () => void, onToggleShow: () => void, isShown: boolean }> = 
    ({ label, value, isSensitive, onCopy, onToggleShow, isShown }) => {
    
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">{label}</span>
            <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-white">{value}</span>
                {isSensitive && (
                    <button onClick={onToggleShow} className="text-gray-400 hover:text-white">
                        <FontAwesomeIcon icon={isShown ? faEyeSlash : faEye} />
                    </button>
                )}
                 <button onClick={handleCopy} className="text-gray-400 hover:text-white">
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-green-400' : ''} />
                </button>
            </div>
        </div>
    );
};

const AccountDetailView: React.FC<AccountDetailViewProps> = ({ account, onBack }) => {
    const { transactions } = useDataContext();
    const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const accountTransactions = useMemo(() => transactions.filter(t => t.account === account.name), [transactions, account.name]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const toggleShow = (field: string) => {
        setShowSensitive(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const transactionColumns: ColumnDefinition<Transaction>[] = [
        {
            key: 'description',
            header: 'Description',
            render: (t) => t.description
        },
        {
            key: 'date',
            header: 'Date',
            render: (t) => t.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        },
        {
            key: 'amount',
            header: 'Amount',
            render: (t) => (
                <span className={`font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
            )
        }
    ];

    const renderCardVisual = () => {
        if (account.type === 'Credit Card') {
            const isShown = showSensitive['cardNumber'];
            const number = isShown ? account.cardNumber?.match(/.{1,4}/g)?.join(' ') : `•••• •••• •••• ${account.cardNumber?.slice(-4)}`;
            return (
                <div className="bg-gradient-to-br from-[#2c3e50] to-[#34495e] p-6 rounded-2xl shadow-2xl text-white w-full max-w-sm mx-auto font-mono flex flex-col justify-between h-56 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="w-12 h-9 bg-yellow-400 rounded-md flex items-center justify-center">
                            <div className="w-10 h-7 bg-gray-700 rounded-sm"></div>
                        </div>
                        {/* Placeholder for Visa/Mastercard logo */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 38 24" fill="white" className="opacity-80">
                          <path d="M34.5,0h-31A3.5,3.5,0,0,0,0,3.5v17A3.5,3.5,0,0,0,3.5,24h31A3.5,3.5,0,0,0,38,20.5v-17A3.5,3.5,0,0,0,34.5,0Zm-29,18.5a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,5.5,18.5Zm3,0a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,8.5,18.5Zm18.25-10H13.75a.75.75,0,0,1,0-1.5h13a.75.75,0,0,1,0,1.5Z" />
                        </svg>
                    </div>
                    <div className="relative z-10 text-center my-2">
                        <p className="text-2xl tracking-widest">{number}</p>
                    </div>
                    <div className="relative z-10 flex justify-between items-end text-xs">
                        <div>
                            <p className="uppercase text-gray-300/70 text-[0.6rem]">Card Holder</p>
                            <p className="font-semibold tracking-wider">{account.cardHolderName}</p>
                        </div>
                        <div>
                            <p className="uppercase text-gray-300/70 text-[0.6rem]">Expires</p>
                            <p className="font-semibold tracking-wider">{account.expiryDate}</p>
                        </div>
                    </div>
                </div>
            );
        } else { // Checking or Savings
             return (
                <div className="bg-gradient-to-br from-[#1A2980] to-[#26D0CE] p-6 rounded-2xl shadow-2xl text-white w-full max-w-sm mx-auto font-mono flex flex-col justify-between h-56 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
                    <div className="relative z-10 flex justify-between items-start">
                         <FontAwesomeIcon icon={faUniversity} className="text-3xl text-white/80" />
                        <p className="text-sm font-semibold">{account.type} Account</p>
                    </div>
                    <div className="relative z-10 text-left my-2">
                        <p className="text-xs uppercase text-gray-300/70">Account Holder</p>
                        <p className="font-semibold tracking-wider text-lg">{account.cardHolderName || 'Saiful Alam Rafi'}</p>
                    </div>
                    <div className="relative z-10 text-right">
                        <p className="text-xs uppercase text-gray-300/70">Balance</p>
                        <p className="font-bold tracking-wider text-3xl">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            );
        }
    };
    
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
             <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 self-start">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back to Finance Dashboard
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    {renderCardVisual()}
                     <Card>
                        <h3 className="text-md font-bold text-white mb-2">Account Details</h3>
                        <div className="divide-y divide-gray-800">
                           {account.type === 'Credit Card' ? (
                                <>
                                    <InfoRow label="Card Number" value={showSensitive['cardNumber'] ? account.cardNumber! : `**** **** **** ${account.cardNumber?.slice(-4)}`} isSensitive onCopy={() => copyToClipboard(account.cardNumber!)} onToggleShow={() => toggleShow('cardNumber')} isShown={!!showSensitive['cardNumber']} />
                                    <InfoRow label="CVV" value={showSensitive['cvv'] ? account.cvv! : '***'} isSensitive onCopy={() => copyToClipboard(account.cvv!)} onToggleShow={() => toggleShow('cvv')} isShown={!!showSensitive['cvv']} />
                                </>
                           ) : (
                                <>
                                    <InfoRow label="Account No." value={showSensitive['accountNumber'] ? account.accountNumber! : `**** ${account.accountNumber?.slice(-4)}`} isSensitive onCopy={() => copyToClipboard(account.accountNumber!)} onToggleShow={() => toggleShow('accountNumber')} isShown={!!showSensitive['accountNumber']} />
                                    <InfoRow label="Routing No." value={showSensitive['routingNumber'] ? account.routingNumber! : `***${account.routingNumber?.slice(-3)}`} isSensitive onCopy={() => copyToClipboard(account.routingNumber!)} onToggleShow={() => toggleShow('routingNumber')} isShown={!!showSensitive['routingNumber']} />
                                </>
                           )}
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                         <h3 className="text-lg font-bold text-white mb-4">Transaction History</h3>
                         <DataTable columns={transactionColumns} data={accountTransactions} onRowClick={(t) => setSelectedTransaction(t)} />
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailView;