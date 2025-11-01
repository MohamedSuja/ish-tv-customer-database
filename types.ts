export enum ConnectionStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

export enum SubscriptionPlan {
  Basic = 'Basic',
  Premium = 'Premium',
  Sports = 'Sports Pack',
  Family = 'Family Pack',
}

export enum PaymentMode {
  Cash = 'Cash',
  Card = 'Card',
  Online = 'Online',
}

export const subscriptionPlanPrices: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.Basic]: 15.00,
  [SubscriptionPlan.Premium]: 50.00,
  [SubscriptionPlan.Sports]: 35.00,
  [SubscriptionPlan.Family]: 25.00,
};

export interface Purchase {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  paymentMode: PaymentMode;
}

export interface Customer {
  id: string; // Unique identifier, same as accountId
  name: string;
  contactNumber: string;
  accountId: string; // Cable TV Number
  address: {
    city: string;
  };
  email?: string;
  connectionStatus: ConnectionStatus;
  subscriptionPlan: SubscriptionPlan;
  installationDate: string; // ISO string
  renewalDate: string; // ISO string
  purchaseHistory: Purchase[];
}
