import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../contexts/AuthContext';
import { AlertTriangle, Building2, Calculator, CreditCard, Wallet } from 'lucide-react';

type Payment = {
  id: string;
  type?: string;
  status: string;
  dueDate: string;
  amount?: string | number;
  totalAmount?: string | number;
  receiptNumber?: string | null;
  student?: {
    user?: {
      name?: string;
    };
  };
};

type Stats = {
  totalRevenue: number;
  collected: number;
  pending: number;
  overdue: number;
  totalBills: number;
};

type DashboardResponse<T> = {
  data: {
    data: T;
  };
};

const errorMessage = (error: unknown, fallback: string) => (
  axios.isAxiosError(error) ? error.response?.data?.message || fallback : fallback
);

const money = (value: number) => `₹${value.toLocaleString()}`;

export const AccountantDashboard: React.FC<{ activeView?: 'invoices' | 'penalties' | 'payments' }> = ({ activeView = 'invoices' }) => {
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingPenalties, setLoadingPenalties] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, collected: 0, pending: 0, overdue: 0, totalBills: 0 });
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  const fetchFinancials = React.useEffectEvent(async () => {
    try {
      const res = await api.get('/payments/all').catch(() => ({ data: { data: [] as Payment[] } })) as DashboardResponse<Payment[]>;
      const payments = res.data.data || [];

      const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.totalAmount || payment.amount || 0), 0);
      const collected = payments.filter((payment) => payment.status === 'PAID').reduce((sum, payment) => sum + Number(payment.totalAmount || payment.amount || 0), 0);
      const pending = payments.filter((payment) => payment.status === 'PENDING').reduce((sum, payment) => sum + Number(payment.totalAmount || payment.amount || 0), 0);
      const overdue = payments.filter((payment) => payment.status === 'OVERDUE').reduce((sum, payment) => sum + Number(payment.totalAmount || payment.amount || 0), 0);
      const sortedPayments = [...payments].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

      setStats({ totalRevenue, collected, pending, overdue, totalBills: payments.length });
      setRecentPayments(sortedPayments);
    } catch (error) {
      console.error('Failed to fetch financials', error);
    }
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchFinancials();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleGenerateBills = async () => {
    setLoadingGenerate(true);
    setSuccessMsg(null);
    try {
      const now = new Date();
      await api.post('/payments/generate', {
        month: now.toLocaleString('default', { month: 'long' }).toUpperCase(),
        year: now.getFullYear(),
      });
      setSuccessMsg('Successfully generated regular and mess bills for all active allocations.');
      void fetchFinancials();
    } catch (error) {
      alert(errorMessage(error, 'Failed to generate bills'));
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleApplyPenalties = async () => {
    setLoadingPenalties(true);
    setSuccessMsg(null);
    try {
      const res = await api.post('/payments/penalties');
      setSuccessMsg(res.data.message || 'Successfully applied late fees to overdue payments.');
      void fetchFinancials();
    } catch (error) {
      alert(errorMessage(error, 'Failed to apply penalties'));
    } finally {
      setLoadingPenalties(false);
    }
  };

  return (
    <div className="space-y-5">
      {successMsg && (
        <div className="border border-[#53d18a]/25 bg-[#53d18a]/10 px-5 py-4 text-sm font-medium text-[#53d18a]" onClick={() => setSuccessMsg(null)}>
          {successMsg}
        </div>
      )}

      {activeView === 'invoices' && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                  <Calculator className="text-[#d8ff65]" size={19} />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">invoice engine</span>
                </div>
                <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Generate Bills</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                  Run monthly room and mess billing for all active residents from one focused finance action.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">total billed</p>
                <p className="font-display text-4xl font-black text-[#d8ff65]">{money(stats.totalRevenue)}</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/[0.45]">billing action</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/[0.58]">
                  Generate the current month’s regular room fees and dynamic mess deductions for every active allocation.
                </p>
                <button onClick={handleGenerateBills} disabled={loadingGenerate} className="btn-primary mt-8 w-full py-3 text-xs">
                  <Building2 size={15} /> {loadingGenerate ? 'Generating...' : 'Generate Monthly Invoices'}
                </button>
              </div>
              <div className="grid gap-4">
                <InfoCell label="Collected" value={money(stats.collected)} />
                <InfoCell label="Pending" value={money(stats.pending)} />
              </div>
            </div>
          </div>
        </section>
      )}

      {activeView === 'penalties' && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                  <AlertTriangle className="text-[#f7c948]" size={19} />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">penalty audits</span>
                </div>
                <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Late Fee Sweep</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                  Transition overdue payments and apply late fee surcharges after the grace period.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">overdue total</p>
                <p className="font-display text-4xl font-black text-[#f7c948]">{money(stats.overdue)}</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/[0.45]">penalty action</p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/[0.58]">
                  Scan all pending payments, move expired ones to `OVERDUE`, and apply daily late charges where needed.
                </p>
                <button onClick={handleApplyPenalties} disabled={loadingPenalties} className="btn-primary mt-8 w-full py-3 text-xs">
                  <Wallet size={15} /> {loadingPenalties ? 'Scanning...' : 'Apply Late Penalties'}
                </button>
              </div>
              <div className="grid gap-4">
                <InfoCell label="Total Bills" value={stats.totalBills.toString().padStart(2, '0')} />
                <InfoCell label="Overdue Count" value={recentPayments.filter((payment) => payment.status === 'OVERDUE').length.toString().padStart(2, '0')} />
              </div>
            </div>
          </div>
        </section>
      )}

      {activeView === 'payments' && (
        <section className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                <CreditCard className="text-[#66e3ff]" size={19} />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">payment records</span>
              </div>
              <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Payment Ledger</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                Review collected, pending, and overdue billing records across the hostel payment system.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoCell label="Collected" value={money(stats.collected)} />
              <InfoCell label="Pending" value={money(stats.pending)} />
              <InfoCell label="Overdue" value={money(stats.overdue)} />
            </div>
          </div>

          {recentPayments.length === 0 ? (
            <EmptyState label="No payment records yet. Generate invoices to populate the ledger." />
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1.05fr_.8fr_.75fr_.65fr_.55fr] lg:items-center">
                  <div>
                    <p className="font-display text-2xl font-black">{payment.student?.user?.name || 'Unknown Resident'}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/[0.45]">{payment.type?.replace('_', ' ') || 'Unknown type'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">amount</p>
                    <p className="mt-2 font-display text-2xl font-black">{money(Number(payment.totalAmount || payment.amount || 0))}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">due date</p>
                    <p className="mt-2 font-semibold">{new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">status</p>
                    <span className={`mt-2 inline-flex px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${
                      payment.status === 'PAID'
                        ? 'bg-[#53d18a]/15 text-[#53d18a]'
                        : payment.status === 'OVERDUE'
                          ? 'bg-rose-400/15 text-rose-300'
                          : 'bg-[#f7c948]/15 text-[#f7c948]'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">receipt</p>
                    <p className="mt-2 text-sm text-white/[0.58]">{payment.receiptNumber || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

const EmptyState = ({ label }: { label: string }) => (
  <div className="grid min-h-36 place-items-center border border-dashed border-white/10 bg-white/[0.025] p-6 text-center text-sm text-white/[0.48]">
    {label}
  </div>
);

const InfoCell = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="border border-white/10 bg-black/20 p-4">
    <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.4]">{label}</p>
    <p className="mt-3 font-display text-2xl font-black">{value}</p>
  </div>
);
