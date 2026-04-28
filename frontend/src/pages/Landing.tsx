import React from 'react';
import { Link } from 'react-router-dom';
import { PublicTransitionLink } from '../components/PublicPageTransition';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  BellRing,
  Building2,
  DoorOpen,
  Gauge,
  KeyRound,
  MessageSquareWarning,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users,
} from 'lucide-react';

const orbitSignals = [
  { icon: DoorOpen, label: 'Check-in', value: '42', position: 'left-[3%] top-[8%]' },
  { icon: ReceiptText, label: 'Fees', value: '98%', position: 'right-[3%] top-[8%]' },
  { icon: MessageSquareWarning, label: 'Issues', value: '08', position: 'left-[3%] bottom-[7%]' },
  { icon: Utensils, label: 'Mess', value: '1.2k', position: 'right-[3%] bottom-[7%]' },
];

const commandRows = [
  { label: 'Room allocation queue', value: '21 requests', tone: 'bg-cyan-400' },
  { label: 'Late payment watchlist', value: '04 alerts', tone: 'bg-amber-300' },
  { label: 'Complaint escalation lane', value: '02 urgent', tone: 'bg-rose-400' },
];

const metrics = [
  { value: '4', label: 'role dashboards' },
  { value: '12k+', label: 'audit-ready actions' },
  { value: '98%', label: 'allocation clarity' },
];

