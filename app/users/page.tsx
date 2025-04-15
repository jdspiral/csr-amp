import { getUsers } from '@/lib/api';
import UserList from '@/components/UserList';

export default async function UsersPage() {
  const users = await getUsers();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      <UserList initialData={users} />
    </div>
  );
}
