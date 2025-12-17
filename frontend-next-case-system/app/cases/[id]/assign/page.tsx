'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { casesAPI } from '@/lib/api/cases';
import { usersAPI } from '@/lib/api/users';
import { authAPI } from '@/lib/api/auth';
import { APIError } from '@/lib/api/client';
import { User, Case } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';

export default function AssignCasePage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [caseId]);

  const fetchData = async () => {
    try {
      const [userResponse, caseResponse, usersResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        casesAPI.getById(caseId),
        usersAPI.getAll(),
      ]);
      setCurrentUser(userResponse.user);
      setCaseData(caseResponse);
      // Filter to only show users with USER role, not admins
      const userOnlyList = usersResponse.filter(u => u.role === 'USER');
      setUsers(userOnlyList);
      setFilteredUsers(userOnlyList);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    setAssigning(true);
    setError('');

    try {
      await casesAPI.assign(caseId, { userId: selectedUserId });
      // Redirect to cases list after successful assignment
      router.push('/cases');
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else {
        setError('Failed to assign case');
      }
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Case not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} />

      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Button onClick={() => router.back()} variant="secondary" size="sm">
              ← Back
            </Button>
          </div>

          <Card>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Assign Case</h1>
            <p className="text-gray-600 mb-6">{caseData.title}</p>

            <form onSubmit={handleAssign} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User
                </label>

                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  required
                  size={Math.min(filteredUsers.length + 1, 8)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select a user --</option>
                  {filteredUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  {filteredUsers.length} of {users.length} users shown
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={assigning || !selectedUserId}
                  className="flex-1"
                >
                  {assigning ? 'Assigning...' : 'Assign Case'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