const workflows = [
  {
    icon: BedDouble,
    title: 'Allocation Flow',
    copy: 'Approve, occupy, vacate, and track room state changes without spreadsheet drift.',
  },
  {
    icon: BellRing,
    title: 'Complaint Pulse',
    copy: 'Escalations and observer notifications surface the right issue to the right role.',
  },
  {
    icon: ReceiptText,
    title: 'Payment Logic',
    copy: 'Regular fees, mess plans, and penalties stay cleanly separated through strategies.',
  },
  {
    icon: ShieldCheck,
    title: 'Role Control',
    copy: 'Students, wardens, accountants, and admins land in focused operational views.',
  },
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080908] text-[#f4f1e8] selection:bg-[#d8ff65] selection:text-black">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(216,255,101,.16),transparent_34%),linear-gradient(180deg,transparent_0%,#080908_82%)]" />

      <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between border border-white/10 bg-[#080908]/[0.72] px-4 py-3 backdrop-blur-2xl sm:px-5">
          <Link to="/" className="group flex items-center gap-3" aria-label="HostelSphere home">
            <span className="grid h-10 w-10 place-items-center border border-[#d8ff65]/50 bg-[#d8ff65] text-black transition-transform duration-300 group-hover:rotate-3">
              <Building2 size={20} strokeWidth={2.4} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-lg font-semibold tracking-tight">HostelSphere</span>
              <span className="block text-[10px] uppercase tracking-[0.38em] text-white/[0.45]">campus ops</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.22em] text-white/[0.55] md:flex">
            <a href="#ops" className="transition hover:text-[#d8ff65]">Ops</a>
            <a href="#workflows" className="transition hover:text-[#d8ff65]">Systems</a>
            <a href="#access" className="transition hover:text-[#d8ff65]">Access</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <PublicTransitionLink
              to="/login"
              label="access handoff"
              title="AUTH NODE"
              detail="Routing from campus overview into the secure sign-in surface"
              accent="#66e3ff"
              className="px-3 py-2 text-sm font-medium text-white/[0.68] transition hover:text-white"
            >
              Log in
            </PublicTransitionLink>
            <PublicTransitionLink
              to="/register"
              label="enrollment handoff"
              title="ACCESS BUILD"
              detail="Opening the identity creation lane for a new hostel profile"
              accent="#d8ff65"
              className="group inline-flex items-center gap-2 bg-[#f4f1e8] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d8ff65]"
            >
              Start
              <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={16} />
            </PublicTransitionLink>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="relative min-h-screen px-4 pb-10 pt-28 sm:px-6 lg:px-10 lg:pt-32">
          <div className="mx-auto grid max-w-[1500px] gap-8 lg:min-h-[calc(100vh-9rem)] lg:grid-cols-[1.02fr_.98fr] lg:items-stretch">
            <div className="relative flex min-h-[640px] flex-col justify-between overflow-hidden border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-8 lg:p-10">
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#d8ff65,#66e3ff,#ff6b9a,#f7c948)]" />
              <div className="absolute right-6 top-24 hidden h-40 w-px bg-white/[0.12] lg:block" />
              <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/4 translate-y-1/3 bg-[conic-gradient(from_120deg,#d8ff65,#66e3ff,#ff6b9a,#d8ff65)] opacity-25 blur-3xl" />

              <div>
                <div className="mb-10 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.26em] text-white/50">
                  <span className="border border-white/[0.12] px-3 py-2">Smart hostel management</span>
                  <span className="hidden h-px w-16 bg-white/20 sm:block" />
                  <span>Live campus operating layer</span>
                </div>

                <h1 className="max-w-full font-display text-[clamp(3.9rem,8.4vw,8.9rem)] font-black uppercase leading-[0.86] tracking-normal text-[#f4f1e8] sm:text-[clamp(4.8rem,8.1vw,8.9rem)]">
                  Hostel
                  <span className="block text-[#d8ff65]">Ops</span>
                  <span className="block text-outline">Rewired</span>
                </h1>
              </div>

              <div className="grid gap-8 lg:grid-cols-[.78fr_1fr] lg:items-end">
                <div className="space-y-4 text-sm uppercase tracking-[0.18em] text-white/[0.45]">
                  <p>Built for wardens, admins, accountants, and students moving through one shared system.</p>
                  <div className="h-px bg-white/[0.12]" />
                  <p>Room states, mess plans, payments, complaints, attendance, and audit trails in one visual command flow.</p>
                </div>

                <div className="max-w-2xl">
                  <p className="text-balance text-xl leading-relaxed text-white/[0.72] sm:text-2xl">
                    A sharper front door for your backend: cinematic, fast, and product-first, with the hostel control room visible from the first second.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <PublicTransitionLink
                      to="/register"
                      label="enrollment handoff"
                      title="ACCESS BUILD"
                      detail="Opening the identity creation lane for a new hostel profile"
                      accent="#d8ff65"
                      className="group inline-flex items-center justify-center gap-3 bg-[#d8ff65] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#f4f1e8]"
                    >
                      Launch portal
                      <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                    </PublicTransitionLink>
                    <PublicTransitionLink
                      to="/login"
                      label="access handoff"
                      title="AUTH NODE"
                      detail="Routing from campus overview into the secure sign-in surface"
                      accent="#66e3ff"
                      className="inline-flex items-center justify-center gap-3 border border-white/[0.14] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white/75 transition hover:border-white/[0.35] hover:text-white"
                    >
                      Existing user
                    </PublicTransitionLink>
                  </div>
                </div>
              </div>
            </div>

            <div id="ops" className="relative min-h-[640px] overflow-hidden border border-white/10 bg-[#0d0f10] p-4 sm:p-6">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(102,227,255,.16),transparent_30%),linear-gradient(315deg,rgba(216,255,101,.14),transparent_34%)]" />
              <div className="absolute inset-5 border border-white/10" />

              {orbitSignals.map(({ icon: Icon, label, value, position }, index) => (
                <div
                  key={label}
                  className={`float-card pointer-events-none absolute z-30 ${position} hidden w-32 border border-white/[0.12] bg-black/[0.68] p-3 shadow-[0_18px_60px_rgba(0,0,0,.45)] backdrop-blur-xl sm:block xl:w-36`}
                  style={{ animationDelay: `${index * 0.45}s` }}
                >
                  <div className="flex items-center justify-between text-white/50">
                    <Icon size={17} />
                    <span className="text-[10px] uppercase tracking-[0.26em]">{label}</span>
                  </div>
                  <div className="mt-3 font-display text-3xl font-black">{value}</div>
                </div>
              ))}

              <div className="relative z-10 flex h-full min-h-[600px] items-center justify-center">
                <div className="command-shell relative w-full max-w-[620px] border border-white/[0.14] bg-[#111411]/[0.92] p-4 shadow-[0_40px_140px_rgba(0,0,0,.65)] sm:p-5">
                  <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.32em] text-[#d8ff65]">Central stack</p>
                      <h2 className="mt-1 font-display text-2xl font-bold">Tonight’s hostel pulse</h2>
                    </div>
                    <div className="grid h-12 w-12 place-items-center border border-[#d8ff65]/40 bg-[#d8ff65]/10 text-[#d8ff65]">
                      <Activity size={22} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1fr_.72fr]">
                    <div className="space-y-3">
                      {commandRows.map((row) => (
                        <div key={row.label} className="group border border-white/10 bg-white/[0.035] p-4 transition hover:border-[#d8ff65]/40">
                          <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/[0.45]">
                            <span>{row.label}</span>
                            <span>{row.value}</span>
                          </div>
                          <div className="h-2 overflow-hidden bg-white/[0.08]">
                            <div className={`${row.tone} metric-bar h-full`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border border-white/10 bg-black/20 p-4">
                      <div className="mb-5 flex items-center justify-between">
                        <Gauge className="text-[#66e3ff]" size={20} />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Load</span>
                      </div>
                      <div className="relative mx-auto grid aspect-square max-w-44 place-items-center rounded-full border border-white/10 bg-[conic-gradient(#d8ff65_0deg_252deg,rgba(255,255,255,.1)_252deg_360deg)] p-3">
                        <div className="grid h-full w-full place-items-center rounded-full bg-[#111411]">
                          <div className="text-center">
                            <p className="font-display text-5xl font-black">70</p>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-white/[0.45]">capacity</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/[0.45]">
                        <span className="border border-white/10 py-2">Boys wing</span>
                        <span className="border border-white/10 py-2">Girls wing</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="border border-white/10 p-4">
                      <Users className="mb-6 text-[#ff6b9a]" size={20} />
                      <p className="font-display text-3xl font-black">836</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">residents</p>
                    </div>
                    <div className="border border-white/10 p-4">
                      <ScanLine className="mb-6 text-[#d8ff65]" size={20} />
                      <p className="font-display text-3xl font-black">154</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">logs today</p>
                    </div>
                    <div className="border border-white/10 p-4">
                      <KeyRound className="mb-6 text-[#66e3ff]" size={20} />
                      <p className="font-display text-3xl font-black">31</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/40">moves</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1500px] border-y border-white/10">
            <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {metrics.map((metric) => (
                <div key={metric.label} className="group flex min-h-40 items-end justify-between p-5 transition hover:bg-white/[0.035] sm:p-7">
                  <div>
                    <p className="font-display text-6xl font-black text-[#f4f1e8] sm:text-7xl">{metric.value}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/[0.45]">{metric.label}</p>
                  </div>
                  <Sparkles className="mb-2 text-[#d8ff65] opacity-0 transition group-hover:opacity-100" size={22} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflows" className="px-4 pb-28 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[.78fr_1.22fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[#d8ff65]">Designed around your backend</p>
              <h2 className="font-display text-5xl font-black uppercase leading-none sm:text-7xl">
                Every module gets a visual lane.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {workflows.map(({ icon: Icon, title, copy }, index) => (
                <article
                  key={title}
                  className="group min-h-72 border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d8ff65]/50 hover:bg-white/[0.045]"
                >
                  <div className="mb-16 flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center border border-white/[0.12] bg-black/25 text-[#f4f1e8] transition group-hover:border-[#d8ff65]/50 group-hover:text-[#d8ff65]">
                      <Icon size={22} />
                    </div>
                    <span className="font-display text-4xl font-black text-white/[0.12]">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold">{title}</h3>
                  <p className="mt-4 leading-relaxed text-white/[0.55]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="access" className="px-4 pb-10 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 border border-white/10 bg-[#d8ff65] p-6 text-black sm:p-8 lg:flex-row lg:items-end lg:p-10">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-black/[0.55]">Next pass</p>
              <h2 className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
                Landing page first. Full UI system next.
              </h2>
            </div>
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-3 border border-black/20 bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#d8ff65] transition hover:bg-[#10110f]"
            >
              Enter HostelSphere
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
