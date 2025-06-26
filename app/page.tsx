'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Customer, FinanceEntry } from '@/types';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import CustomerForm from '@/components/CustomerForm';
import CustomerTable from '@/components/CustomerTable';
import FinanceForm from '@/components/FinanceForm';
import FinanceTable from '@/components/FinanceTable';

export default function Home() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [customers, setCustomers] = useLocalStorage<Customer[]>('visaflow-customers', []);
  const [financeEntries, setFinanceEntries] = useLocalStorage<FinanceEntry[]>('visaflow-finance', []);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (editingCustomer) {
      // Update existing customer
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id 
          ? { ...newCustomer, id: editingCustomer.id, createdAt: editingCustomer.createdAt }
          : c
      ));
      setEditingCustomer(null);
    } else {
      // Add new customer
      setCustomers(prev => [...prev, newCustomer]);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleAddFinanceEntry = (entryData: Omit<FinanceEntry, 'id' | 'createdAt'>) => {
    const newEntry: FinanceEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setFinanceEntries(prev => [...prev, newEntry]);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard customers={customers} financeEntries={financeEntries} />;
      
      case 'customers':
        return (
          <div className="space-y-8">
            <CustomerForm 
              onSubmit={handleAddCustomer} 
              editingCustomer={editingCustomer}
              onCancelEdit={() => setEditingCustomer(null)}
            />
            <CustomerTable 
              customers={customers}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
            />
          </div>
        );
      
      case 'finance':
        return (
          <div className="space-y-8">
            <FinanceForm onSubmit={handleAddFinanceEntry} />
            <FinanceTable entries={financeEntries} />
          </div>
        );
      
      case 'reports':
        return (
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reports</h2>
            <p className="text-gray-600">Advanced reporting features coming soon...</p>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">System settings and configuration options coming soon...</p>
          </div>
        );
      
      default:
        return <Dashboard customers={customers} financeEntries={financeEntries} />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-pink-50"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
        `
      }}
    >
      <div className="flex">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <main className="flex-1 lg:ml-72 min-h-screen">
          <div className="p-6 pt-20 lg:pt-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}