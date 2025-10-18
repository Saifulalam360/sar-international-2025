import React from 'react';
import type { Budget } from '../types';
import Card from './ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

interface BudgetsCardProps {
    budgets: Budget[];
    onManageClick: () => void;
}

const BudgetsCard: React.FC<BudgetsCardProps> = ({ budgets, onManageClick }) => {
    return (
        <Card title="Budgets" icon={faBullseye}>
            <div className="space-y-4">
                {budgets.length > 0 ? budgets.map(budget => {
                    const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
                    const isOverBudget = percentage > 100;
                    const progressBarColor = isOverBudget ? 'bg-red-500' : 'bg-purple-500';

                    return (
                        <div key={budget.id}>
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span className="font-semibold text-white">{budget.category}</span>
                                <span className={`text-xs ${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
                                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                                <div className={`${progressBarColor} h-1.5 rounded-full`} style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                            </div>
                        </div>
                    );
                }) : (
                     <div className="text-center text-gray-500 py-4 flex flex-col items-center">
                        <FontAwesomeIcon icon={faBullseye} className="text-3xl mb-3 text-gray-600" />
                        <p className="text-sm">No budgets set.</p>
                        <p className="text-xs">Click "Manage Budgets" to add one.</p>
                    </div>
                )}
            </div>
            <button onClick={onManageClick} className="text-center w-full mt-4 text-sm text-purple-400 font-semibold hover:underline">
                Manage Budgets
            </button>
        </Card>
    );
};

export default BudgetsCard;