'use client';

import { useState, useEffect, FormEvent, useCallback, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { User, Vehicle, Subscription, PurchaseHistory } from '@/interfaces';
import {
  getUser,
  updateUser,
  getVehicles,
  getSubscriptions,
  getPurchaseHistory,
  createVehicle,
} from '@/lib/api';
import VehicleList from './VehicleList';
import TransferSubscription from './TransferSubscription';
import SubscriptionList from './SubscriptionList';

interface UserDetailProps {
  userId: string;
}

export default function UserDetail({ userId }: UserDetailProps) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([]);

  const [newVehicle, setNewVehicle] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
  });
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [showVehicleFormOnActivate, setShowVehicleFormOnActivate] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const userData = await getUser(userId);
        setUser(userData);
        setForm({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
        });

        const vehiclesData = await getVehicles(userId);
        setVehicles(vehiclesData);

        const subsData = await getSubscriptions(userId);
        setSubscriptions(subsData);

        const purchaseData = await getPurchaseHistory(userId);
        setPurchaseHistory(purchaseData);
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [userId]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUser(userId, form);
      setUser(updated);
      setMessage('Changes saved successfully');
    } catch {
      setMessage('Error saving changes');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancelAccount() {
    setSaving(true);
    try {
      const updated = await updateUser(userId, { status: 'canceled' });
      setUser(updated);
      setMessage('Account canceled');
    } catch {
      setMessage('Error canceling account');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddVehicle() {
    setAddingVehicle(true);
    try {
      await createVehicle({
        user_id: userId,
        license_plate: newVehicle.license_plate,
        make: newVehicle.make,
        model: newVehicle.model,
        year: parseInt(newVehicle.year),
      });
      setNewVehicle({ license_plate: '', make: '', model: '', year: '' });
      const vehiclesData = await getVehicles(userId);
      setVehicles(vehiclesData);
    } catch (err) {
      console.error('Vehicle error:', err);
    } finally {
      setAddingVehicle(false);
    }
  }

  const refreshVehicles = useCallback(async () => {
    try {
      const vehiclesData = await getVehicles(userId);
      setVehicles(vehiclesData);
    } catch (err) {
      console.error('Error refreshing vehicles:', err);
    }
  }, [userId]);

  const getSubscriptionPlan = (purchaseHistory: PurchaseHistory) => {
    if (!purchaseHistory.subscription || !purchaseHistory.subscription.id) {
      return 'N/A';
    }
  
    const subscription = subscriptions.find(
      (sub) => sub.id === purchaseHistory.subscription.id
    );
  
    return subscription ? subscription.plan : 'N/A';
  };

  const handleTransfer = useCallback(async () => {
    const updatedSubs = await getSubscriptions(userId);
    setSubscriptions(updatedSubs);
  }, [userId, setSubscriptions]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Details</h2>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <form onSubmit={handleSave} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {user?.status === 'active' &&
          <button
            type="button"
            onClick={handleCancelAccount}
            className="bg-red-600 text-white px-4 py-2 rounded ml-4"
          >
            Cancel Account
          </button>
        }
      </form>

      {showVehicleFormOnActivate && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Add a Vehicle to Reactivate</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <input
              type='text'
              placeholder="License Plate"
              value={newVehicle.license_plate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewVehicle((v) => ({ ...v, license_plate: e.target.value }))}
              className="p-2 border rounded"
              required
            />
            <input
              type='text'
              placeholder="Make"
              value={newVehicle.make}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewVehicle((v) => ({ ...v, make: e.target.value }))}
              className="p-2 border rounded"
              required
            />
            <input
              type='text'
              placeholder="Model"
              value={newVehicle.model}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewVehicle((v) => ({ ...v, model: e.target.value }))}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={newVehicle.year}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewVehicle((v) => ({ ...v, year: e.target.value }))}
              className="p-2 border rounded"
              required
            />
          </div>
          <button
            onClick={handleAddVehicle}
            disabled={addingVehicle}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {addingVehicle ? 'Adding...' : 'Add Vehicle & Activate'}
          </button>
        </section>
      )}

      <VehicleList vehicles={vehicles} refreshVehicles={refreshVehicles} />

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Active Subscription</h3>
        {subscriptions.length === 0 ? (
          <p>No active subscription.</p>
        ) : (
          subscriptions.map((subscription: Subscription) => {
            const availableVehicles = vehicles.filter((vehicle: Vehicle) => vehicle.id !== subscription.vehicle_id);
            return (
              <div key={subscription.id} className="border p-4 rounded mb-4">
                <p>
                  <strong>Plan:</strong> {subscription.plan}
                </p>
                <p>
                  <strong>Status:</strong> {subscription.status}
                </p>
                <p>
                  <strong>Start Date:</strong> {subscription.start_date}
                </p>
                <p>
                  <strong>Vehicle:</strong>{' '}
                  {subscription.vehicle
                    ? `${subscription.vehicle.make} ${subscription.vehicle.model} (${subscription.vehicle.license_plate})`
                    : 'N/A'}
                </p>
                {availableVehicles.length > 0 && (
                  <TransferSubscription
                    subscription={subscription}
                    vehicles={availableVehicles}
                    onTransfer={handleTransfer}
                  />
                )}
              </div>
            );
          })
        )}
      </section>
      <SubscriptionList userId={userId} vehicles={vehicles} refreshVehicles={refreshVehicles} />

      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Purchase History</h3>
        {purchaseHistory.length === 0 ? (
          <p>No purchase history found.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Plan</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((purchaseHistory: PurchaseHistory) => (
                <tr key={purchaseHistory.id} className="hover:bg-gray-700">
                  <td className="p-2 border">{new Date(purchaseHistory.purchase_date).toLocaleDateString()}</td>
                  <td className="p-2 border">${purchaseHistory.amount}</td>
                  <td className="p-2 border">{getSubscriptionPlan(purchaseHistory) || '-'}</td>
                  <td className="p-2 border">{purchaseHistory.description}</td>
                  <td className="p-2 border">
                    {purchaseHistory.vehicle
                      ? `${purchaseHistory.vehicle.make} ${purchaseHistory.vehicle.model} (${purchaseHistory.vehicle.license_plate})`
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
