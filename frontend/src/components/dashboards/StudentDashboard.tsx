import React, { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';

import { AlertCircle, BedDouble, Plus, Clock, CheckCircle, CreditCard, Utensils, Calendar, Lock, Trash2 } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [allocation, setAllocation] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [messPlans, setMessPlans] = useState<any[]>([]);
  const [myMess, setMyMess] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
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
        api.get('/allocations/me').catch(() => ({ data: { data: [] } })),
        api.get('/complaints/me').catch(() => ({ data: { data: [] } })),
        api.get('/payments/me').catch(() => ({ data: { data: [] } })),
        api.get('/mess/plans').catch(() => ({ data: { data: [] } })),
        api.get('/mess/subscriptions/me').catch(() => ({ data: { data: null } })),
        api.get('/attendance/me').catch(() => ({ data: { data: [] } }))
      ]);
      
      const allocList = allocRes.data.data || [];
      if (Array.isArray(allocList) && allocList.length > 0) {
        setAllocation(allocList[0]);
      } else {
        setAllocation(null);
      }

      setComplaints(compRes.data.data || []);
      setPayments(payRes.data.data || []);
      
      const parsedPlans = plansRes.data.data || [];
      setMessPlans(parsedPlans);
      if (parsedPlans.length > 0) setSelectedMessPlan(parsedPlans[0].id);

      setMyMess(myMessRes.data.data);
      setAttendance(attRes.data.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApplyRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/allocations/request', {
        preferredType,
        remarks: 'Frontend request for a ' + preferredType + ' room'
      });
      setShowRoomForm(false);
      fetchDashboardData(); // Refresh UI
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error applying for room');
    }
  };

  const handleRaiseComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/complaints', complaintData);
      setShowComplaintForm(false);
      setComplaintData({ title: '', description: '', category: 'MAINTENANCE' });
      fetchDashboardData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error raising complaint');
    }
  };

  const handlePayment = async (id: string) => {
    try {
      await api.post(`/payments/${id}/pay`, { method: 'CARD' });
      fetchDashboardData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error processing payment');
    }
  };

  const handleOccupyRoom = async (allocationId: string) => {
    try {
      await api.post(`/allocations/${allocationId}/occupy`);
      fetchDashboardData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error marking room as occupied');
    }
  };

  const handleSubscribeMess = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/mess/subscriptions', { planId: selectedMessPlan });
      setShowMessForm(false);
      fetchDashboardData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error subscribing to mess plan');
    }
  };

  const handleWithdrawAllocation = async (id: string) => {
    if (!confirm('Are you sure you want to withdraw your room application?')) return;
    try {
      await api.delete(`/allocations/${id}`);
      fetchDashboardData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error withdrawing application');
    }
  };

  const handleWithdrawComplaint = async (id: string) => {
    if (!confirm('Are you sure you want to take back this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      fetchDashboardData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error taking back complaint');
    }
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm('Delete this resolved complaint from your history?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      fetchDashboardData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error deleting complaint');
    }
  };

  // Derived state: does the student have an active room?
  const hasActiveRoom = allocation && (allocation.status === 'APPROVED' || allocation.status === 'OCCUPIED');

  if (loading) return <div className="animate-pulse">Loading modules...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {/* Allocation Widget */}
      <div className="glass-panel p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold flex items-center gap-2">
            <BedDouble className="text-accentPrimary" size={24} /> My Room
          </h2>
        </div>

        {!allocation ? (
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 border-dashed">
            {showRoomForm ? (
                <form onSubmit={handleApplyRoom} className="space-y-4">
                   <div className="space-y-2">
                       <label className="text-sm font-medium text-textSecondary">Preferred Room Type</label>
                       <select value={preferredType} onChange={(e) => setPreferredType(e.target.value)} className="input-field bg-bgTertiary text-sm">
                           <option value="SINGLE">Single Room</option>
                           <option value="DOUBLE">Double Room</option>
                       </select>
                   </div>
                   <div className="flex gap-2">
                       <button type="submit" className="btn-primary py-2 px-4 text-sm w-full">Submit</button>
                       <button type="button" onClick={() => setShowRoomForm(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                   </div>
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-textSecondary mb-4">You have not been assigned a room yet.</p>
                    <button className="btn-primary w-full" onClick={() => setShowRoomForm(true)}>
                    Apply for Room <Plus size={18} />
                    </button>
                </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <span className="text-textSecondary">Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${allocation.status === 'APPROVED' || allocation.status === 'OCCUPIED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                {allocation.status}
              </span>
            </div>
            {allocation.status === 'APPROVED' && (
              <div className="bg-success/10 border border-success/30 text-success p-4 rounded-xl text-sm flex flex-col gap-3">
                <p>Your application has been approved! Report to the warden and confirm your move-in below.</p>
                <button 
                  onClick={() => handleOccupyRoom(allocation.id)}
                  className="btn-primary py-2 self-start text-xs font-semibold"
                >
                  Confirm Move-In
                </button>
              </div>
            )}
            
            {/* Room Details — only show when a room has been assigned */}
            {allocation.room ? (
              <div className="bg-bgTertiary rounded-xl p-5 border border-white/5 space-y-3">
                <h4 className="text-sm font-semibold text-white mb-3">Assigned Room Details</h4>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-textSecondary">Building</span>
                   <span className="font-medium text-accentPrimary">{allocation.room.block?.name || '—'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-textSecondary">Room Number</span>
                   <span className="font-medium">{allocation.room.roomNumber}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-textSecondary">Floor</span>
                   <span className="font-medium">{allocation.room.floor}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-textSecondary">Room Type</span>
                   <span className="font-medium">{allocation.room.type}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-textSecondary">Capacity</span>
                   <span className="font-medium">{allocation.room.currentOccupancy} / {allocation.room.capacity}</span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                 <span className="text-textSecondary">Preferred Type</span>
                 <span className="font-medium">{allocation.preferredType}</span>
              </div>
            )}
            
            {allocation.status === 'REQUESTED' && (
              <div className="text-right pt-2">
                 <button onClick={() => handleWithdrawAllocation(allocation.id)} className="text-xs text-error font-medium hover:underline transition-all">Withdraw Application</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complaints Widget */}
      <div className="glass-panel p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold flex items-center gap-2">
            <AlertCircle className="text-error" size={24} /> My Complaints
          </h2>
          {!showComplaintForm && hasActiveRoom && (
            <button onClick={() => setShowComplaintForm(true)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm border border-white/10 transition-colors">
                Raise Issue
            </button>
          )}
        </div>

        {showComplaintForm ? (
            <form onSubmit={handleRaiseComplaint} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <div>
                   <label className="text-xs text-textSecondary mb-1 block">Title</label>
                   <input type="text" required value={complaintData.title} onChange={e => setComplaintData({...complaintData, title: e.target.value})} className="input-field py-2 text-sm" placeholder="Water leak..." />
                </div>
                <div>
                   <label className="text-xs text-textSecondary mb-1 block">Category</label>
                   <select value={complaintData.category} onChange={e => setComplaintData({...complaintData, category: e.target.value})} className="input-field py-2 bg-bgTertiary text-sm">
                       <option value="MAINTENANCE">Maintenance</option>
                       <option value="HYGIENE">Hygiene</option>
                       <option value="ELECTRICAL">Electrical</option>
                       <option value="PLUMBING">Plumbing</option>
                       <option value="NOISE">Noise</option>
                       <option value="OTHER">Other</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs text-textSecondary mb-1 block">Description</label>
                   <textarea required rows={2} value={complaintData.description} onChange={e => setComplaintData({...complaintData, description: e.target.value})} className="input-field py-2 text-sm" placeholder="Please describe the issue..." />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 btn-primary py-2 text-sm">Submit Issue</button>
                    <button type="button" onClick={() => setShowComplaintForm(false)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                </div>
            </form>
        ) : !hasActiveRoom ? (
            <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
                <Lock size={24} className="mx-auto mb-3 text-textTertiary" />
                <p className="text-sm">Get a room assigned first before raising complaints.</p>
            </div>
        ) : (
            <>
                {complaints.length === 0 ? (
                <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
                    No complaints raised. Everything looks good!
                </div>
                ) : (
                <div className="space-y-3">
                     {complaints.slice(0, showAllComplaints ? undefined : 3).map((comp: any) => (
                    <div key={comp.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors flex justify-between items-start">
                        <div>
                        <h4 className="font-medium text-textPrimary">{comp.title}</h4>
                        <p className="text-xs text-textSecondary capitalize">{comp.category.toLowerCase()}</p>
                        
                        {/* Details pane */}
                        <p className="text-xs text-textTertiary mt-2 max-w-[200px] italic">"{comp.description}"</p>
                        
                        {comp.status === 'OPEN' && (
                            <button onClick={() => handleWithdrawComplaint(comp.id)} className="block mt-3 text-[10px] text-error hover:text-error hover:underline transition-all font-medium">Take Back / Withdraw</button>
                        )}
                        {(comp.status === 'RESOLVED' || comp.status === 'CLOSED') && (
                            <button onClick={() => handleDeleteComplaint(comp.id)} className="block mt-3 text-[10px] text-textSecondary hover:text-error hover:underline transition-all font-medium flex items-center gap-1"><Trash2 size={10} /> Remove from history</button>
                        )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                        {comp.status === 'RESOLVED' || comp.status === 'CLOSED' ? <CheckCircle size={16} className="text-success" /> : <Clock size={16} className="text-warning" />}
                        <span className="text-[10px] text-textTertiary">{new Date(comp.createdAt).toLocaleDateString()}</span>
                        <span className="text-[10px] text-white/50 mt-1 uppercase font-semibold">{comp.status.replace('_', ' ')}</span>
                        </div>
                    </div>
                    ))}
                    {complaints.length > 3 && !showAllComplaints && (
                    <div 
                        className="text-center text-xs text-textSecondary pt-2 font-medium cursor-pointer hover:text-white transition-colors"
                        onClick={() => setShowAllComplaints(true)}
                    >
                        View all {complaints.length} complaints
                    </div>
                    )}
                    {showAllComplaints && complaints.length > 3 && (
                    <div 
                        className="text-center text-xs text-textSecondary pt-2 font-medium cursor-pointer hover:text-white transition-colors"
                        onClick={() => setShowAllComplaints(false)}
                    >
                        Collapse complaints
                    </div>
                    )}
                </div>
                )}
            </>
        )}
      </div>
      {/* Mess Subscription Widget */}
      <div className="glass-panel p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold flex items-center gap-2">
             <Utensils className="text-accentPrimary" size={24} /> Mess Subscription
          </h2>
          {!showMessForm && !myMess && hasActiveRoom && (
            <button onClick={() => setShowMessForm(true)} className="btn-secondary py-1.5 px-4 text-sm flex items-center gap-1">
              <Plus size={16} /> Opt-In
            </button>
          )}
        </div>

        {showMessForm ? (
          <form onSubmit={handleSubscribeMess} className="bg-white/5 rounded-xl border border-white/10 p-5 space-y-4">
            <h3 className="font-semibold text-white">Select a Meal Plan</h3>
            <div>
              <label className="block text-sm text-textSecondary mb-1">Plan Configuration</label>
              <select 
                 className="w-full bg-bgTertiary border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-accentPrimary transition-all outline-none"
                 value={selectedMessPlan}
                 onChange={(e) => setSelectedMessPlan(e.target.value)}
                 required
              >
                 {messPlans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - ${parseFloat(p.pricePerMonth).toFixed(2)}/mo</option>
                 ))}
              </select>
            </div>
            
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setShowMessForm(false)} className="px-4 py-2 text-sm text-textSecondary hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-primary py-2 px-6 text-sm">
                Confirm Subscription
              </button>
            </div>
          </form>
        ) : myMess ? (
           <div className="bg-bgTertiary rounded-xl border border-white/5 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-bl-full pointer-events-none" />
             <p className="text-sm text-textSecondary mb-1">Active Plan</p>
             <h4 className="text-xl font-semibold text-white mb-2">{myMess.plan.name}</h4>
             <span className="inline-flex items-center gap-1 bg-success/20 text-success px-3 py-1 rounded-full text-xs font-semibold">
                <CheckCircle size={14} /> ENROLLED & ACTIVE
             </span>
             <p className="text-xs text-textSecondary mt-4">Ends: {myMess.endDate ? new Date(myMess.endDate).toLocaleDateString() : 'Until Vacated'}</p>
           </div>
        ) : !hasActiveRoom ? (
            <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
              <Lock size={24} className="mx-auto mb-3 text-textTertiary" />
              <p className="text-sm">Get a room assigned first before subscribing to a mess plan.</p>
            </div>
        ) : (
           <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
             No active mess plan. Opt-in above.
           </div>
        )}
      </div>

      {/* Attendance Tracker Widget */}
      <div className="glass-panel p-8">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-display font-semibold flex items-center gap-2">
              <Calendar className="text-accentPrimary" size={24} /> Attendance
           </h2>
         </div>
         {!hasActiveRoom ? (
             <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
               <Lock size={24} className="mx-auto mb-3 text-textTertiary" />
               <p className="text-sm">Get a room assigned first to see your attendance records.</p>
             </div>
         ) : attendance.length === 0 ? (
           <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
             No attendance records found yet.
           </div>
         ) : (
           <div className="space-y-3">
             {attendance.slice(0, 4).map((att) => (
                <div key={att.id} className="bg-bgTertiary px-4 py-3 rounded-lg border border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${att.status === 'PRESENT' ? 'bg-success' : 'bg-error'}`} />
                      <span className="font-medium text-sm">{new Date(att.date).toLocaleDateString()}</span>
                   </div>
                   <span className="text-xs text-textSecondary">{att.status}</span>
                </div>
             ))}
             {attendance.length > 4 && <div className="text-center text-xs text-textTertiary pt-2">View full log in portal</div>}
           </div>
         )}
      </div>

      {/* Finances Widget */}
      <div className="glass-panel p-8 lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold flex items-center gap-2">
            <CreditCard className="text-success" size={24} /> My Finances
          </h2>
        </div>
        
        {!hasActiveRoom ? (
             <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
               <Lock size={24} className="mx-auto mb-3 text-textTertiary" />
               <p className="text-sm">Get a room assigned first to see your finances and bills.</p>
             </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
            No bills generated yet. Everything is paid!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payments.map((pay: any) => (
              <div key={pay.id} className="bg-bgTertiary rounded-xl p-5 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-textPrimary">{pay.type.replace('_', ' ')}</h4>
                  </div>
                  <div className="text-3xl font-display font-bold text-accentPrimary mb-1">
                    ${parseFloat(pay.amount).toFixed(2)}
                  </div>
                  <p className="text-xs text-textSecondary mb-4">
                    Generated: {new Date(pay.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${pay.status === 'PAID' ? 'bg-success/20 text-success' : pay.status === 'OVERDUE' ? 'bg-error/20 text-error' : 'bg-warning/20 text-warning'}`}>
                    {pay.status}
                  </span>
                  
                  {pay.status !== 'PAID' && (
                    <button onClick={() => handlePayment(pay.id)} className="btn-secondary py-1.5 px-4 text-sm whitespace-nowrap">
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
