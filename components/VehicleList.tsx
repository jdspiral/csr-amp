'use client';

import { ChangeEvent, useState } from 'react';
import type { Vehicle } from '@/interfaces';
import { updateVehicle } from '@/lib/api';

interface VehicleListProps {
  vehicles: Vehicle[];
  refreshVehicles: () => Promise<void>;
}

export default function VehicleList({ vehicles, refreshVehicles }: VehicleListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    license_plate: '',
    make: '',
    model: '',
    year: '',
  });

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditForm({
      license_plate: vehicle.license_plate,
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year ? vehicle.year.toString() : '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ license_plate: '', make: '', model: '', year: '' });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateVehicle(id, {
        ...editForm,
        year: parseInt(editForm.year),
      });
      await refreshVehicles();
      setEditingId(null);
    } catch (err) {
      console.error('Error updating vehicle:', err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Vehicles</h3>
      <table className="w-full border-collapse">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-2 border">License Plate</th>
            <th className="p-2 border">Make</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Year</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="hover:bg-gray-700">
              <td className="p-2 border">
                {editingId === vehicle.id ? (
                  <input
                    type="text"
                    value={editForm.license_plate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditForm((prev) => ({ ...prev, license_plate: e.target.value }))
                    }
                    className="p-1 border rounded"
                  />
                ) : (
                  vehicle.license_plate
                )}
              </td>
              <td className="p-2 border">
                {editingId === vehicle.id ? (
                  <input
                    type="text"
                    value={editForm.make}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditForm((prev) => ({ ...prev, make: e.target.value }))
                    }
                    className="p-1 border rounded"
                  />
                ) : (
                  vehicle.make
                )}
              </td>
              <td className="p-2 border">
                {editingId === vehicle.id ? (
                  <input
                    type="text"
                    value={editForm.model}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditForm((prev) => ({ ...prev, model: e.target.value }))
                    }
                    className="p-1 border rounded"
                  />
                ) : (
                  vehicle.model
                )}
              </td>
              <td className="p-2 border">
                {editingId === vehicle.id ? (
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditForm((prev) => ({ ...prev, year: e.target.value }))
                    }
                    className="p-1 border rounded"
                  />
                ) : (
                  vehicle.year
                )}
              </td>
              <td className="p-2 border">
                {editingId === vehicle.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(vehicle.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  );
}
