import { useEffect, useState } from 'react';
import { X, Mail, Phone, Tag, Send, Trash2, CalendarClock } from 'lucide-react';
import { getLeadById, updateLeadStatus, addNote, deleteLead } from '../api/leads';
import StatusPill from './StatusPill';

const statuses = ['new', 'contacted', 'converted'];

export default function LeadDetailDrawer({ leadId, onClose, onUpdated }) {
  const [lead, setLead] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const fetchLead = async () => {
    const data = await getLeadById(leadId);
    setLead(data);
  };

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateLeadStatus(leadId, newStatus);
      await fetchLead();
      onUpdated();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await addNote(leadId, noteText.trim());
      setNoteText('');
      await fetchLead();
      onUpdated();
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(leadId);
      onUpdated();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md h-full bg-surface shadow-2xl flex flex-col animate-in slide-in-from-right">
        {!lead ? (
          <div className="flex-1 flex items-center justify-center text-sm text-ink-soft">
            Loading...
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">
                  {lead.name}
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-ink-soft mt-1">
                  <Mail size={13} />
                  {lead.email}
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-1.5 text-sm text-ink-soft mt-0.5">
                    <Phone size={13} />
                    {lead.phone}
                  </div>
                )}
                                <div className="flex items-center gap-1.5 text-sm text-ink-soft mt-0.5">
                  <Tag size={13} />
                  {lead.source}
                </div>
                {lead.followUpDate && (
                  <div className="flex items-center gap-1.5 text-sm text-ink-soft mt-0.5">
                    <CalendarClock size={13} />
                    Follow up: {new Date(lead.followUpDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="p-1.5 rounded-lg text-ink-soft hover:bg-coral/10 hover:text-coral transition"
                  title="Delete lead"
                >
                  <Trash2 size={17} />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-ink-soft hover:bg-bg hover:text-ink transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {confirmingDelete && (
              <div className="mx-5 mt-4 p-3 rounded-lg bg-coral/10 border border-coral/30">
                <p className="text-sm text-ink mb-2">
                  Delete <span className="font-medium">{lead.name}</span>? This can't be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 rounded-lg bg-coral text-white text-xs font-medium hover:bg-coral/90 disabled:opacity-60 transition"
                  >
                    {deleting ? 'Deleting...' : 'Yes, delete'}
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-border text-ink-soft text-xs font-medium hover:bg-bg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {lead.message && (
                <div>
                  <p className="text-xs font-medium text-ink-soft mb-1.5">Message</p>
                  <p className="text-sm text-ink bg-bg rounded-lg p-3 border border-border">
                    {lead.message}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-medium text-ink-soft mb-2">Status</p>
                <div className="flex gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      disabled={updatingStatus}
                      onClick={() => handleStatusChange(s)}
                      className={`flex-1 ${lead.status === s ? '' : 'opacity-50 hover:opacity-100'} transition`}
                    >
                      <StatusPill status={s} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-ink-soft mb-2">
                  Notes & follow-ups
                </p>
                {lead.notes.length === 0 ? (
                  <p className="text-sm text-ink-soft italic">No notes yet.</p>
                ) : (
                  <div className="space-y-3">
                    {[...lead.notes].reverse().map((note) => (
                      <div
                        key={note._id}
                        className="border-l-2 border-brand-soft pl-3 py-0.5"
                      >
                        <p className="text-sm text-ink">{note.text}</p>
                        <p className="text-[11px] text-ink-soft font-mono mt-0.5">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <form
              onSubmit={handleAddNote}
              className="p-4 border-t border-border flex items-center gap-2"
            >
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a follow-up note..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm text-ink focus:border-brand focus:ring-1 focus:ring-brand outline-none transition"
              />
              <button
                type="submit"
                disabled={savingNote || !noteText.trim()}
                className="p-2.5 rounded-lg bg-brand text-white disabled:opacity-50 hover:bg-brand/90 transition"
              >
                <Send size={15} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}