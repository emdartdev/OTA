'use client';

import { useState, useMemo } from 'react';
import { 
  Search,
  Download,
  Printer,
  Filter
} from 'lucide-react';
import { FinanceEntry } from '@/types';
import { exportToCSV, printReport } from '@/utils/export';

interface FinanceTableProps {
  entries: FinanceEntry[];
}

export default function FinanceTable({ entries }: FinanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || entry.entryType === typeFilter;
      const matchesCategory = categoryFilter === 'All' || entry.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });

    // Sort entries
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [entries, searchTerm, typeFilter, categoryFilter, sortBy, sortOrder]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalIncome = filteredAndSortedEntries
      .filter(entry => entry.entryType === 'Income')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const totalExpense = filteredAndSortedEntries
      .filter(entry => entry.entryType === 'Expense')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const netBalance = totalIncome - totalExpense;

    // Top 3 expenses
    const topExpenses = filteredAndSortedEntries
      .filter(entry => entry.entryType === 'Expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    // Group by month
    const monthlyData = filteredAndSortedEntries.reduce((acc, entry) => {
      const month = new Date(entry.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0, count: 0 };
      }
      acc[month][entry.entryType.toLowerCase() as 'income' | 'expense'] += entry.amount;
      acc[month].count += 1;
      return acc;
    }, {} as Record<string, { income: number; expense: number; count: number }>);

    return { totalIncome, totalExpense, netBalance, topExpenses, monthlyData };
  }, [filteredAndSortedEntries]);

  const handleExport = () => {
    const exportData = filteredAndSortedEntries.map(entry => ({
      'Date': new Date(entry.date).toLocaleDateString(),
      'Type': entry.entryType,
      'Category': entry.category,
      'Amount': entry.amount,
      'Description': entry.description,
    }));
    exportToCSV(exportData, 'finance-ledger');
  };

  const handlePrint = () => {
    const printData = filteredAndSortedEntries.map(entry => ({
      Date: new Date(entry.date).toLocaleDateString(),
      Type: entry.entryType,
      Category: entry.category,
      Amount: `$${entry.amount.toFixed(2)}`,
      Description: entry.description,
    }));
    printReport('Finance Ledger Report', printData);
  };

  const getEntryTypeColor = (type: FinanceEntry['entryType']) => {
    return type === 'Income' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">
            ${summary.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-400/20 to-pink-400/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">
            ${summary.totalExpense.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Net Balance</h3>
          <p className={`text-3xl font-bold ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${summary.netBalance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Finance Table */}
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800">Finance Ledger</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="All">All Categories</option>
            <option value="Visa">Visa</option>
            <option value="Medical">Medical</option>
            <option value="Ticket">Ticket</option>
            <option value="Service Charge">Service Charge</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {filteredAndSortedEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th 
                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      if (sortBy === 'date') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('date');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      if (sortBy === 'amount') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('amount');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedEntries.map((entry, index) => {
                  const isTopExpense = summary.topExpenses.some(top => top.id === entry.id);
                  return (
                    <tr 
                      key={entry.id} 
                      className={`border-b border-white/10 hover:bg-white/10 transition-colors ${
                        isTopExpense ? 'bg-yellow-50/50' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-gray-700">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEntryTypeColor(entry.entryType)}`}>
                          {entry.entryType}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {entry.category}
                      </td>
                      <td className={`py-4 px-4 text-right font-semibold ${
                        entry.entryType === 'Income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.entryType === 'Income' ? '+' : '-'}${entry.amount.toFixed(2)}
                        {isTopExpense && (
                          <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                            Top
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {entry.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly Summary */}
      {Object.keys(summary.monthlyData).length > 0 && (
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(summary.monthlyData).map(([month, data]) => (
              <div key={month} className="bg-white/30 rounded-xl p-4 border border-white/20">
                <h4 className="font-semibold text-gray-800 mb-2">{month}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Income:</span>
                    <span className="font-medium">${data.income.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Expenses:</span>
                    <span className="font-medium">${data.expense.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-1">
                    <span className="text-gray-700">Net:</span>
                    <span className={`font-bold ${data.income - data.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(data.income - data.expense).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.count} transaction{data.count !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}