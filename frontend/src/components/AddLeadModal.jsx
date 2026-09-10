import { useState } from 'react';
import { X } from 'lucide-react';
import { createLeadByAdmin } from '../api/leads';

export default function AddLeadModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    source: '',
    status: 'new',
    followUpDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createLeadByAdmin(form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    'w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-ink focus:border-brand focus:ring-1 focus:ring-brand outline-none transition';
  const labelClass = 'block text-xs font-medium text-ink-soft mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="font-display text-xl font-semibold text-ink">Add a lead</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-soft hover:bg-bg hover:text-ink transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 text-sm text-coral bg-coral/10 border border-coral/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Source</label>
              <select
                name="source"
                required
                value={form.source}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="" disabled>Select source</option>
                <option value="Contact Form">Contact Form</option>
                <option value="Referral">Referral</option>
                <option value="Ad">Ad</option>
                <option value="Social Media">Social Media</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Message</label>
            <textarea
              name="message"
              required
              rows={3}
              value={form.message}
              onChange={handleChange}
              placeholder="What did they ask about?"
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Follow-up date</label>
            <input
              name="followUpDate"
              type="date"
              value={form.followUpDate}
              onChange={handleChange}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-brand hover:bg-brand/90 disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition"
          >
            {saving ? 'Adding...' : 'Add lead'}
          </button>
        </form>
      </div>
    </div>
  );
}