'use client';

import { useState } from 'react';
import { 
  Pencil, 
  Trash2, 
  FileText,
  Search,
  Download
} from 'lucide-react';
import { Customer } from '@/types';
import { exportToCSV } from '@/utils/export';

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || customer.visaStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const exportData = filteredCustomers.map(customer => ({
      'Full Name': customer.fullName,
      'Passport Number': customer.passportNumber,
      'Medical Fitness': customer.medicalFitness,
      'Agent Name': customer.agentName,
      'Visa Status': customer.visaStatus,
      'Created At': new Date(customer.createdAt).toLocaleDateString(),
    }));
    exportToCSV(exportData, 'customers-export');
  };

  const getStatusBadge = (status: Customer['visaStatus']) => {
    const styles = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Processing: 'bg-blue-100 text-blue-800 border-blue-200',
      Approved: 'bg-green-100 text-green-800 border-green-200',
      Rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getMedicalBadge = (status: Customer['medicalFitness']) => {
    const styles = {
      Pending: 'bg-gray-100 text-gray-800 border-gray-200',
      Fit: 'bg-green-100 text-green-800 border-green-200',
      Unfit: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-800">Customer Records</h2>
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No customers found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Passport</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Medical</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Visa Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Document</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{customer.fullName}</p>
                      <p className="text-sm text-gray-500">
                        Added {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-mono text-sm">
                    {customer.passportNumber}
                  </td>
                  <td className="py-4 px-4">
                    {getMedicalBadge(customer.medicalFitness)}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {customer.agentName}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(customer.visaStatus)}
                  </td>
                  <td className="py-4 px-4">
                    {customer.passportScan && (
                      <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(customer)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit customer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(customer.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}