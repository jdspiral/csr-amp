'use client';

import { ChangeEvent, memo, useState } from 'react';
import type { Subscription, Vehicle } from '@/interfaces';
import { updateSubscription } from '@/lib/api';

interface TransferSubscriptionProps {
  subscription: Subscription;
  vehicles: Vehicle[];
  onTransfer: () => Promise<void>;
}

function TransferSubscription({
  subscription,
  vehicles,
  onTransfer,
}: TransferSubscriptionProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleTransfer() {
    if (!selectedVehicleId) {
      setError('Please select a vehicle');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Update the subscription by changing the vehicle_id
      await updateSubscription(subscription.id, { vehicle_id: selectedVehicleId });
      await onTransfer();
    } catch (err) {
      console.error(err);
      setError('Failed to transfer subscription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <select
        value={selectedVehicleId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedVehicleId(e.target.value)}
        className="border p-2 rounded mr-2"
      >
        <option value="">Select New Vehicle</option>
        {vehicles.map((vehicle: Vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.make} {vehicle.model} ({vehicle.license_plate})
          </option>
        ))}
      </select>
      <button
        onClick={handleTransfer}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Transferring...' : 'Transfer Subscription'}
      </button>
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export default memo(TransferSubscription);
