import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../contexts/AuthContext';
import {
  AlertCircle,
  ArrowRight,
  BedDouble,
  Calendar,
  CheckCircle,
  Check,
  Clock,
  CreditCard,
  Lock,
  Plus,
  Trash2,
  Utensils,
} from 'lucide-react';
import SystemLoader from '../SystemLoader';

type Room = {
  roomNumber?: string;
  floor?: number;
  type?: string;
  capacity?: number;
  currentOccupancy?: number;
  block?: { name?: string };
};

type Allocation = {
  id: string;
  status: string;
  preferredType?: string;
  createdAt?: string;
  requestDate?: string;
  remarks?: string;
  room?: Room | null;
};

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
};

type Payment = {
  id: string;
  type: string;
  amount?: string | number;
  totalAmount?: string | number;
  status: string;
  dueDate: string;
};

type MessPlan = {
  id: string;
  name: string;
  pricePerMonth: string | number;
};

type MessSubscription = {
  endDate?: string | null;
  plan: MessPlan;
};

type AttendanceRecord = {
  id: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | string;
};

type DashboardResponse<T> = {
  data: {
    data: T;
  };
};

const errorMessage = (error: unknown, fallback: string) => (
  axios.isAxiosError(error) ? error.response?.data?.message || fallback : fallback
);

const money = (value: string | number | undefined) => `₹${Number(value || 0).toLocaleString()}`;

