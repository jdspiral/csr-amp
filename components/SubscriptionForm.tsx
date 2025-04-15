'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { supabase } from '@/lib/supabase';
import type { Subscription } from '@/interfaces';

interface SubscriptionFormProps {
  subscription: Subscription;
  onUpdate: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function SubscriptionForm({ subscription, onUpdate, onDelete }: SubscriptionFormProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    status: subscription.status,
    plan: subscription.plan,
    start_date: subscription.start_date,
    end_date: subscription.end_date || '', // end_date can be unlimited
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase
      .from('subscriptions')
      .update({
        ...form,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);
    if (error) {
      console.error('Error updating subscription:', error);
      return;
    }
    await onUpdate();
    setEditing(false);
  }

  async function handleDelete() {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', subscription.id);
    if (error) {
      console.error('Error deleting subscription:', error);
      return;
    }
    await onDelete();
  }

  return (
    <div className="mt-4 p-2 border border-dashed rounded">
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block mb-1">Status:</label>
            <select
              value={form.status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, status: e.target.value as 'active' | 'paused' | 'canceled' | 'overdue' })}
              className="p-2 border rounded w-full"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="canceled">Canceled</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Plan:</label>
            <input
              type="text"
              value={form.plan}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, plan: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Start Date:</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, start_date: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1">End Date:</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, end_date: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <p>Status: <span className="font-medium">{form.status}</span></p>
          <p>Plan: <span className="font-medium">{form.plan}</span></p>
          <p>Start Date: <span className="font-medium">{form.start_date}</span></p>
          <p>End Date: <span className="font-medium">{form.end_date || 'N/A'}</span></p>
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
