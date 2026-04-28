import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../contexts/AuthContext';
import { PublicTransitionLink } from '../components/PublicPageTransition';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BellRing,
  Building2,
  CreditCard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ScanLine,
  ShieldCheck,
  Sparkles,
  User,
  UserCog,
  UserPlus,
  Users,
} from 'lucide-react';

type Role = 'STUDENT' | 'WARDEN' | 'ACCOUNTANT' | 'ADMIN';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
};

type RegisterSubmission = RegisterFormData & {
  enrollmentNumber?: string;
};

const roleOptions: Array<{ value: Role; label: string; icon: React.ElementType; accent: string }> = [
  { value: 'STUDENT', label: 'Student', icon: Users, accent: 'text-[#d8ff65]' },
  { value: 'WARDEN', label: 'Warden', icon: ShieldCheck, accent: 'text-[#66e3ff]' },
  { value: 'ACCOUNTANT', label: 'Accountant', icon: CreditCard, accent: 'text-[#f7c948]' },
  { value: 'ADMIN', label: 'Admin', icon: UserCog, accent: 'text-[#ff6b9a]' },
];

const setupTimeline = [
  'Create identity',
  'Assign role lane',
  'Route to dashboard',
];

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role: Role) => {
    setFormData({ ...formData, role });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const submissionData: RegisterSubmission = { ...formData };
    if (submissionData.role === 'STUDENT') {
      submissionData.enrollmentNumber = `STU-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    try {
      await api.post('/auth/register', submissionData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#080908] p-4 text-[#f4f1e8]">
        <div className="pointer-events-none fixed inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(216,255,101,.2),transparent_30%),linear-gradient(180deg,transparent,#080908_78%)]" />
        <div className="relative z-10 w-full max-w-[560px] border border-white/[0.14] bg-[#111411]/[0.92] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,.65)] sm:p-10">
          <div className="mx-auto mb-7 grid h-20 w-20 place-items-center border border-[#d8ff65]/40 bg-[#d8ff65]/10 text-[#d8ff65]">
            <BadgeCheck size={42} />
          </div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#d8ff65]">access profile generated</p>
          <h2 className="font-display text-5xl font-black uppercase leading-none">Account ready</h2>
          <p className="mx-auto mt-5 max-w-sm text-white/[0.6]">Routing you to the sign-in node so you can enter the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080908] text-[#f4f1e8] selection:bg-[#d8ff65] selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,107,154,.16),transparent_26%),radial-gradient(circle_at_84%_32%,rgba(216,255,101,.16),transparent_30%),linear-gradient(180deg,transparent,#080908_78%)]" />

      <main className="relative z-10 grid min-h-screen gap-5 p-4 xl:grid-cols-[minmax(430px,0.82fr)_minmax(640px,1.18fr)] xl:p-6">
        <section className="relative flex min-h-[520px] flex-col justify-between overflow-hidden border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-8 xl:min-h-[calc(100vh-3rem)] xl:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ff6b9a,#d8ff65,#66e3ff,#f7c948)]" />
          <div className="absolute -left-24 bottom-14 h-72 w-72 bg-[conic-gradient(from_120deg,#ff6b9a,#d8ff65,#66e3ff,#ff6b9a)] opacity-20 blur-3xl" />

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
              to="/login"
              label="access handoff"
              title="AUTH NODE"
              detail="Switching from account creation to the secure sign-in surface"
              accent="#66e3ff"
              className="inline-flex items-center gap-2 border border-white/[0.12] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white/[0.6] transition hover:border-[#d8ff65]/50 hover:text-[#d8ff65]"
            >
              <ArrowLeft size={14} />
              Sign in
            </PublicTransitionLink>
          </div>

          <div className="my-10 max-w-3xl xl:my-8">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.34em] text-[#ff6b9a]">New resident identity</p>
            <h1 className="font-display text-[clamp(4.4rem,8.4vw,8.2rem)] font-black uppercase leading-[0.84] tracking-normal">
              Build
              <span className="block text-[#d8ff65]">Your</span>
              <span className="block text-outline">Access</span>
            </h1>
          </div>

          <div className="relative mb-5 hidden min-h-48 overflow-hidden border border-white/10 bg-black/20 p-4 sm:block">
            <div className="absolute inset-4 border border-white/10" />
            <div className="absolute left-8 top-8 flex items-center gap-3 border border-[#d8ff65]/30 bg-[#d8ff65]/10 px-4 py-3 text-[#d8ff65]">
              <ScanLine size={18} />
              <span className="text-[10px] font-bold uppercase tracking-[0.24em]">Enrollment route</span>
            </div>
            <div className="absolute bottom-8 left-8 right-8 h-px bg-gradient-to-r from-[#ff6b9a] via-[#d8ff65] to-[#66e3ff]" />
            <div className="absolute bottom-5 left-[18%] grid h-7 w-7 place-items-center border border-[#ff6b9a] bg-[#111411] text-[#ff6b9a]">
              <MapPin size={15} />
            </div>
            <div className="absolute bottom-5 left-[50%] grid h-7 w-7 place-items-center border border-[#d8ff65] bg-[#111411] text-[#d8ff65]">
              <Sparkles size={15} />
            </div>
            <div className="absolute bottom-5 right-[14%] grid h-7 w-7 place-items-center border border-[#66e3ff] bg-[#111411] text-[#66e3ff]">
              <UserPlus size={15} />
            </div>
            <div className="absolute right-8 top-8 text-right">
              <p className="font-display text-5xl font-black">04</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/[0.45]">role lanes</p>
            </div>
          </div>

          <div className="space-y-3">
            {setupTimeline.map((item, index) => (
              <div key={item} className="flex items-center gap-4 border border-white/10 bg-white/[0.03] p-4">
                <span className="grid h-9 w-9 place-items-center border border-white/[0.12] font-display text-sm font-black text-[#d8ff65]">
                  0{index + 1}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/[0.55]">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative flex min-h-[calc(100vh-2rem)] items-center justify-center overflow-hidden border border-white/10 bg-[#0d0f10] p-4 sm:p-6 xl:min-h-[calc(100vh-3rem)]">
          <div className="absolute inset-5 border border-white/10" />
          <div className="absolute right-8 top-8 hidden border border-white/[0.12] bg-black/[0.5] p-4 backdrop-blur-xl md:block">
            <div className="flex items-center gap-3 text-[#66e3ff]">
              <BellRing size={18} />
              <span className="text-[10px] uppercase tracking-[0.28em]">observer lane armed</span>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-[780px] border border-white/[0.14] bg-[#111411]/[0.92] p-5 shadow-[0_40px_140px_rgba(0,0,0,.65)] sm:p-7">
            <div className="mb-8 flex items-start justify-between gap-5 border-b border-white/10 pb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#d8ff65]">profile setup</p>
                <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none">Create account</h2>
              </div>
              <div className="grid h-12 w-12 place-items-center border border-[#d8ff65]/40 bg-[#d8ff65]/10 text-[#d8ff65]">
                <UserPlus size={21} />
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-3 border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.48]">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66e3ff]" />
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-black/25 px-4 py-4 pl-12 text-[#f4f1e8] outline-none transition placeholder:text-white/25 focus:border-[#d8ff65]/70 focus:bg-black/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.48]">Phone Optional</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f7c948]" />
                    <input
                      name="phone"
                      type="text"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-black/25 px-4 py-4 pl-12 text-[#f4f1e8] outline-none transition placeholder:text-white/25 focus:border-[#d8ff65]/70 focus:bg-black/40"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.48]">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#66e3ff]" />
                    <input
                      name="email"
                      type="email"
                      placeholder="student@university.edu"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-black/25 px-4 py-4 pl-12 text-[#f4f1e8] outline-none transition placeholder:text-white/25 focus:border-[#d8ff65]/70 focus:bg-black/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.48]">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d8ff65]" />
                    <input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border border-white/10 bg-black/25 px-4 py-4 pl-12 text-[#f4f1e8] outline-none transition placeholder:text-white/25 focus:border-[#d8ff65]/70 focus:bg-black/40"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/[0.48]">Role lane</p>
                <div className="grid gap-3 sm:grid-cols-4">
                  {roleOptions.map(({ value, label, icon: Icon, accent }) => {
                    const isActive = formData.role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`group border p-4 text-left transition ${
                          isActive
                            ? 'border-[#d8ff65] bg-[#d8ff65]/10'
                            : 'border-white/10 bg-black/20 hover:border-white/25'
                        }`}
                      >
                        <Icon className={`mb-7 ${isActive ? 'text-[#d8ff65]' : accent}`} size={20} />
                        <span className="block text-xs font-black uppercase tracking-[0.16em] text-white/[0.75]">{label}</span>
                      </button>
                    );
                  })}
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
                    Generate access
                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-sm text-white/[0.55] sm:flex-row sm:items-center">
              <span>Already cleared for entry?</span>
              <Link to="/login" className="font-bold uppercase tracking-[0.18em] text-[#d8ff65] transition hover:text-[#f4f1e8]">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Register;
