import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { getAnalytics } from '../api/leads';

const statusColors = {
  new: '#3B82F6',
  contacted: '#FF9F43',
  converted: '#0BC5B4',
};

const sourcePalette = ['#38BDF8', '#F59E0B', '#EA580C', '#22C55E', '#8B5CF6', '#EC4899'];

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalytics().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <p className="text-sm text-ink-soft">Loading analytics...</p>
      </div>
    );
  }

  const converted = data.statusCounts.find((s) => s._id === 'converted')?.count || 0;

  const pieData = data.statusCounts.map((s) => ({
    name: s._id,
    value: s.count,
    color: statusColors[s._id] || '#999',
  }));

  const sourceData = data.sourceCounts.map((s, i) => ({
    source: s._id,
    count: s.count,
    color: sourcePalette[i % sourcePalette.length],
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Analytics</h1>
        <p className="text-sm text-ink-soft mt-0.5">
          Track your leads and conversions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} label="Total leads" value={data.total} bg="bg-vivid-violet" />
        <StatCard icon={CheckCircle2} label="Converted" value={converted} bg="bg-vivid-teal" />
        <StatCard icon={TrendingUp} label="Conversion rate" value={`${data.conversionRate}%`} bg="bg-vivid-orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-sm font-medium text-ink mb-4">Status breakdown</p>
          {pieData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E7E9F3',
                    fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-ink-soft capitalize">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-sm font-medium text-ink mb-4">Leads by source</p>
          {sourceData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sourceData} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E9F3" vertical={false} />
                <XAxis
                  dataKey="source"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 10, fill: '#6B7089', fontFamily: 'Inter' }}
                  axisLine={{ stroke: '#E7E9F3' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#6B7089', fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#F6F7FB' }}
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #E7E9F3',
                    fontSize: 13,
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, bg }) {
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

function EmptyChart() {
  return (
    <div className="h-[220px] flex items-center justify-center text-sm text-ink-soft">
      No data yet
    </div>
  );
}