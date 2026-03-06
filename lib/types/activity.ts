export type ActivityType = 'phone' | 'email' | 'meeting' | 'video';

export type ActivityOutcome = 'positive' | 'neutral' | 'negative' | 'quote_requested';

export interface Activity {
  id: string;
  customer_id: string;
  type: ActivityType;
  date: string; // ISO 8601 datetime
  duration?: number; // in minutes
  notes?: string;
  outcome: ActivityOutcome;
  next_action_date?: string; // ISO 8601 date
  created_at: string;
  updated_at: string;
}

export interface CreateActivityInput {
  customer_id: string;
  type: ActivityType;
  date: string;
  duration?: number;
  notes?: string;
  outcome: ActivityOutcome;
  next_action_date?: string;
}

export interface UpdateActivityInput {
  type?: ActivityType;
  date?: string;
  duration?: number;
  notes?: string;
  outcome?: ActivityOutcome;
  next_action_date?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
}

export const activityTypeIcons: Record<ActivityType, string> = {
  phone: '📞',
  email: '✉️',
  meeting: '🤝',
  video: '📹',
};

export const activityTypeLabels: Record<ActivityType, string> = {
  phone: 'Phone Call',
  email: 'Email',
  meeting: 'Meeting',
  video: 'Video Call',
};

export const activityOutcomeLabels: Record<ActivityOutcome, string> = {
  positive: 'Positive',
  neutral: 'Neutral',
  negative: 'Negative',
  quote_requested: 'Quote Requested',
};

export const activityOutcomeColors: Record<ActivityOutcome, string> = {
  positive: 'bg-green-500',
  neutral: 'bg-gray-500',
  negative: 'bg-red-500',
  quote_requested: 'bg-blue-500',
};
