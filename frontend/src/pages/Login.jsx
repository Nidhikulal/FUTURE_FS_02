import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <span className="font-display font-semibold text-lg text-ink">Client Lead Management System</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl shadow-sm p-8">
          <h1 className="font-display text-xl font-semibold text-ink mb-1">
            Admin sign in
          </h1>
          <p className="text-sm text-ink-soft mb-6">
            Manage your leads and pipeline
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-coral/10 border border-coral/30 text-coral text-sm rounded-lg px-3 py-2 mb-4">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-ink focus:border-brand focus:ring-1 focus:ring-brand outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-soft mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm text-ink focus:border-brand focus:ring-1 focus:ring-brand outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition"
            >
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-soft mt-6">
          Only admins can access the lead dashboard.
        </p>
      </div>
    </div>
  );
}
