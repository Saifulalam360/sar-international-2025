import React, { useState } from 'react';
import type { Transaction, Account, TransactionCategory } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface AddTransactionModalProps {
  accounts: Account[];
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ accounts, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<TransactionCategory>('Other');
  const [account, setAccount] = useState(accounts[0]?.name || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !account || !date) {
      alert('Please fill in all fields.');
      return;
    }

    onSave({
      description,
      amount: parseFloat(amount),
      type,
      category,
      account,
      date: new Date(date)
    });
    onClose();
  };

  const incomeCategories: TransactionCategory[] = ['Salary', 'Freelance', 'Other'];
  const expenseCategories: TransactionCategory[] = ['Groceries', 'Utilities', 'Entertainment', 'Other'];
  
  const availableCategories = type === 'income' ? incomeCategories : expenseCategories;
  
  if (type === 'income' && !incomeCategories.includes(category)) {
      setCategory('Salary');
  } else if (type === 'expense' && !expenseCategories.includes(category)) {
      setCategory('Groceries');
  }

  return (
    <Modal title="Add New Transaction" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
              <input
              type="number"
              id="amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              step="0.01"
              className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              />
          </div>
          <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <select id="type" value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
              </select>
          </div>
        </div>
         <div className="grid grid-cols-2 gap-4">
              <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select id="category" value={category} onChange={e => setCategory(e.target.value as any)} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
              </div>
               <div>
                  <label htmlFor="account" className="block text-sm font-medium text-gray-400 mb-1">Account</label>
                  <select id="account" value={account} onChange={e => setAccount(e.target.value)} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                     {accounts.map(acc => <option key={acc.id} value={acc.name}>{acc.name}</option>)}
                  </select>
              </div>
         </div>
         <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">Date</label>
            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-[#0D1117] border border-gray-700 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
         </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;