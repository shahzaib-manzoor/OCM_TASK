'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { casesAPI } from '@/lib/api/cases';
import { authAPI } from '@/lib/api/auth';
import { Case, User } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';

export default function DashboardPage() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [userResponse, casesResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        casesAPI.getAll(1, 5),
      ]);
      setUser(userResponse.user);
      setCases(casesResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex space-x-3">
              <Link href="/cases">
                <Button variant="secondary">View All Cases</Button>
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/cases/create">
                  <Button>Create Case</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <h3 className="text-sm font-medium text-gray-600">Total Cases</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">{cases.length}</p>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-white">
              <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {cases.filter((c) => c.status === 'IN_PROGRESS').length}
              </p>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-white">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {cases.filter((c) => c.status === 'COMPLETED').length}
              </p>
            </Card>
          </div>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Cases</h2>
            {cases.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No cases found</p>
            ) : (
              <div className="space-y-4">
                {cases.slice(0, 5).map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/cases/${caseItem.id}`}
                    className="block border-b last:border-0 pb-4 last:pb-0 hover:bg-gray-50 -mx-6 px-6 py-2 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{caseItem.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {caseItem.description.slice(0, 100)}...
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-4 ${
                          caseItem.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : caseItem.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {caseItem.status.replace('_', ' ')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
