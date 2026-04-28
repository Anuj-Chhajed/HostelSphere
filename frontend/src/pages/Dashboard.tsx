import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../contexts/AuthContext';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { WardenDashboard } from '../components/dashboards/WardenDashboard';
import { AccountantDashboard } from '../components/dashboards/AccountantDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import {
  Activity,
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  CreditCard,
  Database,
  DoorOpen,
  Layers3,
  LogOut,
  Mail,
  Radio,
  ScanLine,
  ShieldCheck,
  Utensils,
  Wallet,
} from 'lucide-react';

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const roleConfig = {
  STUDENT: {
    eyebrow: 'resident cockpit',
    title: 'Your hostel orbit',
    description: 'Room state, mess plan, attendance, payments, and complaints move through one personal command surface.',
    accent: '#d8ff65',
    icon: DoorOpen,
    signal: 'Personal lane active',
  },
  WARDEN: {
    eyebrow: 'warden ops bridge',
    title: 'Campus movement control',
    description: 'Approve requests, resolve complaints, and mark the daily roll call from one operational board.',
    accent: '#66e3ff',
    icon: ShieldCheck,
    signal: 'Supervision lane active',
  },
  ACCOUNTANT: {
    eyebrow: 'finance command',
    title: 'Billing engine live',
    description: 'Generate invoices, inspect dues, and run overdue audits across the hostel ledger.',
    accent: '#f7c948',
    icon: Wallet,
    signal: 'Ledger lane active',
  },
  ADMIN: {
    eyebrow: 'admin architecture',
    title: 'Infrastructure console',
    description: 'Provision blocks, mount rooms, track occupancy, and inspect the hostel inventory graph.',
    accent: '#ff6b9a',
    icon: Database,
    signal: 'System lane active',
  },
} as const;

const pipelineSteps = [
  { label: 'Room graph', icon: Building2 },
  { label: 'Allocation', icon: DoorOpen },
  { label: 'Attendance', icon: ScanLine },
  { label: 'Billing', icon: Wallet },
];

