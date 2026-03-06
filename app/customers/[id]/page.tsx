'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Customer, Activity } from '@/lib/types/activity';
import ActivityForm from '@/components/activities/ActivityForm';
import ActivityTimeline from '@/components/activities/ActivityTimeline';

interface CustomerData {
  customer: Customer;
  activities: Activity[];
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }
      
      fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error || 'Customer not found'}
          </div>
        </div>
      </div>
    );
  }

  const { customer, activities } = data;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="border-b border-gray-800 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{customer.name}</h1>
              <div className="mt-2 space-y-1 text-gray-400">
                <p>{customer.email}</p>
                {customer.phone && <p>{customer.phone}</p>}
                {customer.company && <p className="text-gray-500">{customer.company}</p>}
              </div>
            </div>
            <div className="text-right">
              {customer.last_contact_date ? (
                <div className="text-sm">
                  <span className="text-gray-500">Last contact:</span>
                  <p className="text-gray-300">
                    {new Date(customer.last_contact_date).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No contact recorded</p>
              )}
            </div>
          </div>
        </header>

        {/* Quick Add Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span>{showForm ? '−' : '+'}</span>
            {showForm ? 'Hide Form' : 'Add Activity'}
          </button>
        </div>

        {/* Activity Form */}
        {showForm && (
          <ActivityForm
            customerId={customerId}
            onSuccess={() => {
              setShowForm(false);
              fetchData();
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Activity Timeline */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">
            Activity History
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({activities.length} {activities.length === 1 ? 'activity' : 'activities'})
            </span>
          </h2>
          <ActivityTimeline 
            activities={activities} 
            onDelete={handleDeleteActivity}
          />
        </section>
      </div>
    </div>
  );
}
