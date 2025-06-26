'use client';

import { useMemo } from 'react';
import { 
  Users, 
  DollarSign, 
  FileCheck,
  BarChart3
} from 'lucide-react';
import { Customer, FinanceEntry } from '@/types';

interface DashboardProps {
  customers: Customer[];
  financeEntries: FinanceEntry[];
}

export default function Dashboard({ customers, financeEntries }: DashboardProps) {
  const stats = useMemo(() => {
    // Customer stats
    const totalCustomers = customers.length;
    const approvedVisas = customers.filter(c => c.visaStatus === 'Approved').length;
    const pendingVisas = customers.filter(c => c.visaStatus === 'Pending').length;
    const processingVisas = customers.filter(c => c.visaStatus === 'Processing').length;

    // Finance stats
    const totalIncome = financeEntries
      .filter(e => e.entryType === 'Income')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const totalExpenses = financeEntries
      .filter(e => e.entryType === 'Expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    // Recent activities
    const recentCustomers = customers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const recentTransactions = financeEntries
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalCustomers,
      approvedVisas,
      pendingVisas,
      processingVisas,
      totalIncome,
      totalExpenses,
      netBalance,
      recentCustomers,
      recentTransactions,
    };
  }, [customers, financeEntries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to VisaFlow</h1>
        <p className="text-gray-600">Your comprehensive visa agency management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCustomers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Visas</p>
              <p className="text-3xl font-bold text-green-600">{stats.approvedVisas}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FileCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-3xl font-bold text-emerald-600">${stats.totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p className={`text-3xl font-bold ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${stats.netBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Visa Status Overview */}
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Visa Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50/50 rounded-xl border border-yellow-200/50">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingVisas}</p>
            <p className="text-sm text-yellow-700">Pending</p>
          </div>
          <div className="text-center p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
            <p className="text-2xl font-bold text-blue-600">{stats.processingVisas}</p>
            <p className="text-sm text-blue-700">Processing</p>
          </div>
          <div className="text-center p-4 bg-green-50/50 rounded-xl border border-green-200/50">
            <p className="text-2xl font-bold text-green-600">{stats.approvedVisas}</p>
            <p className="text-sm text-green-700">Approved</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Customers</h2>
          <div className="space-y-3">
            {stats.recentCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No customers yet</p>
            ) : (
              stats.recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{customer.fullName}</p>
                    <p className="text-sm text-gray-600">{customer.passportNumber}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    customer.visaStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                    customer.visaStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    customer.visaStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.visaStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {stats.recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            ) : (
              stats.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.entryType === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.entryType === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}