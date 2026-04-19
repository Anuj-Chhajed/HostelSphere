import React, { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';

import { AlertCircle, BedDouble, Plus, Clock, CheckCircle } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [allocation, setAllocation] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [preferredType, setPreferredType] = useState('DOUBLE');
  
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintData, setComplaintData] = useState({ title: '', description: '', category: 'MAINTENANCE' });

  const fetchDashboardData = async () => {
    try {
      const [allocRes, compRes] = await Promise.all([
        api.get('/allocations/me').catch(() => ({ data: { data: [] } })),
        api.get('/complaints/me').catch(() => ({ data: { data: [] } }))
      ]);
      
      const allocList = allocRes.data.data || [];
      // Pick the first allocation if it exists (usually a student just has 1)
      if (Array.isArray(allocList) && allocList.length > 0) {
        setAllocation(allocList[0]);
      } else {
        setAllocation(null);
      }

      setComplaints(compRes.data.data || []);
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
                           <option value="TRIPLE">Triple Room</option>
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
              <div className="bg-success/10 text-success p-4 rounded-xl text-sm">
                Your application has been approved! Report to the warden.
              </div>
            )}
            <div className="flex justify-between items-center">
               <span className="text-textSecondary">Preferred Type</span>
               <span className="font-medium">{allocation.preferredType}</span>
            </div>
          </div>
        )}
      </div>

      {/* Complaints Widget */}
      <div className="glass-panel p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold flex items-center gap-2">
            <AlertCircle className="text-error" size={24} /> My Complaints
          </h2>
          {!showComplaintForm && (
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
                       <option value="CLEANING">Cleaning</option>
                       <option value="ELECTRICAL">Electrical</option>
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
        ) : (
            <>
                {complaints.length === 0 ? (
                <div className="text-center py-8 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
                    No complaints raised. Everything looks good!
                </div>
                ) : (
                <div className="space-y-3">
                    {complaints.slice(0, 3).map((comp: any) => (
                    <div key={comp.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors flex justify-between items-center">
                        <div>
                        <h4 className="font-medium text-textPrimary">{comp.title}</h4>
                        <p className="text-xs text-textSecondary capitalize">{comp.category.toLowerCase()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                        {comp.status === 'PENDING' ? <Clock size={16} className="text-warning" /> : <CheckCircle size={16} className="text-success" />}
                        <span className="text-[10px] text-textTertiary">{new Date(comp.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    ))}
                    {complaints.length > 3 && (
                    <div className="text-center text-xs text-textSecondary pt-2 font-medium cursor-pointer hover:text-white transition-colors">
                        View all {complaints.length} complaints
                    </div>
                    )}
                </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};
