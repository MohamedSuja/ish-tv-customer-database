
import React, { useState } from 'react';
import { Customer, ConnectionStatus } from '../types';
import { TrashIcon, UserIcon, UsersIcon } from './icons';

interface CustomerListProps {
  customers: Customer[];
  onViewCustomer: (id: string) => void;
  onDeleteCustomer: (id:string) => void;
}

const statusColorMap: Record<ConnectionStatus, string> = {
    [ConnectionStatus.Active]: 'bg-green-500',
    [ConnectionStatus.Inactive]: 'bg-red-500',
    [ConnectionStatus.Pending]: 'bg-yellow-500',
};

const CustomerList: React.FC<CustomerListProps> = ({ customers, onViewCustomer, onDeleteCustomer }) => {
    const [filter, setFilter] = useState<ConnectionStatus | 'All'>('All');
    
    const filteredCustomers = customers.filter(c => filter === 'All' || c.connectionStatus === filter);

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center mb-4 sm:mb-0"><UsersIcon className="mr-3" /> All Customers</h1>
                <div className="flex items-center space-x-2 bg-neutral/50 p-1 rounded-lg">
                    {(['All', ...Object.values(ConnectionStatus)] as const).map(status => (
                        <button 
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${filter === status ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-neutral/50 shadow-lg rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Account ID</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Contact</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">City</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} className="bg-neutral/30 border-b border-gray-700 hover:bg-gray-700/50 transition">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{customer.name}</td>
                                <td className="px-6 py-4">{customer.accountId}</td>
                                <td className="px-6 py-4 hidden md:table-cell">{customer.contactNumber}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{customer.address.city}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${statusColorMap[customer.connectionStatus]}`}>
                                        {customer.connectionStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <button onClick={() => onViewCustomer(customer.id)} className="font-medium text-blue-400 hover:underline">View</button>
                                    <button onClick={() => onDeleteCustomer(customer.id)} className="text-red-400 hover:text-red-600">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredCustomers.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p>No customers found for this filter.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerList;
