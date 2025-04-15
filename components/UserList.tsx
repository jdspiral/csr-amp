'use client';

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import type { User } from '@/interfaces';
import { getUsers } from '@/lib/api';

interface UserListProps {
  initialData: { data: User[] };
}

export default function UserList({ initialData }: UserListProps) {
  const [users, setUsers] = useState<User[]>(initialData.data);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchUsers(newSearch: string = search) {
    setLoading(true);
    try {
      const result = await getUsers(newSearch);
      setUsers(result.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(value);
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.phone || 'N/A'}</td>
                  <td className="p-2 border">
                    {user.status === 'canceled' ? (
                      <span className="text-red-600 font-bold">Canceled</span>
                    ) : (
                      <span className="text-green-600">Active</span>
                    )}
                  </td>
                  <td className="p-2 border">
                    <Link href={`/users/${user.id}`} className="text-blue-600 hover:underline">
                      View/Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
