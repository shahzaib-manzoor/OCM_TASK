'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { casesAPI } from '@/lib/api/cases';
import { authAPI } from '@/lib/api/auth';
import { Case, CaseStatus, User, UserRole } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, [caseId]);

  const fetchData = async () => {
    try {
      const [userResponse, caseResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        casesAPI.getById(caseId),
      ]);
      setUser(userResponse.user);
      setCaseData(caseResponse);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/cases');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: CaseStatus) => {
    if (!caseData) return;

    try {
      setUpdating(true);
      await casesAPI.updateStatus(caseData.id, { status: newStatus });
      setCaseData({ ...caseData, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading case...</p>
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
      <Header user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Button onClick={() => router.back()} variant="secondary" size="sm">
              ← Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {caseData.title}
                      </h1>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          caseData.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : caseData.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {caseData.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
                  <p className="text-gray-900 whitespace-pre-wrap">{caseData.description}</p>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleStatusUpdate(CaseStatus.OPEN)}
                      disabled={updating || caseData.status === CaseStatus.OPEN}
                      variant="secondary"
                      size="sm"
                    >
                      Open
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(CaseStatus.IN_PROGRESS)}
                      disabled={updating || caseData.status === CaseStatus.IN_PROGRESS}
                      size="sm"
                    >
                      In Progress
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(CaseStatus.COMPLETED)}
                      disabled={updating || caseData.status === CaseStatus.COMPLETED}
                      variant="secondary"
                      size="sm"
                    >
                      Completed
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created By</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {caseData.creator?.email || 'Unknown'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {caseData.assignment?.user?.email || 'Unassigned'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(caseData.createdAt).toLocaleString()}
                    </dd>
                  </div>
                  {caseData.assignment && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Assigned At</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(caseData.assignment.assignedAt).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </dl>

                {user?.role === UserRole.ADMIN && !caseData.assignment && (
                  <div className="mt-6 pt-6 border-t">
                    <Button
                      onClick={() => router.push(`/cases/${caseData.id}/assign`)}
                      className="w-full"
                      size="sm"
                    >
                      Assign Case
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
