import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity, faDollarSign, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import type { Account } from '../../types';

interface AccountCardProps {
  account: Account;
  onClick: () => void;
}

const ACCOUNT_STYLES: Record<string, { icon: any, color: string }> = {
    'Checking': { icon: faUniversity, color: 'text-blue-400' },
    'Savings': { icon: faDollarSign, color: 'text-green-400' },
    'Credit Card': { icon: faCreditCard, color: 'text-orange-400' },
};

const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
    const { icon, color } = ACCOUNT_STYLES[account.type] || { icon: faDollarSign, color: 'text-gray-400' };

    return (
        <div 
            onClick={onClick}
            className="bg-[#0D1117] p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-all duration-200 cursor-pointer flex flex-col items-start gap-3 transform hover:scale-105"
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center bg-gray-800 flex-shrink-0`}>
                    <FontAwesomeIcon icon={icon} className={color} />
                </div>
                <div>
                    <p className="font-semibold text-white text-sm">{account.name}</p>
                    <p className="text-gray-400 text-xs">{account.type}</p>
                </div>
            </div>
            
            <div className="w-full text-right mt-2">
                <p className={`font-bold text-xl ${account.balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                    {account.balance.toLocaleString('en-US', { style: 'currency', currency: account.currency })}
                </p>
            </div>
        </div>
    );
};

export default AccountCard;