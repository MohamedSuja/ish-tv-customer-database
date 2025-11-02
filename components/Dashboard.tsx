import React, { useMemo, useState, useEffect } from "react";
import { Customer, ConnectionStatus } from "../types";
import {
  SearchIcon,
  PlusIcon,
  UsersIcon,
  UserIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from "./icons";

interface DashboardProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onViewAll: () => void;
  onSearch: (query: string) => void;
  onViewCustomer: (id: string) => void;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="bg-neutral/50 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="bg-primary p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({
  customers,
  onAddCustomer,
  onViewAll,
  onSearch,
  onViewCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);

  const stats = useMemo(() => {
    const active = customers.filter(
      (c) => c.connectionStatus === ConnectionStatus.Active
    ).length;
    const totalRevenue = customers.reduce((total, customer) => {
      return (
        total + customer.purchaseHistory.reduce((sum, p) => sum + p.amount, 0)
      );
    }, 0);

    return { active, totalRevenue };
  }, [customers]);

  // Real-time search as user types
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.contactNumber.toLowerCase().includes(query) ||
        c.accountId.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query))
    );

    setSearchResults(results);
  }, [searchQuery, customers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // If only one result found and form is submitted, navigate directly to that customer
    if (searchResults.length === 1) {
      onViewCustomer(searchResults[0].id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-white mb-2">
        Admin Dashboard
      </h1>

      {/* Search Section */}
      <div className="bg-neutral/50 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Search Customer</h2>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Name, Contact Number, Account ID, or Email..."
              className="w-full px-4 py-3 pl-10 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center transition"
          >
            <SearchIcon className="w-5 h-5 mr-2" />
            Search
          </button>
        </form>

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="mt-6">
            {searchResults.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p>No customers found matching "{searchQuery}"</p>
              </div>
            ) : (
              <>
                <p className="text-gray-400 mb-3">
                  Found {searchResults.length} customer
                  {searchResults.length !== 1 ? "s" : ""}:
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {searchResults.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => onViewCustomer(customer.id)}
                      className="bg-gray-800/50 hover:bg-gray-700/50 p-4 rounded-lg cursor-pointer transition border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">
                            {customer.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {customer.accountId} • {customer.contactNumber}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
                            customer.connectionStatus ===
                            ConnectionStatus.Active
                              ? "bg-green-500"
                              : customer.connectionStatus ===
                                ConnectionStatus.Inactive
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {customer.connectionStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={onAddCustomer}
          className="w-full text-left bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center space-x-3 transition"
        >
          <PlusIcon />
          <span>Add New Customer</span>
        </button>
        <button
          onClick={onViewAll}
          className="w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center space-x-3 transition"
        >
          <UsersIcon />
          <span>View All Customers</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Customers"
          value={customers.length}
          icon={<UsersIcon className="w-6 h-6 text-white" />}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.active}
          icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
        />
        <StatCard
          title="Total Revenue"
          value={`RS ${stats.totalRevenue.toFixed(2)}`}
          icon={<CurrencyDollarIcon className="w-6 h-6 text-white" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
