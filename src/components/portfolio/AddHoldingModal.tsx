import React, { useState } from 'react';
import { useWealth } from '../../context/WealthContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AssetClass } from '../../types';

export const AddHoldingModal: React.FC = () => {
  const { isAddHoldingOpen, setIsAddHoldingOpen, addHolding } = useWealth();

  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [category, setCategory] = useState<AssetClass>('MUTUAL_FUNDS');
  const [invested, setInvested] = useState<number>(100000);
  const [currentValue, setCurrentValue] = useState<number>(115000);
  const [sipAmount, setSipAmount] = useState<number>(5000);
  const [broker, setBroker] = useState('Groww');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const investedNum = Number(invested);
    const currentNum = Number(currentValue);
    const returnsPercent = investedNum > 0 ? ((currentNum - investedNum) / investedNum) * 100 : 0;

    addHolding({
      name: name.trim(),
      ticker: ticker.trim().toUpperCase() || name.slice(0, 4).toUpperCase(),
      category,
      invested: investedNum,
      currentValue: currentNum,
      returnsPercent: Number(returnsPercent.toFixed(1)),
      sipAmount: Number(sipAmount) > 0 ? Number(sipAmount) : undefined,
      broker: broker.trim() || 'Direct'
    });

    setIsAddHoldingOpen(false);
    setName('');
    setTicker('');
  };

  return (
    <Modal
      isOpen={isAddHoldingOpen}
      onClose={() => setIsAddHoldingOpen(false)}
      title="Add Investment Holding"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
        <div>
          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Instrument Name</label>
          <input
            type="text"
            placeholder="e.g. Parag Parikh Flexi Cap, Reliance, PPF"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as AssetClass)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
            >
              <option value="MUTUAL_FUNDS">Mutual Fund</option>
              <option value="EQUITY">Indian Stock (Direct)</option>
              <option value="FIXED_INCOME">Fixed Income / PPF / EPF</option>
              <option value="GOLD">Gold / SGB</option>
              <option value="LIQUID_CASH">Liquid & Cash</option>
              <option value="REAL_ESTATE">Real Estate</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Broker / Platform</label>
            <input
              type="text"
              placeholder="e.g. Zerodha, Groww, SBI"
              value={broker}
              onChange={e => setBroker(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Total Invested (₹)</label>
            <input
              type="number"
              value={invested}
              onChange={e => setInvested(Number(e.target.value))}
              required
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Current Value (₹)</label>
            <input
              type="number"
              value={currentValue}
              onChange={e => setCurrentValue(Number(e.target.value))}
              required
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">Monthly SIP (₹/mo) — Optional</label>
          <input
            type="number"
            value={sipAmount}
            onChange={e => setSipAmount(Number(e.target.value))}
            placeholder="0 if lump sum"
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:border-slate-500 dark:focus:border-slate-400"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={() => setIsAddHoldingOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Position
          </Button>
        </div>
      </form>
    </Modal>
  );
};
