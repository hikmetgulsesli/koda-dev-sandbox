'use client';

import { useState } from 'react';
import { 
  ActivityType, 
  ActivityOutcome, 
  activityTypeIcons, 
  activityTypeLabels,
  activityOutcomeLabels,
  CreateActivityInput 
} from '@/lib/types/activity';

interface ActivityFormProps {
  customerId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const activityTypes: ActivityType[] = ['phone', 'email', 'meeting', 'video'];
const outcomes: ActivityOutcome[] = ['positive', 'neutral', 'negative', 'quote_requested'];

export default function ActivityForm({ customerId, onSuccess, onCancel }: ActivityFormProps) {
  const [type, setType] = useState<ActivityType>('phone');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState<ActivityOutcome>('neutral');
  const [nextActionDate, setNextActionDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const input: CreateActivityInput = {
        customer_id: customerId,
        type,
        date: new Date(date).toISOString(),
        duration: duration ? parseInt(duration, 10) : undefined,
        notes: notes || undefined,
        outcome,
        next_action_date: nextActionDate ? new Date(nextActionDate).toISOString() : undefined,
      };

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create activity');
      }

      // Reset form
      setType('phone');
      setDate('');
      setDuration('');
      setNotes('');
      setOutcome('neutral');
      setNextActionDate('');

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default date to now
  const now = new Date();
  const defaultDateTime = now.toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Add Activity</h3>
      
      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Activity Type Selector with Icons */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Activity Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {activityTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                type === t
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{activityTypeIcons[t]}</span>
              <span className="text-sm">{activityTypeLabels[t]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date/Time Picker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            required
            defaultValue={defaultDateTime}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 30"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Outcome Radio Buttons */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Outcome
        </label>
        <div className="flex flex-wrap gap-3">
          {outcomes.map((o) => (
            <label
              key={o}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                outcome === o
                  ? o === 'positive' ? 'bg-green-900/50 border-green-500 text-green-200'
                    : o === 'negative' ? 'bg-red-900/50 border-red-500 text-red-200'
                    : o === 'quote_requested' ? 'bg-blue-900/50 border-blue-500 text-blue-200'
                    : 'bg-gray-700 border-gray-500 text-gray-200'
                  : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <input
                type="radio"
                name="outcome"
                value={o}
                checked={outcome === o}
                onChange={() => setOutcome(o)}
                className="sr-only"
              />
              <span className="text-sm">{activityOutcomeLabels[o]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about the activity..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Next Action Date */}
      <div>
        <label htmlFor="nextActionDate" className="block text-sm font-medium text-gray-300 mb-1">
          Next Action Date
        </label>
        <input
          type="datetime-local"
          id="nextActionDate"
          value={nextActionDate}
          onChange={(e) => setNextActionDate(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Activity'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
