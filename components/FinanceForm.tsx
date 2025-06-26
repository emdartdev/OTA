'use client';

import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { FinanceEntry } from '@/types';

interface FinanceFormProps {
  onSubmit: (entry: Omit<FinanceEntry, 'id' | 'createdAt'>) => void;
}

export default function FinanceForm({ onSubmit }: FinanceFormProps) {
  const [formData, setFormData] = useState({
    entryType: 'Income' as FinanceEntry['entryType'],
    category: 'Visa' as FinanceEntry['category'],
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      entryType: formData.entryType,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date,
    });

    // Reset form
    setFormData({
      entryType: 'Income',
      category: 'Visa',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Finance Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Type
            </label>
            <select
              value={formData.entryType}
              onChange={(e) => setFormData(prev => ({ ...prev, entryType: e.target.value as FinanceEntry['entryType'] }))}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as FinanceEntry['category'] }))}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
            >
              <option value="Visa">Visa</option>
              <option value="Medical">Medical</option>
              <option value="Ticket">Ticket</option>
              <option value="Service Charge">Service Charge</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className={`w-full pl-8 pr-4 py-3 rounded-xl bg-white/50 border ${
                  errors.amount ? 'border-red-300' : 'border-white/30'
                } focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border ${
                  errors.date ? 'border-red-300' : 'border-white/30'
                } focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200`}
              />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl bg-white/50 border ${
              errors.description ? 'border-red-300' : 'border-white/30'
            } focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 resize-none`}
            placeholder="Enter transaction description..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-400 to-purple-400 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Entry
        </button>
      </form>
    </div>
  );
}