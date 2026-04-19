import React, { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { Wallet, Calculator, AlertTriangle, Building2, CheckCircle2, BarChart3, TrendingUp, Clock } from 'lucide-react';

export const AccountantDashboard: React.FC = () => {
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingPenalties, setLoadingPenalties] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalRevenue: 0, collected: 0, pending: 0, overdue: 0, totalBills: 0 });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  const fetchFinancials = async () => {
    try {
      // We don't have a dedicated admin payments endpoint, but we can use `/payments/all` for accountants
      const res = await api.get('/payments/all').catch(() => ({ data: { data: [] } }));
      const payments = res.data.data || [];

      const totalRevenue = payments.reduce((s: number, p: any) => s + Number(p.totalAmount || p.amount || 0), 0);
      const collected = payments.filter((p: any) => p.status === 'PAID').reduce((s: number, p: any) => s + Number(p.totalAmount || p.amount || 0), 0);
      const pending = payments.filter((p: any) => p.status === 'PENDING').reduce((s: number, p: any) => s + Number(p.totalAmount || p.amount || 0), 0);
      const overdue = payments.filter((p: any) => p.status === 'OVERDUE').reduce((s: number, p: any) => s + Number(p.totalAmount || p.amount || 0), 0);
      
      setStats({ totalRevenue, collected, pending, overdue, totalBills: payments.length });
      setRecentPayments(payments.slice(0, 10));
    } catch (e) {
      console.error('Failed to fetch financials', e);
    }
  };

  useEffect(() => { fetchFinancials(); }, []);

  const handleGenerateBills = async () => {
    setLoadingGenerate(true);
    setSuccessMsg(null);
    try {
      const now = new Date();
      await api.post('/payments/generate', { 
         month: now.toLocaleString('default', { month: 'long' }).toUpperCase(),
         year: now.getFullYear() 
      });
      setSuccessMsg('Successfully generated regular and mess bills for all active allocations!');
      fetchFinancials();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate bills');
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleApplyPenalties = async () => {
    setLoadingPenalties(true);
    setSuccessMsg(null);
    try {
      const res = await api.post('/payments/penalties');
      setSuccessMsg(res.data.message || 'Successfully applied late fees to overdue payments!');
      fetchFinancials();
    } catch (error: any) {
       alert(error.response?.data?.message || 'Failed to apply penalties');
    } finally {
      setLoadingPenalties(false);
    }
  };

  return (
    <div className="space-y-8">
      {successMsg && (
         <div className="bg-success/10 border border-success/30 text-success px-6 py-4 rounded-xl flex items-center gap-3 cursor-pointer" onClick={() => setSuccessMsg(null)}>
             <CheckCircle2 size={20} />
             {successMsg}
         </div>
      )}

      {/* Financial Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 text-center">
          <TrendingUp size={20} className="mx-auto mb-2 text-accentPrimary" />
          <div className="text-2xl font-display font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-textSecondary mt-1">Total Billed</div>
        </div>
        <div className="glass-panel p-5 text-center">
          <CheckCircle2 size={20} className="mx-auto mb-2 text-success" />
          <div className="text-2xl font-display font-bold text-success">₹{stats.collected.toLocaleString()}</div>
          <div className="text-xs text-textSecondary mt-1">Collected</div>
        </div>
        <div className="glass-panel p-5 text-center">
          <Clock size={20} className="mx-auto mb-2 text-warning" />
          <div className="text-2xl font-display font-bold text-warning">₹{stats.pending.toLocaleString()}</div>
          <div className="text-xs text-textSecondary mt-1">Pending</div>
        </div>
        <div className="glass-panel p-5 text-center">
          <AlertTriangle size={20} className="mx-auto mb-2 text-error" />
          <div className="text-2xl font-display font-bold text-error">₹{stats.overdue.toLocaleString()}</div>
          <div className="text-xs text-textSecondary mt-1">Overdue</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Generate Bills Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <Calculator className="text-accentPrimary" size={24} /> Generate Invoices
            </h2>
            <p className="text-sm text-textSecondary mb-8 leading-relaxed">
                Calculate standard room fees and dynamic mess deductions for the current month using the Strategy pattern.
            </p>
            <button 
                onClick={handleGenerateBills} 
                disabled={loadingGenerate}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base font-semibold"
            >
                <Building2 size={20} />
                {loadingGenerate ? 'Calculating...' : 'Generate Monthly Invoices'}
            </button>
        </section>

        {/* Apply Penalties Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <AlertTriangle className="text-warning" size={24} /> Overdue Audits
            </h2>
            <p className="text-sm text-textSecondary mb-8 leading-relaxed">
                Scan database to transition expired pending payments to OVERDUE and apply a ₹50/day late fee surcharge (after 5-day grace).
            </p>
            <button 
                onClick={handleApplyPenalties} 
                disabled={loadingPenalties}
                className="w-full bg-warning/20 hover:bg-warning/30 text-warning border border-warning/10 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-warning/50 focus:outline-none"
            >
                <Wallet size={20} />
                {loadingPenalties ? 'Scanning Records...' : 'Execute Late Fee Penalties'}
            </button>
        </section>
      </div>

      {/* Recent Payments Table */}
      <section className="glass-panel p-8">
        <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-6">
          <BarChart3 className="text-accentPrimary" size={24} /> Recent Payments ({stats.totalBills} total)
        </h2>
        {recentPayments.length === 0 ? (
          <div className="text-center py-12 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
            No payment records yet. Generate invoices to populate billing data.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-[11px] uppercase tracking-wider text-textTertiary font-semibold">
              <div className="col-span-3">Student</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Receipt</div>
            </div>
            {recentPayments.map((pay: any) => (
              <div key={pay.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-bgTertiary rounded-xl px-4 py-3 border border-white/5 items-center text-sm">
                <div className="col-span-3 text-white font-medium">{pay.student?.user?.name || '—'}</div>
                <div className="col-span-2 text-textSecondary">{pay.type?.replace('_', ' ')}</div>
                <div className="col-span-2 font-medium">₹{Number(pay.totalAmount || pay.amount).toLocaleString()}</div>
                <div className="col-span-2 text-textSecondary text-xs">{new Date(pay.dueDate).toLocaleDateString()}</div>
                <div className="col-span-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                    pay.status === 'PAID' ? 'bg-success/20 text-success' : 
                    pay.status === 'OVERDUE' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'
                  }`}>{pay.status}</span>
                </div>
                <div className="col-span-1 text-textTertiary text-xs">{pay.receiptNumber || '—'}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
