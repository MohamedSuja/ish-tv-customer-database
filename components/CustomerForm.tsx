import React, { useState, useEffect } from 'react';
import { Customer, ConnectionStatus, SubscriptionPlan } from '../types';

interface CustomerFormProps {
  initialData?: Customer | null;
  onSubmit: (customer: Omit<Customer, 'purchaseHistory'>) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    accountId: '',
    email: '',
    address: { city: '' },
    connectionStatus: ConnectionStatus.Pending,
    subscriptionPlan: SubscriptionPlan.Basic,
    installationDate: new Date().toISOString().split('T')[0],
    renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        contactNumber: initialData.contactNumber,
        accountId: initialData.accountId,
        email: initialData.email || '',
        address: { city: initialData.address.city },
        connectionStatus: initialData.connectionStatus,
        subscriptionPlan: initialData.subscriptionPlan,
        installationDate: new Date(initialData.installationDate).toISOString().split('T')[0],
        renewalDate: new Date(initialData.renewalDate).toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'address.city') {
        setFormData(prev => ({ ...prev, address: { city: value } }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerData: Omit<Customer, 'purchaseHistory'> = {
        ...formData,
        id: initialData?.id || formData.accountId, // Use existing id or new accountId
        installationDate: new Date(formData.installationDate).toISOString(),
        renewalDate: new Date(formData.renewalDate).toISOString(),
    };
    onSubmit(customerData);
  };
  
  const InputField: React.FC<{label: string, name: string, value: string, onChange: any, type?: string, required?: boolean, disabled?: boolean}> = ({ label, name, value, onChange, type = 'text', required = false, disabled = false}) => (
    <div>
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
      <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} disabled={disabled} className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 disabled:bg-gray-700 disabled:cursor-not-allowed" />
    </div>
  );
  
  const SelectField: React.FC<{label: string, name: string, value: string, onChange: any, options: object}> = ({ label, name, value, onChange, options}) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
           {Object.values(options).map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6">{initialData ? 'Edit Customer' : 'Add New Customer'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Account ID" name="accountId" value={formData.accountId} onChange={handleChange} required disabled={!!initialData}/>
            <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
            <InputField label="Email (Optional)" name="email" value={formData.email || ''} onChange={handleChange} type="email" />
        </div>
        
        <InputField label="City" name="address.city" value={formData.address.city} onChange={handleChange} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField label="Connection Status" name="connectionStatus" value={formData.connectionStatus} onChange={handleChange} options={ConnectionStatus} />
            <SelectField label="Subscription Plan" name="subscriptionPlan" value={formData.subscriptionPlan} onChange={handleChange} options={SubscriptionPlan} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Installation Date" name="installationDate" value={formData.installationDate} onChange={handleChange} type="date" required />
            <InputField label="Next Renewal Date" name="renewalDate" value={formData.renewalDate} onChange={handleChange} type="date" required />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="px-6 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition">Cancel</button>
            <button type="submit" className="px-6 py-2 text-white bg-primary hover:bg-secondary rounded-lg transition">{initialData ? 'Save Changes' : 'Add Customer'}</button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
