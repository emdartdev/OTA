'use client';

import { useState } from 'react';
import { 
  Home, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 
        transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <div className="flex flex-col h-full bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl shadow-lg"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">VisaFlow</h1>
                <p className="text-xs text-gray-500">Agency Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 text-emerald-700 shadow-lg backdrop-blur-sm border border-emerald-200/50' 
                      : 'text-gray-600 hover:bg-white/20 hover:text-gray-800 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-emerald-600' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@visaflow.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}