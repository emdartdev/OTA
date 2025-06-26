'use client';

import { useState } from 'react';
import { Plus, CloudUpload } from 'lucide-react';
import { Customer } from '@/types';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingCustomer?: Customer | null;
  onCancelEdit?: () => void;
}

export default function CustomerForm({ onSubmit, editingCustomer, onCancelEdit }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    fullName: editingCustomer?.fullName || '',
    passportNumber: editingCustomer?.passportNumber || '',
    medicalFitness: editingCustomer?.medicalFitness || 'Pending',
    agentName: editingCustomer?.agentName || '',
    visaStatus: editingCustomer?.visaStatus || 'Pending',
    passportScan: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
    if (!formData.agentName.trim()) newErrors.agentName = 'Agent name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      medicalFitness: formData.medicalFitness as Customer['medicalFitness'],
      visaStatus: formData.visaStatus as Customer['visaStatus'],
    });

    if (!editingCustomer) {
      setFormData({
        fullName: '',
        passportNumber: '',
        medicalFitness: 'Pending',
        agentName: '',
        visaStatus: 'Pending',
        passportScan: null,
      });
    }
    setErrors({});
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setFormData(prev => ({ ...prev, passportScan: file }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, passportScan: e.target.files![0] }));
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </h2>
        {editingCustomer && (
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl bg-white/50 border ${
                errors.fullName ? 'border-red-300' : 'border-white/30'
              } focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200`}
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Number *
            </label>
            <input
              type="text"
              value={formData.passportNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, passportNumber: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl bg-white/50 border ${
                errors.passportNumber ? 'border-red-300' : 'border-white/30'
              } focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200`}
              placeholder="Enter passport number"
            />
            {errors.passportNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.passportNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Fitness
            </label>
            <select
              value={formData.medicalFitness}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalFitness: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
            >
              <option value="Pending">Pending</option>
              <option value="Fit">Fit</option>
              <option value="Unfit">Unfit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              value={formData.agentName}
              onChange={(e) => setFormData(prev => ({ ...prev, agentName: e.target.value }))}
              className={`w-full px-4 py-3 rounded-xl bg-white/50 border ${
                errors.agentName ? 'border-red-300' : 'border-white/30'
              } focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200`}
              placeholder="Enter agent name"
            />
            {errors.agentName && (
              <p className="mt-1 text-sm text-red-600">{errors.agentName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visa Status
            </label>
            <select
              value={formData.visaStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, visaStatus: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Scan (PDF/JPG)
          </label>
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
              dragActive 
                ? 'border-emerald-400 bg-emerald-50/50' 
                : 'border-gray-300 hover:border-emerald-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
              <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  {formData.passportScan 
                    ? `Selected: ${formData.passportScan.name}`
                    : 'Drop your file here, or click to browse'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          {editingCustomer ? 'Update Customer' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
}