import React, { useState } from 'react';
import { api } from '../../contexts/AuthContext';
import { Wallet, Calculator, AlertTriangle, Building2, CheckCircle2 } from 'lucide-react';

export const AccountantDashboard: React.FC = () => {
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingPenalties, setLoadingPenalties] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      await api.post('/payments/penalties');
      setSuccessMsg('Successfully scanned database and applied late fees to overdue payments!');
    } catch (error: any) {
       alert(error.response?.data?.message || 'Failed to apply penalties');
    } finally {
      setLoadingPenalties(false);
    }
  };

  return (
    <div className="space-y-8">
      {successMsg && (
         <div className="bg-success/10 border border-success/30 text-success px-6 py-4 rounded-xl flex items-center gap-3">
             <CheckCircle2 size={20} />
             {successMsg}
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Generate Bills Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <Calculator className="text-accentPrimary" size={24} /> Generate Invoices
            </h2>
            <p className="text-sm text-textSecondary mb-8 leading-relaxed">
                Utilize the Billing Strategy Pattern to calculate standard room fees and dynamic mess deductions for the current month.
            </p>
            <button 
                onClick={handleGenerateBills} 
                disabled={loadingGenerate}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base font-semibold"
            >
                <Building2 size={20} />
                {loadingGenerate ? 'Calculating Matrix...' : 'Generate Monthly Invoices'}
            </button>
        </section>

        {/* Apply Penalties Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <AlertTriangle className="text-warning" size={24} /> Overdue Audits
            </h2>
            <p className="text-sm text-textSecondary mb-8 leading-relaxed">
                Trigger a manual database scan to transition expired pending payments to OVERDUE and apply a 5% late fee surcharge.
            </p>
            <button 
                onClick={handleApplyPenalties} 
                className="w-full bg-warning/20 hover:bg-warning/30 text-warning border border-warning/10 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-warning/50 focus:outline-none"
            >
                <Wallet size={20} />
                {loadingPenalties ? 'Scanning Records...' : 'Execute Late Fee Penalties'}
            </button>
        </section>

      </div>
      
      {/* Financial Overview (Static for demo) */}
      <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold mb-6">Financial Overview (Demo)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bgTertiary p-6 rounded-xl border border-white/5">
                    <p className="text-sm text-textSecondary mb-1">Total Expected Revenue</p>
                    <p className="text-3xl font-display font-bold text-white">$142,500</p>
                </div>
                <div className="bg-bgTertiary p-6 rounded-xl border border-white/5">
                    <p className="text-sm text-textSecondary mb-1">Collected (Paid)</p>
                    <p className="text-3xl font-display font-bold text-success">$98,200</p>
                </div>
                <div className="bg-bgTertiary p-6 rounded-xl border border-white/5">
                    <p className="text-sm text-textSecondary mb-1">Pending Defaults</p>
                    <p className="text-3xl font-display font-bold text-error">$14,300</p>
                </div>
            </div>
      </section>
    </div>
  );
};
