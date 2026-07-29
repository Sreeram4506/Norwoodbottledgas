import { Link, useNavigate } from 'react-router';
import Navigation from '@/components/Navigation';
import FloatingCTA from '@/components/FloatingCTA';
import Footer from '@/sections/Footer';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative">
      <Navigation />
      <main className="pt-28 md:pt-36 pb-20 md:pb-32 bg-warm-sand min-h-[70vh]">
        <div className="max-w-[600px] mx-auto px-5 md:px-12">
          <h1 className="font-display text-[32px] md:text-[40px] text-warm-charcoal mb-8">My Account</h1>

          <div className="bg-white rounded-xl shadow-card p-6 md:p-8">
            <p className="font-body text-warm-gray">
              Name: <span className="text-warm-charcoal font-medium">{user?.name}</span>
            </p>
            <p className="font-body text-warm-gray mt-1">
              Email: <span className="text-warm-charcoal font-medium">{user?.email}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                to="/account/orders"
                className="bg-burnt-orange text-white rounded-pill px-6 py-3 text-sm font-medium text-center hover:bg-burnt-orange-hover transition-colors duration-300"
              >
                Order History
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="border border-border-medium text-warm-charcoal rounded-pill px-6 py-3 text-sm font-medium hover:bg-warm-cream transition-colors duration-300"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
