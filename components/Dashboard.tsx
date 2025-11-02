import React, { useMemo } from 'react';
import { Customer, ConnectionStatus } from '../types';
import { SearchIcon, PlusIcon, UsersIcon, UserIcon, CheckCircleIcon, CurrencyDollarIcon } from './icons';

interface DashboardProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onViewAll: () => void;
  onSearch: (query: string) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-neutral/50 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="bg-primary p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ customers, onAddCustomer, onViewAll, onSearch }) => {

  const stats = useMemo(() => {
    const active = customers.filter(c => c.connectionStatus === ConnectionStatus.Active).length;
    const totalRevenue = customers.reduce((total, customer) => {
        return total + customer.purchaseHistory.reduce((sum, p) => sum + p.amount, 0);
    }, 0);
    
    return { active, totalRevenue };
  }, [customers]);


  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-white mb-2">Admin Dashboard</h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={onAddCustomer} className="w-full text-left bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center space-x-3 transition">
              <PlusIcon />
              <span>Add New Customer</span>
          </button>
          <button onClick={onViewAll} className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center space-x-3 transition">
              <UsersIcon />
              <span>View All Customers</span>
          </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Customers" value={customers.length} icon={<UsersIcon className="w-6 h-6 text-white"/>} />
        <StatCard title="Active Subscriptions" value={stats.active} icon={<CheckCircleIcon className="w-6 h-6 text-white"/>} />
        <StatCard title="Total Revenue" value={`RS ${stats.totalRevenue.toFixed(2)}`} icon={<CurrencyDollarIcon className="w-6 h-6 text-white"/>} />
      </div>
    </div>
  );
};

export default Dashboard;
