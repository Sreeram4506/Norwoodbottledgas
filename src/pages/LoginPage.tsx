import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(user.role === 'admin' ? '/admin' : from || '/account');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-28 md:pt-36 pb-20 md:pb-32 bg-warm-sand min-h-[70vh]">
        <div className="max-w-[480px] mx-auto px-5 md:px-12">
          <h1 className="font-display text-[32px] md:text-[40px] text-warm-charcoal mb-8">Log In</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-card p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-sm text-warm-gray mb-2">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border-medium rounded-lg px-4 py-3 font-body focus:border-burnt-orange focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-gray mb-2">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border-medium rounded-lg px-4 py-3 font-body focus:border-burnt-orange focus:outline-none transition-colors"
              />
            </div>

            {error && <p className="font-body text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-burnt-orange text-white rounded-pill px-8 py-3.5 text-base font-medium hover:bg-burnt-orange-hover transition-colors duration-300 disabled:opacity-50"
            >
              {submitting ? 'Logging in…' : 'Log In'}
            </button>

            <p className="text-center font-body text-sm text-warm-gray">
              No account?{' '}
              <Link to="/register" className="text-burnt-orange hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
