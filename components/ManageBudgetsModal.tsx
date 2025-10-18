import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import type { Budget, TransactionCategory } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface ManageBudgetsModalProps {
  budgets: Budget[];
  onClose: () => void;
  onAdd: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onUpdate: (budget: Omit<Budget, 'spent'>) => void;
  onDelete: (budgetId: number) => void;
}

const ALL_CATEGORIES: TransactionCategory[] = ['Groceries', 'Utilities', 'Entertainment', 'Software', 'Hardware', 'Other'];

const ManageBudgetsModal: React.FC<ManageBudgetsModalProps> = ({ budgets, onClose, onAdd, onUpdate, onDelete }) => {
    const [localBudgets, setLocalBudgets] = useState<Omit<Budget, 'spent'>[]>(budgets);
    const [newCategory, setNewCategory] = useState<TransactionCategory>('Other');
    
    const availableCategories = ALL_CATEGORIES.filter(c => !localBudgets.some(b => b.category === c));

    const handleLimitChange = (id: number, limit: string) => {
        const newLimit = parseFloat(limit);
        if (!isNaN(newLimit)) {
            setLocalBudgets(prev => prev.map(b => b.id === id ? { ...b, limit: newLimit } : b));
        }
    };
    
    const handleAddBudget = () => {
        if(availableCategories.length === 0) return;
        
        const budgetToAdd: Omit<Budget, 'id' | 'spent'> = {
            category: newCategory,
            limit: 0,
        };
        onAdd(budgetToAdd);
        onClose(); // In a real app, you'd wait for state update. This simplifies it.
    };

    const handleSaveChanges = () => {
        localBudgets.forEach(b => {
            const originalBudget = budgets.find(ob => ob.id === b.id);
            if (originalBudget && originalBudget.limit !== b.limit) {
                onUpdate(b);
            }
        });
        onClose();
    };

    return (
        <Modal title="Manage Budgets" onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-gray-400">Set spending limits for your expense categories.</p>
                
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {localBudgets.map(budget => (
                        <div key={budget.id} className="flex items-center gap-4">
                            <label htmlFor={`budget-${budget.id}`} className="flex-1 text-sm font-medium text-gray-300">{budget.category}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    id={`budget-${budget.id}`}
                                    value={budget.limit}
                                    onChange={e => handleLimitChange(budget.id, e.target.value)}
                                    className="w-32 bg-[#0D1117] border border-gray-700 rounded-lg py-2 pl-6 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <Button variant="ghost" className="text-red-400/70 hover:text-red-400" onClick={() => onDelete(budget.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-md font-semibold mb-2">Add New Budget</h4>
                    <div className="flex items-center gap-4">
                        <select
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value as TransactionCategory)}
                            className="flex-1 bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={availableCategories.length === 0}
                        >
                            {availableCategories.length > 0 ? availableCategories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            )) : (
                                <option>All categories have budgets</option>
                            )}
                        </select>
                        <Button leftIcon={faPlus} onClick={handleAddBudget} disabled={availableCategories.length === 0}>Add</Button>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ManageBudgetsModal;
