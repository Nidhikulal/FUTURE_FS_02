const statusConfig = {
  new: {
    label: 'New',
    text: 'text-status-new',
    bg: 'bg-status-new-soft',
    dot: 'bg-status-new',
  },
  contacted: {
    label: 'Contacted',
    text: 'text-status-contacted',
    bg: 'bg-status-contacted-soft',
    dot: 'bg-status-contacted',
  },
  converted: {
    label: 'Converted',
    text: 'text-status-converted',
    bg: 'bg-status-converted-soft',
    dot: 'bg-status-converted',
  },
};

export default function StatusPill({ status }) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export { statusConfig };
