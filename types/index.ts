export interface Customer {
  id: string;
  fullName: string;
  passportNumber: string;
  medicalFitness: 'Fit' | 'Unfit' | 'Pending';
  agentName: string;
  visaStatus: 'Pending' | 'Processing' | 'Approved' | 'Rejected';
  passportScan?: File | null;
  passportScanUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceEntry {
  id: string;
  entryType: 'Income' | 'Expense';
  category: 'Visa' | 'Medical' | 'Ticket' | 'Service Charge' | 'Others';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}