export const StudentDashboard: React.FC<{ activeView?: 'room' | 'life' | 'finance' }> = ({ activeView = 'room' }) => {
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [allocationHistory, setAllocationHistory] = useState<Allocation[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messPlans, setMessPlans] = useState<MessPlan[]>([]);
  const [myMess, setMyMess] = useState<MessSubscription | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAllComplaints, setShowAllComplaints] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [preferredType, setPreferredType] = useState('DOUBLE');
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({ title: '', description: '', category: 'MAINTENANCE' });
  const [showMessForm, setShowMessForm] = useState(false);
  const [selectedMessPlan, setSelectedMessPlan] = useState('');

  const fetchDashboardData = async () => {
    try {
      const [allocRes, compRes, payRes, plansRes, myMessRes, attRes] = await Promise.all([
        api.get('/allocations/me').catch(() => ({ data: { data: [] as Allocation[] } })),
        api.get('/complaints/me').catch(() => ({ data: { data: [] as Complaint[] } })),
        api.get('/payments/me').catch(() => ({ data: { data: [] as Payment[] } })),
        api.get('/mess/plans').catch(() => ({ data: { data: [] as MessPlan[] } })),
        api.get('/mess/subscriptions/me').catch(() => ({ data: { data: null as MessSubscription | null } })),
        api.get('/attendance/me').catch(() => ({ data: { data: [] as AttendanceRecord[] } })),
      ]) as [
        DashboardResponse<Allocation[]>,
        DashboardResponse<Complaint[]>,
        DashboardResponse<Payment[]>,
        DashboardResponse<MessPlan[]>,
        DashboardResponse<MessSubscription | null>,
        DashboardResponse<AttendanceRecord[]>,
      ];

      const allocList = allocRes.data.data || [];
      const parsedPlans = plansRes.data.data || [];
      
      // Sort allocations to get the latest one first
      allocList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      // Look for an active allocation to display
      const activeAlloc = Array.isArray(allocList) 
        ? allocList.find(a => ['REQUESTED', 'APPROVED', 'OCCUPIED'].includes(a.status))
        : null;

      setAllocation(activeAlloc || null);
      setAllocationHistory(Array.isArray(allocList) ? allocList : []);
      setComplaints(compRes.data.data || []);
      setPayments(payRes.data.data || []);
      setMessPlans(parsedPlans);
      if (parsedPlans.length > 0) setSelectedMessPlan(parsedPlans[0].id);
      setMyMess(myMessRes.data.data);
      setAttendance(attRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchDashboardData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleApplyRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/allocations/request', {
        preferredType,
        remarks: `Frontend request for a ${preferredType} room`,
      });
      setShowRoomForm(false);
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error applying for room'));
    }
  };

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/complaints', complaintData);
      setShowComplaintForm(false);
      setComplaintData({ title: '', description: '', category: 'MAINTENANCE' });
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error raising complaint'));
    }
  };

  const handlePayment = async (id: string) => {
    try {
      await api.post(`/payments/${id}/pay`, { method: 'CARD' });
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error processing payment'));
    }
  };

  const handleOccupyRoom = async (allocationId: string) => {
    try {
      await api.post(`/allocations/${allocationId}/occupy`);
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error marking room as occupied'));
    }
  };

  const handleSubscribeMess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/mess/subscriptions', { planId: selectedMessPlan });
      setShowMessForm(false);
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error subscribing to mess plan'));
    }
  };

  const handleWithdrawAllocation = async (id: string) => {
    if (!confirm('Are you sure you want to withdraw your room application?')) return;
    try {
      await api.delete(`/allocations/${id}`);
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error withdrawing application'));
    }
  };

  const handleWithdrawComplaint = async (id: string) => {
    if (!confirm('Are you sure you want to take back this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error taking back complaint'));
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Delete this resolved complaint from your history?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      void fetchDashboardData();
    } catch (error) {
      alert(errorMessage(error, 'Error deleting complaint'));
    }
  };

  const hasActiveRoom = Boolean(allocation && (allocation.status === 'APPROVED' || allocation.status === 'OCCUPIED'));
  const unpaidAmount = payments
    .filter((payment) => payment.status !== 'PAID')
    .reduce((sum, payment) => sum + Number(payment.totalAmount || payment.amount || 0), 0);
  const paidAmount = payments
    .filter((payment) => payment.status === 'PAID')
    .reduce((sum, payment) => sum + Number(payment.totalAmount || payment.amount || 0), 0);
  const overdueCount = payments.filter((payment) => payment.status === 'OVERDUE').length;
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
  );
  const sortedAttendance = [...attendance].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (loading) {
    return (
      <SystemLoader
        variant="panel"
        label="resident systems"
        title="RESIDENT"
        detail="Loading room, mess, finance, and complaint lanes"
        accent="#d8ff65"
      />
    );
  }

  return (
    <div className="student-command space-y-5">
      {activeView === 'room' && (
        <>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        <div className="relative overflow-hidden border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#d8ff65,#66e3ff,#ff6b9a)]" />
          <div className="absolute -right-24 -top-24 h-72 w-72 bg-[#d8ff65]/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                  <BedDouble className="text-[#d8ff65]" size={19} />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">room control</span>
                </div>
                <h2 className="font-display text-4xl font-black uppercase sm:text-5xl">
                  {allocation?.room ? `Room ${allocation.room.roomNumber}` : allocation?.preferredType ? `${allocation.preferredType} Request` : 'No Room Assigned'}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                  {allocation?.room?.block?.name || 'Allocation state and move-in actions for your resident profile.'}
                </p>
              </div>
              <span className={`border px-4 py-3 text-xs font-black uppercase tracking-[0.18em] ${
                hasActiveRoom ? 'border-[#53d18a]/30 bg-[#53d18a]/10 text-[#53d18a]' : 'border-[#f7c948]/30 bg-[#f7c948]/10 text-[#f7c948]'
              }`}>
                {allocation?.status || 'UNASSIGNED'}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <InfoCell label="Building" value={allocation?.room?.block?.name || 'Pending'} />
              <InfoCell label="Floor" value={allocation?.room?.floor ?? '—'} />
              <InfoCell label="Type" value={allocation?.room?.type || allocation?.preferredType || '—'} />
              <InfoCell label="Capacity" value={allocation?.room ? `${allocation.room.currentOccupancy}/${allocation.room.capacity}` : '—'} />
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
              <div className="border border-white/10 bg-white/[0.025] p-5">
                <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-white/[0.45]">allocation progress</p>
                <div className="space-y-3">
                  {['REQUESTED', 'APPROVED', 'OCCUPIED'].map((step) => {
                    const index = ['REQUESTED', 'APPROVED', 'OCCUPIED'].indexOf(step);
                    const currentIndex = ['REQUESTED', 'APPROVED', 'OCCUPIED'].indexOf(allocation?.status || '');
                    const isReached = currentIndex >= index;
                    const isCompleted = currentIndex > index || (currentIndex === 2 && index === 2);
                    return (
                      <div
                        key={step}
                        className={`flex items-center gap-4 border px-4 py-4 ${
                          isReached ? 'border-[#d8ff65]/35 bg-[#d8ff65]/10' : 'border-white/10 bg-black/20'
                        }`}
                      >
                        <div className={`grid h-11 w-11 shrink-0 place-items-center border text-sm font-display font-black transition-colors ${
                          isCompleted ? 'border-[#d8ff65]/40 bg-[#d8ff65] text-black' : isReached ? 'border-[#d8ff65]/40 text-[#d8ff65]' : 'border-white/10 text-white/[0.4]'
                        }`}>
                          {isCompleted ? <Check strokeWidth={3} size={18} /> : `0${index + 1}`}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-black uppercase tracking-[0.16em] ${
                            isReached ? 'text-[#d8ff65]' : 'text-white/[0.38]'
                          }`}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border border-white/10 bg-white/[0.025] p-5">
                {!allocation ? (
                  showRoomForm ? (
                    <form onSubmit={handleApplyRoom} className="space-y-4">
                      <label className="block text-xs font-black uppercase tracking-[0.22em] text-white/[0.48]">Preferred room type</label>
                      <select value={preferredType} onChange={(e) => setPreferredType(e.target.value)} className="input-field text-sm">
                        <option value="SINGLE">Single Room</option>
                        <option value="DOUBLE">Double Room</option>
                      </select>
                      <button type="submit" className="btn-primary w-full py-3 text-sm">Submit Request</button>
                      <button type="button" onClick={() => setShowRoomForm(false)} className="btn-secondary w-full py-3 text-sm">Cancel</button>
                    </form>
                  ) : (
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/[0.45]">next action</p>
                      <p className="mt-4 text-sm leading-relaxed text-white/[0.6]">Request a room to unlock complaint, mess, attendance, and finance modules.</p>
                      <button className="btn-primary mt-8 w-full py-3 text-sm" onClick={() => setShowRoomForm(true)}>
                        Apply for Room <Plus size={18} />
                      </button>
                    </div>
                  )
                ) : (
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/[0.45]">next action</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/[0.6]">
                      {allocation.status === 'APPROVED' ? 'Your room is approved. Confirm move-in when you occupy the room.' : 'Your allocation state is being tracked.'}
                    </p>
                    {allocation.status === 'APPROVED' && (
                      <button onClick={() => handleOccupyRoom(allocation.id)} className="btn-primary mt-8 w-full py-3 text-sm">
                        Confirm Move-In <ArrowRight size={16} />
                      </button>
                    )}
                    {allocation.status === 'REQUESTED' && (
                      <button onClick={() => handleWithdrawAllocation(allocation.id)} className="mt-8 w-full border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-rose-200">
                        Withdraw Application
                      </button>
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

        <aside className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6 self-start">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-[#ff6b9a]" size={22} />
                <h3 className="font-display text-2xl font-black">Issue Lane</h3>
              </div>
              {!showComplaintForm && hasActiveRoom && (
                <button onClick={() => setShowComplaintForm(true)} className="btn-secondary px-4 py-2 text-xs">Raise</button>
              )}
            </div>

            {showComplaintForm ? (
              <form onSubmit={handleRaiseComplaint} className="space-y-3">
                <input required value={complaintData.title} onChange={(e) => setComplaintData({ ...complaintData, title: e.target.value })} className="input-field py-3 text-sm" placeholder="Issue title" />
                <select value={complaintData.category} onChange={(e) => setComplaintData({ ...complaintData, category: e.target.value })} className="input-field py-3 text-sm">
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="HYGIENE">Hygiene</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="NOISE">Noise</option>
                  <option value="OTHER">Other</option>
                </select>
                <textarea required rows={3} value={complaintData.description} onChange={(e) => setComplaintData({ ...complaintData, description: e.target.value })} className="input-field py-3 text-sm" placeholder="Describe the issue" />
                <div className="grid grid-cols-2 gap-2">
                  <button type="submit" className="btn-primary py-3 text-xs">Submit</button>
                  <button type="button" onClick={() => setShowComplaintForm(false)} className="btn-secondary py-3 text-xs">Cancel</button>
                </div>
              </form>
            ) : !hasActiveRoom ? (
              <LockedState label="Get a room assigned before raising complaints." />
            ) : complaints.length === 0 ? (
              <EmptyState label="No complaints raised." />
            ) : (
              <div className="space-y-3">
                {complaints.slice(0, showAllComplaints ? undefined : 3).map((comp) => (
                  <div key={comp.id} className="border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex justify-between gap-3">
                      <div>
                        <h4 className="font-semibold">{comp.title}</h4>
                        <p className="text-xs capitalize text-white/[0.45]">{comp.category.toLowerCase()}</p>
                      </div>
                      {comp.status === 'RESOLVED' || comp.status === 'CLOSED' ? <CheckCircle size={16} className="text-[#53d18a]" /> : <Clock size={16} className="text-[#f7c948]" />}
                    </div>
                    <p className="mt-3 text-xs italic leading-relaxed text-white/[0.42]">"{comp.description}"</p>
                    <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">
                      <span>{new Date(comp.createdAt).toLocaleDateString()}</span>
                      <span>{comp.status.replace('_', ' ')}</span>
                    </div>
                    {comp.status === 'OPEN' && (
                      <button onClick={() => handleWithdrawComplaint(comp.id)} className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-300">Withdraw</button>
                    )}
                    {(comp.status === 'RESOLVED' || comp.status === 'CLOSED') && (
                      <button onClick={() => handleDeleteComplaint(comp.id)} className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/[0.45]">
                        <Trash2 size={10} /> Remove
                      </button>
                    )}
                  </div>
                ))}
                {complaints.length > 3 && (
                  <button onClick={() => setShowAllComplaints(!showAllComplaints)} className="w-full text-xs font-bold uppercase tracking-[0.18em] text-[#d8ff65]">
                    {showAllComplaints ? 'Collapse complaints' : `View all ${complaints.length}`}
                  </button>
                )}
              </div>
            )}
        </aside>
      </section>

      {allocationHistory.filter(a => ['VACATED', 'REJECTED'].includes(a.status)).length > 0 && (
        <section className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <h3 className="mb-6 flex items-center gap-3 font-display text-2xl font-black">
            Past Room Requests
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {allocationHistory
              .filter(a => ['VACATED', 'REJECTED'].includes(a.status))
              .map((historyItem) => (
                <div key={historyItem.id} className="border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl font-black">{historyItem.room ? `Room ${historyItem.room.roomNumber}` : `${historyItem.preferredType}`}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/[0.42]">
                        Req: {historyItem.requestDate || historyItem.createdAt
                          ? new Date(historyItem.requestDate || historyItem.createdAt || '').toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${
                        historyItem.status === 'REJECTED' ? 'bg-rose-400/15 text-rose-300' : 'bg-white/10 text-white/[0.45]'
                      }`}>
                        {historyItem.status}
                      </span>
                    </div>
                  </div>
                  {historyItem.status === 'REJECTED' && historyItem.remarks && (
                    <p className="mt-4 text-xs italic leading-relaxed text-rose-300/70">"{historyItem.remarks}"</p>
                  )}
                </div>
            ))}
          </div>
        </section>
      )}
        </>
      )}

      {activeView === 'life' && (
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                <Utensils className="text-[#d8ff65]" size={19} />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">mess system</span>
              </div>
              <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">
                {myMess ? myMess.plan.name : 'Meal Access'}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                Plan subscription, monthly food access, and resident meal status.
              </p>
            </div>
            {!showMessForm && !myMess && hasActiveRoom && (
              <button onClick={() => setShowMessForm(true)} className="btn-secondary px-4 py-2 text-xs"><Plus size={15} /> Opt-In</button>
            )}
          </div>

          {!hasActiveRoom ? (
            <LockedState label="Get a room assigned before subscribing to mess." />
          ) : showMessForm ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <form onSubmit={handleSubscribeMess} className="space-y-4 border border-white/10 bg-white/[0.03] p-5">
                <label className="block text-xs font-black uppercase tracking-[0.22em] text-white/[0.45]">Choose plan</label>
                <select className="input-field p-3 text-sm" value={selectedMessPlan} onChange={(e) => setSelectedMessPlan(e.target.value)} required>
                  {messPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.name} - {money(plan.pricePerMonth)}/mo</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <button type="submit" className="btn-primary py-3 text-xs">Confirm</button>
                  <button type="button" onClick={() => setShowMessForm(false)} className="btn-secondary py-3 text-xs">Cancel</button>
                </div>
              </form>
              <div className="border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.4]">available plans</p>
                <div className="mt-5 space-y-3">
                  {messPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="border border-white/10 p-3">
                      <p className="font-semibold">{plan.name}</p>
                      <p className="mt-1 text-xs text-white/[0.45]">{money(plan.pricePerMonth)}/month</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : myMess ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="relative overflow-hidden border border-white/10 bg-white/[0.03] p-6">
                <div className="absolute right-0 top-0 h-28 w-28 bg-[#53d18a]/10" />
                <p className="text-xs uppercase tracking-[0.22em] text-white/[0.45]">active plan</p>
                <h4 className="mt-4 text-4xl font-black">{myMess.plan.name}</h4>
                <p className="mt-6 inline-flex items-center gap-2 bg-[#53d18a]/15 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#53d18a]">
                  <CheckCircle size={14} /> enrolled
                </p>
                <p className="mt-6 text-sm text-white/[0.45]">Ends: {myMess.endDate ? new Date(myMess.endDate).toLocaleDateString() : 'Until Vacated'}</p>
              </div>
              <div className="grid gap-3">
                <InfoCell label="Monthly Cost" value={money(myMess.plan.pricePerMonth)} />
                <InfoCell label="Plan State" value="Active" />
              </div>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <EmptyState label="No active mess plan." />
              <div className="border border-white/10 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.4]">available plans</p>
                <div className="mt-5 space-y-3">
                  {messPlans.slice(0, 3).map((plan) => (
                    <div key={plan.id} className="border border-white/10 p-3">
                      <p className="font-semibold">{plan.name}</p>
                      <p className="mt-1 text-xs text-white/[0.45]">{money(plan.pricePerMonth)}/month</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <Calendar className="text-[#66e3ff]" size={22} />
            <h3 className="font-display text-2xl font-black">Attendance Pulse</h3>
          </div>
          {!hasActiveRoom ? (
            <LockedState label="Get a room assigned to see attendance records." />
          ) : attendance.length === 0 ? (
            <EmptyState label="No attendance records found yet." />
          ) : (
            <div className="space-y-3">
              {sortedAttendance.slice(0, 6).map((record) => (
                <div key={record.id} className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 ${record.status === 'PRESENT' ? 'bg-[#53d18a]' : 'bg-[#ef5350]'}`} />
                    <div>
                      <p className="font-display text-2xl font-black">{new Date(record.date).toLocaleDateString()}</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-white/[0.42]">attendance record</p>
                    </div>
                  </div>
                  <span className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${
                    record.status === 'PRESENT' ? 'bg-[#53d18a]/15 text-[#53d18a]' : 'bg-rose-400/15 text-rose-300'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {activeView === 'finance' && (
      <section className="space-y-5">
        <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                <CreditCard className="text-[#53d18a]" size={19} />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">finance ledger</span>
              </div>
              <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Resident Billing</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                Bills, payment state, and due-date actions for your room and hostel services.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">unpaid balance</p>
              <p className="font-display text-4xl font-black text-[#f7c948]">{money(unpaidAmount)}</p>
            </div>
          </div>

          {payments.length === 0 ? (
            !hasActiveRoom ? (
              <LockedState label="Get a room assigned to see finances and bills." />
            ) : (
              <EmptyState label="No bills generated yet. Everything is paid." />
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <InfoCell label="Unpaid" value={money(unpaidAmount)} />
              <InfoCell label="Collected" value={money(paidAmount)} />
              <InfoCell label="Overdue Bills" value={overdueCount.toString().padStart(2, '0')} />
            </div>
          )}
        </div>

        {payments.length > 0 && (
          <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/[0.45]">latest bills</p>
              <span className="text-xs text-white/[0.42]">{sortedPayments.length} records</span>
            </div>
            <div className="space-y-3">
              {sortedPayments.map((payment) => (
                <div key={payment.id} className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1.1fr_.7fr_.7fr_auto] lg:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/[0.42]">{payment.type.replace('_', ' ')}</p>
                    <p className="mt-2 font-display text-3xl font-black text-[#d8ff65]">{money(payment.totalAmount || payment.amount)}</p>
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
                  <div className="lg:justify-self-end">
                    {payment.status !== 'PAID' ? (
                      <button onClick={() => handlePayment(payment.id)} className="btn-primary px-5 py-3 text-xs">Pay Now</button>
                    ) : (
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/[0.35]">Settled</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
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

const LockedState = ({ label }: { label: string }) => (
  <div className="grid min-h-36 place-items-center border border-dashed border-white/10 bg-white/[0.025] p-6 text-center">
    <div>
      <Lock className="mx-auto mb-3 text-white/[0.35]" size={24} />
      <p className="text-sm text-white/[0.48]">{label}</p>
    </div>
  </div>
);

const InfoCell = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="border border-white/10 bg-black/20 p-4">
    <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.4]">{label}</p>
    <p className="mt-3 font-display text-2xl font-black">{value}</p>
  </div>
);
