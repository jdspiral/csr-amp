import type { PurchaseHistory, Subscription, User, Vehicle } from '@/interfaces';
import { HTTP_METHOD } from '@/lib/constants/http';
import { HEADERS } from './constants/headers';

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
};

const baseUrl = typeof window === 'undefined' ? getBaseUrl() : '';

/**
 * @param id - The ID of the user to fetch.
 */
export async function getUser(id: string): Promise<User> {
  const res = await fetch(`${baseUrl}/api/users/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Error fetching user');
  }
  return res.json();
}

/**
 * @param id - The ID of the vehicle to fetch.
 */
export async function getUsers(search: string = ''): Promise<{ data: User[] }> {
  let url = `${baseUrl}/api/users`;
  if (typeof search === 'string' && search.trim() !== '') {
    url += `?search=${encodeURIComponent(search.trim())}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
}

/**
 * @param id - The ID of the vehicle to fetch.
 * @param userId - The ID of the user to fetch vehicles for.
 */
export async function updateVehicle(
  id: string,
  updateData: Partial<Vehicle>
): Promise<Vehicle> {
  const res = await fetch(`${baseUrl}/api/vehicles/${id}`, {
    method: HTTP_METHOD.PUT,
    headers: { ...HEADERS.JSON },
    body: JSON.stringify(updateData)
  });

  if (!res.ok) throw new Error('Error updating vehicle');
  return res.json();
}

/**
 * Update a user's data.
 * @param userId - The ID of the user.
 * @param data - Partial user data to update.
 */
export async function updateUser(
  userId: string,
  data: Partial<User> | Record<string, any>
): Promise<User> {
  const res = await fetch(`${baseUrl}/api/users/${userId}`, {
    method: HTTP_METHOD.PUT,
    headers: {...HEADERS.JSON },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update user with id ${userId}`);
  }
  return res.json();
}

/**
 * Get all vehicles for a user.
 * @param userId - The ID of the user.
 */
export async function getVehicles(userId: string): Promise<Vehicle[]> {
  const res = await fetch(`${baseUrl}/api/users/${userId}/vehicles`);
  if (!res.ok) {
    throw new Error(`Failed to fetch vehicles for user ${userId}`);
  }
  return res.json();
}

/**
 * Get all subscriptions for a user.
 * @param userId - The ID of the user.
 */
export async function getSubscriptions(userId: string): Promise<Subscription[]> {
  const res = await fetch(`${baseUrl}/api/users/${userId}/subscriptions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch subscriptions for user ${userId}`);
  }
  return res.json();
}

/**
 * Get all purchase history for a user.
 * @param userId - The ID of the user.
 */
export async function getPurchaseHistory(userId: string): Promise<PurchaseHistory[]> {
  const res = await fetch(`${baseUrl}/api/users/${userId}/purchase-history`);
  if (!res.ok) {
    throw new Error(`Failed to fetch purchase history for user ${userId}`);
  }
  return res.json();
}

/**
 * @param data - The data for the new vehicle.
 */
export async function createVehicle(data: {
  user_id: string;
  license_plate: string;
  make: string;
  model: string;
  year: number;
}): Promise<Vehicle> {
  const res = await fetch(`${baseUrl}/api/vehicles`, {
    method: HTTP_METHOD.POST,
    headers: {...HEADERS.JSON },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create vehicle');
  }
  return res.json();
}

/**
 * @param data - The data for the new subscription.
 */
export async function createSubscription(data: {
  user_id: string;
  vehicle_id: string;
  plan: string;
  start_date: string;
  status: string;
}): Promise<Subscription> {
  const res = await fetch(`${baseUrl}/api/subscriptions`, {
    method: HTTP_METHOD.POST,
    headers: { ...HEADERS.JSON },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create subscription');
  }
  return res.json();
}

/**
 * Delete a subscription by ID.
 * @param subscriptionId - The ID of the subscription to delete.
 */
export async function deleteSubscription(subscriptionId: string): Promise<{ message: string }> {
  const res = await fetch(`${baseUrl}/api/subscriptions/${subscriptionId}`, {
    method: HTTP_METHOD.DELETE,
  });
  if (!res.ok) {
    throw new Error('Failed to delete subscription');
  }
  return res.json();
}

/**
 * Update a subscription by ID.
 * @param subscriptionId - The ID of the subscription to update.
 * @param data - The data to update the subscription with.
 */
export async function updateSubscription(
  subscriptionId: string,
  data: Partial<Subscription>
): Promise<Subscription> {
  const res = await fetch(`${baseUrl}/api/subscriptions/${subscriptionId}`, {
    method: HTTP_METHOD.PUT,
    headers: { ...HEADERS.JSON },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update subscription');
  }
  return res.json();
}

/**
 * Get all subscriptions for a user.
 * @param userId - The ID of the user.
 */
export async function getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
  const res = await fetch(`${baseUrl}/api/users/${userId}/subscriptions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch subscriptions for user ${userId}`);
  }
  return res.json();
}

/**
 * 
 * @param data - The data for the new purchase history record.
 */
export async function createPurchaseHistory(data: {
  user_id: string;
  purchase_date: string;
  amount: number;
  description: string;
  subscriptionPlan: string;
  vehicle_id?: string;
}): Promise<PurchaseHistory> {
  const res = await fetch(`${baseUrl}/api/purchase-history`, {
    method: HTTP_METHOD.POST,
    headers: { ...HEADERS.JSON },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create purchase history record');
  }
  return res.json();
}
