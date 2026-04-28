import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth, api } from '../contexts/AuthContext';
import { PublicTransitionLink } from '../components/PublicPageTransition';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  DoorOpen,
  Loader2,
  Lock,
  Mail,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';

const accessStats = [
  { label: 'resident session', value: '836', icon: DoorOpen },
  { label: 'fee checks', value: '98%', icon: ReceiptText },
  { label: 'secure lanes', value: '04', icon: ShieldCheck },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(message || 'Invalid credentials or server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080908] text-[#f4f1e8] selection:bg-[#d8ff65] selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(216,255,101,.18),transparent_26%),radial-gradient(circle_at_84%_32%,rgba(102,227,255,.16),transparent_30%),linear-gradient(180deg,transparent,#080908_78%)]" />

      <main className="relative z-10 grid min-h-screen gap-5 p-4 xl:grid-cols-[minmax(520px,1.05fr)_minmax(520px,0.95fr)] xl:p-6">
        <section className="relative flex min-h-[52vh] flex-col justify-between overflow-hidden border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-8 xl:min-h-[calc(100vh-3rem)] xl:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#d8ff65,#66e3ff,#ff6b9a,#f7c948)]" />
          <div className="absolute -right-24 bottom-20 h-72 w-72 bg-[conic-gradient(from_120deg,#d8ff65,#66e3ff,#ff6b9a,#d8ff65)] opacity-20 blur-3xl" />

          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="group flex items-center gap-3" aria-label="Back to HostelSphere home">
              <span className="grid h-11 w-11 place-items-center bg-[#d8ff65] text-black transition-transform group-hover:rotate-3">
                <Building2 size={21} strokeWidth={2.4} />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold">HostelSphere</span>
                <span className="block text-[10px] uppercase tracking-[0.36em] text-white/[0.45]">campus ops</span>
              </span>
            </Link>

            <PublicTransitionLink
              to="/"
              label="return handoff"
              title="CAMPUS VIEW"
              detail="Returning from secure access to the public hostel control surface"
              accent="#d8ff65"
              className="inline-flex items-center gap-2 border border-white/[0.12] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/[0.6] transition hover:border-[#d8ff65]/50 hover:text-[#d8ff65]"
            >
              <ArrowLeft size={14} />
              Home
            </PublicTransitionLink>
          </div>

          <div className="my-16 max-w-4xl lg:my-0">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.34em] text-[#d8ff65]">Secure access node</p>
            <h1 className="font-display text-[clamp(4.4rem,10vw,10rem)] font-black uppercase leading-[0.82] tracking-normal">
              Enter
              <span className="block text-outline">The</span>
              <span className="block text-[#d8ff65]">Hostel Grid</span>
            </h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {accessStats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="border border-white/10 bg-white/[0.03] p-4">
                <Icon className="mb-8 text-[#66e3ff]" size={20} />
                <p className="font-display text-4xl font-black">{value}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center overflow-hidden border border-white/10 bg-[#0d0f10] p-4 sm:p-6 xl:min-h-[calc(100vh-3rem)]">
          <div className="absolute inset-5 border border-white/10" />
          <div className="absolute left-8 top-8 hidden border border-white/[0.12] bg-black/[0.5] p-4 backdrop-blur-xl md:block">
            <div className="flex items-center gap-3 text-[#d8ff65]">
              <Activity size={18} />
              <span className="text-[10px] uppercase tracking-[0.28em]">auth pulse stable</span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[560px] border border-white/[0.14] bg-[#111411]/[0.92] p-5 shadow-[0_40px_140px_rgba(0,0,0,.65)] sm:p-7">
            <div className="mb-8 flex items-start justify-between gap-5 border-b border-white/10 pb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#d8ff65]">identity check</p>
                <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none">Sign in</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center border border-[#d8ff65]/40 bg-[#d8ff65]/10 text-[#d8ff65]">
                <Lock size={21} />
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.48]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66e3ff]" />
                  <input
                    id="email"
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-white/10 bg-black/25 px-4 py-4 pl-12 text-[#f4f1e8] outline-none transition placeholder:text-white/25 focus:border-[#d8ff65]/70 focus:bg-black/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.48]">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d8ff65]" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-white/10 bg-black/25 px-4 py-4 pl-12 text-[#f4f1e8] outline-none transition placeholder:text-white/25 focus:border-[#d8ff65]/70 focus:bg-black/40"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group mt-8 inline-flex h-14 w-full items-center justify-center gap-3 bg-[#d8ff65] px-6 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#f4f1e8] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Open dashboard
                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-sm text-white/[0.55] sm:flex-row sm:items-center">
              <span>Need a fresh access profile?</span>
              <PublicTransitionLink
                to="/register"
                label="enrollment handoff"
                title="ACCESS BUILD"
                detail="Switching from sign-in to the hostel account creation lane"
                accent="#d8ff65"
                className="font-bold uppercase tracking-[0.18em] text-[#d8ff65] transition hover:text-[#f4f1e8]"
              >
                Create account
              </PublicTransitionLink>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Login;
