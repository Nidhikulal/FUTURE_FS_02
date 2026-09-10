import { useEffect, useState } from 'react';
import { UserPlus, RefreshCw, MessageSquarePlus } from 'lucide-react';
import { getActivity } from '../api/activity';

const actionConfig = {
  lead_created: { icon: UserPlus, color: 'text-status-new', bg: 'bg-status-new-soft' },
  status_changed: { icon: RefreshCw, color: 'text-status-contacted', bg: 'bg-status-contacted-soft' },
  note_added: { icon: MessageSquarePlus, color: 'text-brand', bg: 'bg-brand-soft' },
};

export default function ActivityLog() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivity()
      .then(setActivity)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Activity Log</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Everything that's happened across your leads, most recent first
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl">
        {loading ? (
          <p className="text-sm text-ink-soft text-center py-10">Loading...</p>
        ) : activity.length === 0 ? (
          <p className="text-sm text-ink-soft text-center py-10">
            No activity yet — submit a lead to get started.
          </p>
        ) : (
          <ul>
            {activity.map((item, i) => {
              const config = actionConfig[item.action] || actionConfig.lead_created;
              const Icon = config.icon;
              return (
                <li
                  key={item._id}
                  className={`flex items-start gap-3 px-5 py-4 ${
                    i !== activity.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className={config.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">{item.description}</p>
                    <p className="text-xs text-ink-soft mt-0.5">
                      {item.lead?.name && (
                        <span className="font-medium">{item.lead.name}</span>
                      )}
                      {item.lead?.name && ' · '}
                      <span className="font-mono">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
