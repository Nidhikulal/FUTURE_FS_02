import { useEffect, useState, useCallback } from 'react';
import { Search, Users, Sparkles, TrendingUp, Plus } from 'lucide-react';
import { getLeads, getAnalytics } from '../api/leads';
import StatusPill from '../components/StatusPill';
import LeadDetailDrawer from '../components/LeadDetailDrawer';
import AddLeadModal from '../components/AddLeadModal';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (status !== 'all') params.status = status;
      if (search) params.search = search;
      const data = await getLeads(params);
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchLeads, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchLeads]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleLeadUpdated = () => {
    fetchLeads();
    fetchAnalytics();
  };

  const newThisWeek = leads.filter((l) => {
    const created = new Date(l.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  }).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Leads</h1>
          <p className="text-sm text-ink-soft mt-0.5">
            See and manage all incoming leads.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-brand hover:bg-brand/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={16} />
          Add lead
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Users}
          bg="bg-vivid-violet"
          label="Total leads"
          value={analytics?.total ?? '—'}
        />
        <StatCard
          icon={Sparkles}
          bg="bg-vivid-orange"
          label="New this week"
          value={newThisWeek}
        />
        <StatCard
          icon={TrendingUp}
          bg="bg-vivid-teal"
          label="Conversion rate"
          value={analytics ? `${analytics.conversionRate}%` : '—'}
        />
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-surface text-sm text-ink focus:border-brand focus:ring-1 focus:ring-brand outline-none transition"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-surface text-sm text-ink focus:border-brand focus:ring-1 focus:ring-brand outline-none transition"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg/60">
              <th className="text-left font-medium text-ink-soft px-4 py-3">Name</th>
              <th className="text-left font-medium text-ink-soft px-4 py-3">Email</th>
              <th className="text-left font-medium text-ink-soft px-4 py-3">Source</th>
              <th className="text-left font-medium text-ink-soft px-4 py-3">Status</th>
              <th className="text-left font-medium text-ink-soft px-4 py-3">Received</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-ink-soft text-sm">
                  Loading leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-14">
                  <div className="flex flex-col items-center gap-2">
                    <Plus size={22} className="text-ink-soft" />
                    <p className="text-sm text-ink font-medium">No leads yet</p>
                    <p className="text-xs text-ink-soft max-w-xs">
                      Submit your demo contact form to see leads appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => setSelectedLeadId(lead._id)}
                  className="border-b border-border last:border-0 hover:bg-bg/60 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-medium text-ink">{lead.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{lead.email}</td>
                  <td className="px-4 py-3 text-ink-soft">{lead.source}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-soft font-mono text-xs">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

            {selectedLeadId && (
        <LeadDetailDrawer
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdated={handleLeadUpdated}
        />
      )}

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleLeadUpdated}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, bg, label, value }) {
  return (
    <div className={`rounded-xl p-4 flex items-center gap-3 ${bg}`}>
      <div className="w-10 h-10 rounded-lg bg-white/25 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs text-white/80">{label}</p>
        <p className="font-display text-xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
