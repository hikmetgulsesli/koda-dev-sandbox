'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Customer } from '@/lib/types/activity';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-1/3" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-800 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="mt-2 text-gray-400">
            Manage your customers and their activities
          </p>
        </header>

        <div className="space-y-4">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/customers/${customer.id}`}
              className="block p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium text-white">{customer.name}</h2>
                  <div className="mt-1 text-sm text-gray-400 space-y-0.5">
                    <p>{customer.email}</p>
                    {customer.phone && <p>{customer.phone}</p>}
                  </div>
                </div>
                <div className="text-right">
                  {customer.company && (
                    <p className="text-sm text-gray-500">{customer.company}</p>
                  )}
                  {customer.last_contact_date ? (
                    <p className="text-xs text-gray-600 mt-1">
                      Last contact: {new Date(customer.last_contact_date).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-700 mt-1">No contact yet</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {customers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No customers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
