import React, { useState } from 'react';
import { Customer } from '../types';
import { SearchIcon } from './icons';
import PublicCustomerDetail from './PublicCustomerDetail';

interface HomePageProps {
  customers: Customer[];
  onLoginClick: () => void;
}

const PublicHeader: React.FC<{ onLoginClick: () => void; }> = ({ onLoginClick }) => (
    <header className="bg-neutral shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.5C12 2.5 7.63 4.54 5.8 7.37C4.19 9.87 3.99 12.68 5.8 15.63C7.63 18.54 12 21.5 12 21.5C12 21.5 16.37 18.54 18.2 15.63C20.01 12.68 19.81 9.87 18.2 7.37C16.37 4.54 12 2.5 12 2.5ZM12 14.25C10.76 14.25 9.75 13.24 9.75 12C9.75 10.76 10.76 9.75 12 9.75C13.24 9.75 14.25 10.76 14.25 12C14.25 13.24 13.24 14.25 12 14.25Z" />
                </svg>
                <span className="text-xl font-bold text-white">Cable TV Management</span>
            </div>
            <button 
              onClick={onLoginClick} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Login
            </button>
        </nav>
    </header>
);

const HomePage: React.FC<HomePageProps> = ({ customers, onLoginClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<Customer | null | 'not_found'>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            setSearchResult(null);
            return;
        }
        const foundCustomer = customers.find(c => 
            c.contactNumber.toLowerCase().includes(query) || 
            c.accountId.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query)
        );
        setSearchResult(foundCustomer || 'not_found');
    };

    return (
        <div className="min-h-screen bg-base-100 font-sans">
            <PublicHeader onLoginClick={onLoginClick} />
            <main className="container mx-auto px-4 sm:px-6 md:px-8 py-10 flex flex-col items-center">
                 <div className="w-full max-w-2xl text-center bg-neutral/30 p-8 rounded-xl shadow-2xl">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Customer Search Portal</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-6">
                      Find customer details by Name, Contact Number, or Account ID.
                    </p>
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter search term..."
                        className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                      <button type="submit" className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-md flex items-center justify-center transition">
                        <SearchIcon className="w-5 h-5 mr-2" />
                        Search Customer
                      </button>
                    </form>
                </div>

                <div className="w-full max-w-4xl mt-10">
                    {searchResult === 'not_found' && (
                        <div className="bg-neutral/50 p-8 rounded-lg text-center text-gray-400">
                            <p className="text-xl">No Customer Found</p>
                            <p>Please check the details and try again.</p>
                        </div>
                    )}
                    {searchResult && searchResult !== 'not_found' && (
                        <PublicCustomerDetail customer={searchResult} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomePage;