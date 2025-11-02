import React from "react";
import {
  Customer,
  ConnectionStatus,
  subscriptionPlanPrices,
  Packages,
} from "../types";
import { UserIcon } from "./icons";

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

const PublicCustomerDetail: React.FC<{ customer: Customer }> = ({
  customer,
}) => {
  const totalPaid = customer.purchaseHistory.reduce(
    (sum, p) => sum + p.amount,
    0
  );
  const planPrice =
    customer.subscriptionPrice ||
    subscriptionPlanPrices[customer.packages as Packages];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-neutral/50 p-6 rounded-t-lg shadow-lg">
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
      </div>

      <div className="bg-neutral/50 p-6 rounded-b-lg shadow-lg">
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

      <div className="bg-neutral/50 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Purchase & Payment History
          </h2>
        </div>
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

export default PublicCustomerDetail;
