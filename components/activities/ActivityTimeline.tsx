'use client';

import { Activity, activityTypeIcons, activityTypeLabels, activityOutcomeLabels, activityOutcomeColors } from '@/lib/types/activity';

interface ActivityTimelineProps {
  activities: Activity[];
  onDelete?: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(minutes?: number): string {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export default function ActivityTimeline({ activities, onDelete }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No activities recorded yet.</p>
        <p className="text-sm mt-1">Add your first activity using the form above.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700" />
      
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="relative pl-14">
            {/* Timeline dot with icon */}
            <div className="absolute left-0 w-12 h-12 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center text-xl z-10">
              {activityTypeIcons[activity.type]}
            </div>
            
            {/* Activity card */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {activityTypeLabels[activity.type]}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${activityOutcomeColors[activity.outcome]}`}>
                    {activityOutcomeLabels[activity.outcome]}
                  </span>
                </div>
                <time className="text-sm text-gray-500">
                  {formatDate(activity.date)}
                </time>
              </div>
              
              {activity.duration && (
                <div className="text-sm text-gray-400 mb-2">
                  Duration: {formatDuration(activity.duration)}
                </div>
              )}
              
              {activity.notes && (
                <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">
                  {activity.notes}
                </p>
              )}
              
              {activity.next_action_date && (
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Next action: {formatDate(activity.next_action_date)}
                </div>
              )}
              
              {onDelete && (
                <div className="flex justify-end mt-3 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
