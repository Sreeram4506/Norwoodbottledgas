import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-warm-dark text-white">
      <div className="border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-5 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl">Admin Dashboard</p>
            <p className="font-body text-xs text-white/50">{user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="font-body text-sm text-white/60 hover:text-white transition-colors">
              View site
            </a>
            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="font-body text-sm border border-white/20 rounded-pill px-4 py-2 hover:bg-white/10 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-12 py-10">
        <Outlet />
      </div>
    </div>
  );
}
