import UserDetail from '@/components/UserDetail';
import { getUser } from '@/lib/api';

interface Params {
  params: { id: string };
}

export default async function UserDetailPage(props: Params) {
    const { id } = await props.params;
    const user = await getUser(id);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">User Detail</h1>
      <UserDetail userId={user.id} />
    </div>
  );
}
