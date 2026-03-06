import { Activity, Customer, CreateActivityInput, UpdateActivityInput } from './types/activity';

// In-memory data store
const customers: Map<string, Customer> = new Map();
const activities: Map<string, Activity> = new Map();

// Initialize with sample customers
const sampleCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Corp',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'cust-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    company: 'Tech Inc',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

sampleCustomers.forEach(c => customers.set(c.id, c));

// Customer operations
export function getCustomers(): Customer[] {
  return Array.from(customers.values());
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.get(id);
}

export function updateCustomerLastContactDate(customerId: string): void {
  const customer = customers.get(customerId);
  if (customer) {
    customer.last_contact_date = new Date().toISOString();
    customer.updated_at = new Date().toISOString();
  }
}

// Activity operations
export function getActivities(): Activity[] {
  return Array.from(activities.values());
}

export function getActivitiesByCustomerId(customerId: string): Activity[] {
  return Array.from(activities.values())
    .filter(a => a.customer_id === customerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getActivityById(id: string): Activity | undefined {
  return activities.get(id);
}

export function createActivity(input: CreateActivityInput): Activity {
  const now = new Date().toISOString();
  const activity: Activity = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...input,
    created_at: now,
    updated_at: now,
  };
  
  activities.set(activity.id, activity);
  
  // Auto-update customer's last_contact_date
  updateCustomerLastContactDate(input.customer_id);
  
  return activity;
}

export function updateActivity(id: string, input: UpdateActivityInput): Activity | undefined {
  const activity = activities.get(id);
  if (!activity) return undefined;
  
  const updated: Activity = {
    ...activity,
    ...input,
    updated_at: new Date().toISOString(),
  };
  
  activities.set(id, updated);
  return updated;
}

export function deleteActivity(id: string): boolean {
  return activities.delete(id);
}
