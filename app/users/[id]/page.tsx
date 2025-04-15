import UserDetail from '@/components/UserDetail';
import { getUser } from '@/lib/api';

export default async function UserDetailPage({
  params,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}) {
  const user = await getUser(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">User Detail</h1>
      <UserDetail userId={user.id} />
    </div>
  );
}