const workspaceModules = {
  STUDENT: [
    { id: 'room', label: 'Room + Issues', icon: DoorOpen, title: 'Room control', description: 'Allocation status and complaint lane in one focused resident workspace.' },
    { id: 'life', label: 'Mess + Attendance', icon: Utensils, title: 'Daily life systems', description: 'Meal plan and attendance pulse without crowding the room workflow.' },
    { id: 'finance', label: 'Finance', icon: CreditCard, title: 'Payment ledger', description: 'Bills, unpaid balance, and payment actions in a dedicated finance view.' },
  ],
  WARDEN: [
    { id: 'approvals', label: 'Approvals', icon: DoorOpen, title: 'Room approvals', description: 'Process allocation requests with clear queue priority.' },
    { id: 'attendance', label: 'Roll call', icon: Calendar, title: 'Attendance roll call', description: 'Mark daily presence and review resident status.' },
    { id: 'issues', label: 'Issues', icon: AlertCircle, title: 'Complaint lane', description: 'Track and resolve active student complaints.' },
  ],
  ADMIN: [
    { id: 'blocks', label: 'Blocks', icon: Building2, title: 'Block control', description: 'Create and manage hostel buildings.' },
    { id: 'rooms', label: 'Rooms', icon: DoorOpen, title: 'Room inventory', description: 'Provision rooms and inspect occupancy.' },
    { id: 'inventory', label: 'Inventory', icon: Database, title: 'System inventory', description: 'Filter room states and capacity across campus.' },
  ],
  ACCOUNTANT: [
    { id: 'invoices', label: 'Invoices', icon: Wallet, title: 'Invoice engine', description: 'Generate monthly hostel bills.' },
    { id: 'penalties', label: 'Penalties', icon: AlertCircle, title: 'Penalty audits', description: 'Apply overdue rules and late fees.' },
    { id: 'payments', label: 'Payments', icon: CreditCard, title: 'Payment records', description: 'Inspect collected, pending, and overdue payments.' },
  ],
} as const;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const roleKey = user?.role || 'STUDENT';
  const initialModules = workspaceModules[roleKey];
  const mainRef = React.useRef<HTMLElement | null>(null);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = React.useState(false);
  const [activeModule, setActiveModule] = React.useState(() => {
    if (typeof window === 'undefined') return initialModules[0].id;
    const stored = window.localStorage.getItem(`hostelsphere-module-${roleKey}`);
    return stored && initialModules.some((module) => module.id === stored) ? stored : initialModules[0].id;
  });

  const config = roleConfig[roleKey];
  const modules = workspaceModules[roleKey];
  const resolvedModuleId = modules.some((module) => module.id === activeModule) ? activeModule : modules[0].id;
  const selectedModule = modules.find((module) => module.id === resolvedModuleId) || modules[0];
  const RoleIcon = config.icon;
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const titleWords = selectedModule.title.split(' ');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(`hostelsphere-module-${roleKey}`, selectedModule.id);
  }, [roleKey, selectedModule.id]);

  React.useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [selectedModule.id]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await api.get('/notifications/me');
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleNotifications = () => {
    const nextValue = !showNotifications;
    setShowNotifications(nextValue);
    if (nextValue) {
      void fetchNotifications();
    }
  };

  const markAsRead = async (id: string) => {
    await api.patch(`/notifications/${id}/read`).catch(() => { });
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  };

  return (
    <div className="ops-dashboard relative min-h-screen overflow-hidden bg-[#080908] text-[#f4f1e8] selection:bg-[#d8ff65] selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(circle at 18% 18%, ${config.accent}22, transparent 28%), radial-gradient(circle at 85% 30%, rgba(102,227,255,.14), transparent 30%), linear-gradient(180deg, transparent, #080908 78%)`,
        }}
      />

      <aside className="fixed inset-x-4 top-4 z-50 border border-white/10 bg-[#080908]/[0.78] backdrop-blur-2xl lg:bottom-4 lg:left-4 lg:right-auto lg:w-[280px]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-4 lg:block lg:p-5">
          <Link to="/" className="group flex items-center gap-3" aria-label="HostelSphere home">
            <span className="grid h-11 w-11 place-items-center bg-[#d8ff65] text-black transition-transform group-hover:rotate-3">
              <Building2 size={21} strokeWidth={2.4} />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold">HostelSphere</span>
              <span className="block text-[10px] uppercase tracking-[0.36em] text-white/[0.45]">campus ops</span>
            </span>
          </Link>

          <div className="lg:mt-7">
            <span className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/[0.6]">
              <span className="h-2 w-2 animate-pulse" style={{ backgroundColor: config.accent }} />
              {user?.role}
            </span>
          </div>
        </div>

        <nav className="hidden border-b border-white/10 p-4 lg:block">
          <div className="space-y-2">
            {modules.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveModule(id)}
                className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.14em] transition ${selectedModule.id === id ? 'ops-nav-active' : 'border-transparent text-white/[0.42] hover:border-white/10 hover:text-white'
                  }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="hidden p-4 lg:block">
          <div className="relative overflow-hidden border border-white/10 bg-white/[0.025] p-4">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.45]">pipeline</span>
              <Radio size={16} style={{ color: config.accent }} />
            </div>
            <div className="space-y-3">
              {pipelineSteps.map(({ label, icon: Icon }, index) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center border border-white/10 bg-black/20">
                    <Icon size={15} className="text-white/[0.55]" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/[0.5]">{label}</span>
                  {index < pipelineSteps.length - 1 && <span className="ml-auto h-px flex-1 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden p-4 lg:block lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
          <div className="mb-3 flex items-center gap-3 border border-white/10 bg-white/[0.03] p-3">
            <div className="grid h-11 w-11 place-items-center border border-white/10 font-display text-lg font-black" style={{ color: config.accent }}>
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-white/[0.45]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-rose-200 transition hover:bg-rose-400 hover:text-black"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main ref={mainRef} className="relative z-10 px-4 pb-8 pt-32 lg:ml-[304px] lg:max-h-screen lg:overflow-y-auto lg:px-6 lg:pt-4">
        <section className="mb-5 grid gap-5 xl:grid-cols-[1fr_420px]">
          <div className="relative min-h-[360px] overflow-hidden border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${config.accent}, #66e3ff, #ff6b9a, #f7c948)` }} />
            <div className="absolute -right-24 bottom-0 h-72 w-72 opacity-20 blur-3xl" style={{ background: `conic-gradient(from 120deg, ${config.accent}, #66e3ff, #ff6b9a, ${config.accent})` }} />

            <div className="relative z-10 flex h-full flex-col justify-between gap-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                  <RoleIcon size={18} style={{ color: config.accent }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.26em] text-white/[0.52]">{config.eyebrow}</span>
                </div>
                <div className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/[0.45] sm:flex">
                  <Activity size={16} style={{ color: config.accent }} />
                  {selectedModule.label}
                </div>
              </div>

              <div className="max-w-5xl">
                <h1 className="font-display text-[clamp(3rem,6.4vw,7.2rem)] font-black uppercase leading-[0.84] tracking-normal">
                  {titleWords.map((word, index) => (
                    <span key={`${selectedModule.id}-${word}-${index}`} className={index === 0 ? 'block' : 'block text-outline'}>
                      {word}
                    </span>
                  ))}
                </h1>
                <p className="mt-7 max-w-2xl text-xl leading-relaxed text-white/[0.66]">{selectedModule.description}</p>
              </div>
            </div>
          </div>

          <div className="relative border border-white/10 bg-[#0d0f10] p-4 sm:p-5">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: config.accent }}>live updates</p>
                <h2 className="mt-1 font-display text-2xl font-black uppercase">Signal feed</h2>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative grid h-12 w-12 place-items-center border transition ${showNotifications ? 'bg-white/10 text-white' : 'bg-white/[0.03] text-white/[0.55]'}`}
                style={{ borderColor: showNotifications ? config.accent : 'rgba(255,255,255,.1)' }}
              >
                <Bell size={20} />
                {unreadCount > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-lg">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                ) : (
                  <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: config.accent }} />
                )}
              </button>
            </div>

            <div className="min-h-[245px]">
              {!showNotifications ? (
                <div className="grid h-full min-h-[245px] place-items-center border border-dashed border-white/10 bg-white/[0.025] text-center">
                  <div>
                    <Mail className="mx-auto mb-4 text-white/[0.35]" size={28} />
                    <p className="text-sm text-white/[0.5]">Open the signal feed to inspect system notifications.</p>
                  </div>
                </div>
              ) : loadingNotifications ? (
                <div className="grid min-h-[245px] gap-3 border border-white/10 bg-white/[0.025] p-4">
                  <div className="flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="h-2.5 w-2.5 animate-pulse" style={{ backgroundColor: config.accent }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/[0.45]">
                      Intercepting feed
                    </span>
                  </div>
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="border border-white/10 bg-white/[0.03] p-4 animate-pulse">
                      <div className="h-3 w-1/3 bg-white/10" />
                      <div className="mt-4 h-2 w-full bg-white/10" />
                      <div className="mt-2 h-2 w-4/5 bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="grid min-h-[245px] place-items-center border border-dashed border-white/10 bg-white/[0.025] text-center">
                  <p className="text-sm text-white/[0.5]">Inbox is clear.</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="max-h-[280px] space-y-3 overflow-y-auto pr-2 pb-4">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className={`w-full border p-4 text-left transition hover:border-white/25 ${notification.isRead ? 'border-white/10 bg-white/[0.025] opacity-70' : 'border-white/15 bg-white/[0.055]'
                          }`}
                      >
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="text-sm font-bold text-white">{notification.title}</h3>
                          <span className="shrink-0 text-[10px] text-white/[0.35]">{new Date(notification.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="line-clamp-2 text-xs leading-relaxed text-white/[0.5]">{notification.message}</p>
                      </button>
                    ))}
                  </div>
                  {notifications.length > 3 && (
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-12 items-end justify-center bg-gradient-to-t from-[#0d0f10] via-[#0d0f10]/80 to-transparent pb-1">
                      <ChevronDown className="animate-bounce text-[#d8ff65]/50" size={18} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="ops-stat">
            <Layers3 size={20} style={{ color: config.accent }} />
            <div className="ops-stat-copy">
              <span>Role</span>
              <strong style={{ fontSize: user?.role === 'ACCOUNTANT' ? 'clamp(1rem, 3vw, 2.6rem)' : undefined }}>{user?.role}</strong>
            </div>
          </div>
          <div className="ops-stat">
            <ScanLine size={20} className="text-[#66e3ff]" />
            <div className="ops-stat-copy">
              <span>Session</span>
              <strong>Online</strong>
            </div>
          </div>
          <div className="ops-stat">
            <Radio size={20} className="text-[#f7c948]" />
            <div className="ops-stat-copy">
              <span>Unread</span>
              <strong>{unreadCount.toString().padStart(2, '0')}</strong>
            </div>
          </div>
        </section>

        <section className="relative z-10 animate-fade-in-up">
          {user?.role === 'STUDENT' && <StudentDashboard activeView={selectedModule.id as 'room' | 'life' | 'finance'} />}
          {user?.role === 'WARDEN' && <WardenDashboard activeView={selectedModule.id as 'approvals' | 'attendance' | 'issues'} />}
          {user?.role === 'ADMIN' && <AdminDashboard activeView={selectedModule.id as 'blocks' | 'rooms' | 'inventory'} />}
          {user?.role === 'ACCOUNTANT' && <AccountantDashboard activeView={selectedModule.id as 'invoices' | 'penalties' | 'payments'} />}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
