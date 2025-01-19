import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <p className="text-gray-600">
        Welcome back, {user?.email}
      </p>
    </div>
  );
}