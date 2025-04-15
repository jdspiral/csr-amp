export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  vehicle_id: string;
  plan: string;
  start_date: string;
  end_date?: string | null;
  status?: string;
  vehicle?: Vehicle | null;
}

export interface PurchaseHistory {
  id: string;
  user_id: string;
  purchase_date: string;
  amount: number;
  description: string;
  subscription: Subscription;
  plan?: string;
  vehicle?: Vehicle;
}
