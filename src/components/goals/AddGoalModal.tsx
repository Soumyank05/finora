import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LifeGoal } from '../../types';

export const AddGoalModal: React.FC = () => {
  const { isAddGoalOpen, setIsAddGoalOpen, addGoal } = useWealth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LifeGoal['category']>('HOME');
  const [targetAmount, setTargetAmount] = useState<number>(2500000);
  const [currentAmount, setCurrentAmount] = useState<number>(500000);
  const [targetYear, setTargetYear] = useState<number>(2028);
  const [monthlySIP, setMonthlySIP] = useState<number>(25000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title: title.trim(),
      category,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      targetYear: Number(targetYear),
      monthlySIP: Number(monthlySIP)
    });

    setIsAddGoalOpen(false);
    setTitle('');
  };

  return (
    <Modal
      isOpen={isAddGoalOpen}
      onClose={() => setIsAddGoalOpen(false)}
      title="Create New Life Goal"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
        <div>
          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Goal Description</label>
          <input
            type="text"
            placeholder="e.g. Mumbai Flat Down Payment, Child Higher Ed"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
            >
              <option value="HOME">House / Flat Down Payment</option>
              <option value="EMERGENCY">Emergency Fund</option>
              <option value="RETIREMENT">Retirement / FIRE</option>
              <option value="EDUCATION">Education</option>
              <option value="TRAVEL">Travel / Vacation</option>
              <option value="CUSTOM">Custom Goal</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Target Completion Year</label>
            <input
              type="number"
              value={targetYear}
              onChange={e => setTargetYear(Number(e.target.value))}
              min="2026"
              max="2060"
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none tabular-nums"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Target Corpus (₹)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={e => setTargetAmount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none tabular-nums"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Current Accumulated (₹)</label>
            <input
              type="number"
              value={currentAmount}
              onChange={e => setCurrentAmount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none tabular-nums"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Monthly Planned SIP (₹/mo)</label>
          <input
            type="number"
            value={monthlySIP}
            onChange={e => setMonthlySIP(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none tabular-nums"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => setIsAddGoalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Goal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
