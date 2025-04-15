'use client';
import { useState, useEffect, memo, ChangeEvent } from 'react';
import type { Subscription, Vehicle } from '@/interfaces';
import {
  getSubscriptionsByUser,
  createSubscription,
  deleteSubscription,
} from '@/lib/api';

interface SubscriptionListProps {
  userId: string;
  vehicles: Vehicle[];
  refreshVehicles: () => Promise<void>;
}

function SubscriptionList({
  userId,
  vehicles
}: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plan, setPlan] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [status] = useState('active');
  const [message, setMessage] = useState('');

  async function fetchSubscriptions() {
    try {
      const subs = await getSubscriptionsByUser(userId);
      setSubscriptions(subs);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  }

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  async function handleAddSubscription(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleId || !plan) {
      setMessage('Please select a plan and vehicle.');
      return;
    }
    try {
      await createSubscription({
        user_id: userId,
        vehicle_id: vehicleId,
        plan,
        start_date: new Date().toISOString(),
        status,
      });
      setPlan('');
      setVehicleId('');
      await fetchSubscriptions();
    } catch (err) {
      setMessage(`${err}: Error adding subscription`);
    }
  }

  async function handleDelete(subscriptionId: string) {
    try {
      await deleteSubscription(subscriptionId);
      await fetchSubscriptions();
    } catch (err) {
      setMessage(`${err}: Error deleting subscription`);
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Subscriptions</h3>
      {message && <p className="text-red-600">{message}</p>}
      <form onSubmit={handleAddSubscription} className="mb-4">
        <select
          value={plan}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setPlan(e.target.value)}
          className="border p-2 rounded mr-2"
        >
          <option value="">Select Plan</option>
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
          <option value="Unlimited">Unlimited</option>
        </select>
        <select
          value={vehicleId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setVehicleId(e.target.value)}
          className="border p-2 rounded mr-2"
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((vehicle: Vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.make} {vehicle.model} ({vehicle.license_plate})
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Subscription
        </button>
      </form>
      <table className="w-full border-collapse">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 border">Plan</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">Vehicle</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((subscription: Subscription) => (
            <tr key={subscription.id} className="hover:bg-gray-700">
              <td className="p-2 border">{subscription.plan}</td>
              <td className="p-2 border">{subscription.status}</td>
              <td className="p-2 border">
                {new Date(subscription.start_date).toLocaleDateString()}
              </td>
              <td className="p-2 border">
                {subscription.vehicle
                  ? `${subscription.vehicle.make} ${subscription.vehicle.model} (${subscription.vehicle.license_plate})`
                  : 'N/A'}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(subscription.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(SubscriptionList);
