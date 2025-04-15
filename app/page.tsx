export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to AMP CSR Portal</h1>
      <p className="mb-4">
        Manage users, vehicles, and subscriptions with ease.
      </p>
      <div className="flex gap-4">
        <a href="/dashboard" className="text-blue-600 hover:underline">
          Go to Dashboard
        </a>
        <a href="/users" className="text-blue-600 hover:underline">
          Manage Users
        </a>
      </div>
    </div>
  );
}