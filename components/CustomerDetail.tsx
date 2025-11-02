import React, { useState } from "react";
import {
  Customer,
  Purchase,
  PaymentMode,
  ConnectionStatus,
  subscriptionPlanPrices,
  Packages,
} from "../types";
import {
  PencilIcon,
  UserIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
} from "./icons";
import CustomerForm from "./CustomerForm";

interface CustomerDetailProps {
  customer: Customer;
  onUpdate: (
    customer: Omit<Customer, "purchaseHistory">,
    newPurchase: Purchase | null
  ) => void;
  onDelete: (id: string) => void;
}

const statusColorMap: Record<ConnectionStatus, string> = {
  [ConnectionStatus.Active]: "text-green-400",
  [ConnectionStatus.Inactive]: "text-red-400",
  [ConnectionStatus.Pending]: "text-yellow-400",
};

const InfoItem: React.FC<{ label: string; value?: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-md font-semibold text-white">{value || "N/A"}</p>
  </div>
);

const CustomerDetail: React.FC<CustomerDetailProps> = ({
  customer,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    description: "",
    amount: "",
    paymentMode: PaymentMode.Online,
  });

  const totalPaid = customer.purchaseHistory.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const planPrice =
    customer.subscriptionPrice ||
    subscriptionPlanPrices[customer.packages as Packages];

  const handleUpdate = (updatedCustomer: Omit<Customer, "purchaseHistory">) => {
    onUpdate(updatedCustomer, null);
    setIsEditing(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const payment: Purchase = {
      id: `P${Date.now()}`,
      date: new Date().toISOString(),
      description: newPurchase.description,
      amount: parseFloat(newPurchase.amount),
      paymentMode: newPurchase.paymentMode as PaymentMode,
    };
    onUpdate(customer, payment);
    setShowAddPayment(false);
    setNewPurchase({
      description: "",
      amount: "",
      paymentMode: PaymentMode.Online,
    });
  };

  if (isEditing) {
    return (
      <CustomerForm
        initialData={customer}
        onSubmit={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="bg-primary p-4 rounded-full">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{customer.name}</h1>
            <p
              className={`font-semibold ${
                statusColorMap[customer.connectionStatus]
              }`}
            >
              {customer.connectionStatus}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
          >
            <PencilIcon className="w-4 h-4 mr-2" /> Edit
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <TrashIcon className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="bg-neutral/50 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Customer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoItem label="Account ID" value={customer.accountId} />
          <InfoItem label="Contact Number" value={customer.contactNumber} />
          <InfoItem label="Email" value={customer.email} />
          <InfoItem label="City" value={customer.address.city} />
          <InfoItem label="DTH Provider" value={customer.packages} />
          <InfoItem
            label="Provider Price"
            value={`RS ${planPrice.toFixed(2)} / month`}
          />
          <InfoItem
            label="Installation Date"
            value={new Date(customer.installationDate).toLocaleDateString()}
          />
          <InfoItem
            label="Renewal Date"
            value={new Date(customer.renewalDate).toLocaleDateString()}
          />
          <InfoItem label="Total Paid" value={`RS ${totalPaid.toFixed(2)}`} />
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-neutral/50 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Purchase & Payment History
          </h2>
          <button
            onClick={() => setShowAddPayment(!showAddPayment)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />{" "}
            {showAddPayment ? "Cancel" : "Add Payment"}
          </button>
        </div>

        {showAddPayment && (
          <form
            onSubmit={handleAddPayment}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 mb-4 bg-gray-800/50 rounded-lg"
          >
            <input
              type="text"
              placeholder="Description"
              value={newPurchase.description}
              onChange={(e) =>
                setNewPurchase({ ...newPurchase, description: e.target.value })
              }
              required
              className="sm:col-span-2 bg-gray-900 border border-gray-700 text-white text-sm rounded-lg p-2.5"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newPurchase.amount}
              onChange={(e) =>
                setNewPurchase({ ...newPurchase, amount: e.target.value })
              }
              required
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg p-2.5"
            />
            <div className="flex items-center space-x-2">
              <select
                value={newPurchase.paymentMode}
                onChange={(e) =>
                  setNewPurchase({
                    ...newPurchase,
                    paymentMode: e.target.value as PaymentMode,
                  })
                }
                className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg p-2.5"
              >
                {Object.values(PaymentMode).map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg"
              >
                <CheckCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Mode
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {customer.purchaseHistory
                .slice()
                .reverse()
                .map((p) => (
                  <tr
                    key={p.id}
                    className="bg-neutral/30 border-b border-gray-700"
                  >
                    <td className="px-6 py-4">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{p.description}</td>
                    <td className="px-6 py-4">{p.paymentMode}</td>
                    <td className="px-6 py-4 text-right font-mono">
                      RS {p.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {customer.purchaseHistory.length === 0 && (
            <p className="text-center py-6 text-gray-400">
              No payment history found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
