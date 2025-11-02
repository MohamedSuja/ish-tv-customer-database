import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Customer, Purchase } from './types';
import { initialCustomers } from './data/initialData';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';
import CustomerForm from './components/CustomerForm';
import Login from './components/Login';
import HomePage from './components/HomePage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { HomeIcon, PlusIcon, UsersIcon, PowerIcon } from './components/icons';

type AdminView = 'DASHBOARD' | 'ALL_CUSTOMERS' | 'CUSTOMER_DETAIL' | 'ADD_CUSTOMER' | 'EDIT_CUSTOMER';
type AppView = 'PUBLIC_HOME' | 'LOGIN';


const AdminHeader: React.FC<{ setAdminView: (view: AdminView) => void; onLogout: () => void; }> = ({ setAdminView, onLogout }) => (
    <header className="bg-neutral shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center">
             <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setAdminView('DASHBOARD')}>
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.5C12 2.5 7.63 4.54 5.8 7.37C4.19 9.87 3.99 12.68 5.8 15.63C7.63 18.54 12 21.5 12 21.5C12 21.5 16.37 18.54 18.2 15.63C20.01 12.68 19.81 9.87 18.2 7.37C16.37 4.54 12 2.5 12 2.5ZM12 14.25C10.76 14.25 9.75 13.24 9.75 12C9.75 10.76 10.76 9.75 12 9.75C13.24 9.75 14.25 10.76 14.25 12C14.25 13.24 13.24 14.25 12 14.25Z" />
                </svg>
                <span className="text-xl font-bold text-white">DishTV Admin</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={() => setAdminView('DASHBOARD')} className="flex items-center space-x-2 text-gray-300 hover:text-white transition p-2 rounded-lg hover:bg-neutral/50"><HomeIcon className="w-5 h-5"/> <span className="hidden sm:inline">Dashboard</span></button>
                <button onClick={() => setAdminView('ALL_CUSTOMERS')} className="flex items-center space-x-2 text-gray-300 hover:text-white transition p-2 rounded-lg hover:bg-neutral/50"><UsersIcon className="w-5 h-5"/> <span className="hidden sm:inline">Customers</span></button>
                <button onClick={() => setAdminView('ADD_CUSTOMER')} className="flex items-center space-x-2 bg-primary hover:bg-secondary text-white font-semibold px-3 py-2 rounded-lg transition"><PlusIcon className="w-5 h-5"/> <span className="hidden sm:inline">Add New</span></button>
                <button onClick={onLogout} className="flex items-center space-x-2 text-red-400 hover:text-white transition p-2 rounded-lg hover:bg-red-600/50"><PowerIcon className="w-5 h-5"/> <span className="hidden sm:inline">Logout</span></button>
            </div>
        </nav>
    </header>
);

function App() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [appView, setAppView] = useState<AppView>('PUBLIC_HOME');
  const [adminView, setAdminView] = useState<AdminView>('DASHBOARD');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const storedCustomers = window.localStorage.getItem('customers');
    if (!storedCustomers || JSON.parse(storedCustomers).length === 0) {
      setCustomers(initialCustomers);
    }
  }, [setCustomers]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
        setIsAuthenticated(true);
        setLoginError(null);
        setAdminView('DASHBOARD');
    } else {
        setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAppView('PUBLIC_HOME');
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'purchaseHistory'>) => {
    if (customers.some(c => c.accountId === customerData.accountId)) {
        setNotification('Error: Account ID already exists.');
        return;
    }
    const newCustomer: Customer = { ...customerData, purchaseHistory: [] };
    setCustomers([...customers, newCustomer]);
    setAdminView('ALL_CUSTOMERS');
    setNotification('Customer added successfully!');
  };

  const handleUpdateCustomer = (updatedData: Omit<Customer, 'purchaseHistory'>, newPurchase: Purchase | null) => {
    setCustomers(customers.map(c => {
        if (c.id === updatedData.id) {
            const newHistory = newPurchase ? [...c.purchaseHistory, newPurchase] : c.purchaseHistory;
            return { ...updatedData, purchaseHistory: newHistory };
        }
        return c;
    }));
    setAdminView('CUSTOMER_DETAIL');
    setNotification('Customer updated successfully!');
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
        setCustomers(customers.filter(c => c.id !== id));
        setAdminView('ALL_CUSTOMERS');
        setNotification('Customer deleted successfully!');
    }
  };

  const renderAdminView = () => {
    switch (adminView) {
      case 'DASHBOARD':
        return <Dashboard customers={customers} onAddCustomer={() => setAdminView('ADD_CUSTOMER')} onViewAll={() => setAdminView('ALL_CUSTOMERS')} onSearch={()=>{}} />;
      case 'ALL_CUSTOMERS':
        return <CustomerList customers={customers} onViewCustomer={(id) => { setSelectedCustomerId(id); setAdminView('CUSTOMER_DETAIL'); }} onDeleteCustomer={handleDeleteCustomer} />;
      case 'CUSTOMER_DETAIL':
        const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
        return selectedCustomer ? <CustomerDetail customer={selectedCustomer} onUpdate={handleUpdateCustomer} onDelete={handleDeleteCustomer} /> : <p>Customer not found.</p>;
      case 'ADD_CUSTOMER':
        return <CustomerForm onSubmit={handleAddCustomer} onCancel={() => setAdminView('DASHBOARD')} />;
      default:
        return <Dashboard customers={customers} onAddCustomer={() => setAdminView('ADD_CUSTOMER')} onViewAll={() => setAdminView('ALL_CUSTOMERS')} onSearch={()=>{}} />;
    }
  };
  
  if (!isAuthenticated) {
     switch (appView) {
        case 'LOGIN':
            return <Login onLogin={handleLogin} error={loginError} />;
        case 'PUBLIC_HOME':
        default:
            return <HomePage customers={customers} onLoginClick={() => setAppView('LOGIN')} />;
     }
  }

  return (
    <div className="min-h-screen bg-base-100 font-sans">
        <AdminHeader setAdminView={setAdminView} onLogout={handleLogout} />
        <main className="container mx-auto px-4 sm:px-6 md:px-8 py-4">
            {notification && (
                <div className={`fixed top-20 right-5 z-50 p-4 rounded-lg shadow-lg text-white ${notification.startsWith('Error') ? 'bg-error' : 'bg-success'}`}>
                    {notification}
                </div>
            )}
            {renderAdminView()}
        </main>
        <PWAInstallPrompt />
    </div>
  );
}

export default App;