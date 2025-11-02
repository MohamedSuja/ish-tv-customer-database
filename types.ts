export enum ConnectionStatus {
  Active = "Active",
  Inactive = "Inactive",
  Pending = "Pending",
}

export enum Packages {
  DishTV = "Dishtv",
  SunDirect = "Sun direct",
  Videocon = "Videocon",
  Airtel = "Airtel",
  DialogTV = "Dialogtv",
}

export enum PaymentMode {
  Cash = "Cash",
  Card = "Card",
  Online = "Online",
}

export const subscriptionPlanPrices: Record<Packages, number> = {
  [Packages.DishTV]: 45.0,
  [Packages.SunDirect]: 35.0,
  [Packages.Videocon]: 40.0,
  [Packages.Airtel]: 50.0,
  [Packages.DialogTV]: 30.0,
};

// Multiple price options for each provider
export const providerPriceOptions: Record<Packages, number[]> = {
  [Packages.DishTV]: [35.0, 45.0, 65.0],
  [Packages.SunDirect]: [25.0, 35.0, 50.0],
  [Packages.Videocon]: [30.0, 40.0, 60.0],
  [Packages.Airtel]: [40.0, 50.0, 70.0],
  [Packages.DialogTV]: [20.0, 30.0, 45.0],
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
  packages: Packages;
  subscriptionPrice?: number; // Custom subscription price
  installationDate: string; // ISO string
  renewalDate: string; // ISO string
  purchaseHistory: Purchase[];
}
