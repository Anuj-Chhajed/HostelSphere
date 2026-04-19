import React, { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { CheckCircle2, Clock, Inbox, AlertTriangle } from 'lucide-react';

export const WardenDashboard: React.FC = () => {
  const [allocations, setAllocations] = useState<any[]>([]);
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [allocRes, compRes] = await Promise.all([
        api.get('/allocations/all').catch(() => ({ data: { data: [] } })),
        api.get('/complaints/all').catch(() => ({ data: { data: [] } }))
      ]);
      const allAlloc = allocRes.data.data;
      
      setAllocations(allAlloc.filter((a: any) => a.status === 'REQUESTED'));
      setActiveStudents(allAlloc.filter((a: any) => a.status === 'OCCUPIED' || a.status === 'APPROVED'));
      setComplaints(compRes.data.data.filter((c: any) => c.status === 'OPEN' || c.status === 'PENDING'));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAttendance = async (studentId: string, status: 'PRESENT' | 'ABSENT') => {
    try {
      await api.post('/attendance/mark', { studentId, status });
      alert(`Marked ${status}`);
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error marking attendance');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/allocations/${id}/status`, { status: 'APPROVED' });
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error approving allocation');
    }
  };

  const handleResolveComplaint = async (id: string) => {
    try {
        await api.patch(`/complaints/${id}/status`, { status: 'RESOLVED' });
        fetchData();
    } catch (e: any) {
        alert(e.response?.data?.message || 'Error updating status');
    }
  };

  if (loading) return <div className="animate-pulse">Loading dashboard elements...</div>;

  return (
    <div className="space-y-8">
      {/* Pending Room Requests */}
      <section className="glass-panel p-8">
        <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-6">
          <Inbox className="text-accentPrimary" size={24} /> Pending Room Approvals
        </h2>
        {allocations.length === 0 ? (
          <div className="bg-white/5 p-8 rounded-xl text-center text-textSecondary border border-white/5 border-dashed">
            All caught up! No pending room requests to process.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allocations.map((alloc) => (
              <div key={alloc.id} className="bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col justify-between">
                 <div>
                    <h4 className="font-semibold text-textPrimary text-lg">{alloc.student.user.name}</h4>
                    <p className="text-sm text-textSecondary mt-1">Requested <span className="font-medium text-white">{alloc.preferredType}</span> Room</p>
                    <p className="text-xs text-textTertiary mt-2 italic">"{alloc.remarks}"</p>
                 </div>
                 <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => handleApprove(alloc.id)}
                      className="flex items-center gap-2 bg-success/20 text-success hover:bg-success hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Attendance Roll Call */}
      <section className="glass-panel p-8 lg:col-span-2">
        <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-6">
          <Clock className="text-success" size={24} /> Daily Attendance Roll Call
        </h2>
        
        {activeStudents.length === 0 ? (
          <div className="bg-white/5 p-8 rounded-xl text-center text-textSecondary border border-white/5 border-dashed">
            No occupied rooms yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStudents.map((alloc) => (
              <div key={alloc.id} className="bg-bgTertiary border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-textPrimary">{alloc.student.user.name}</h4>
                  <p className="text-sm text-textSecondary">{alloc.student.enrollmentNumber}</p>
                  <p className="text-xs mt-2 bg-white/5 inline-block px-2 py-0.5 rounded text-textTertiary">
                     Room {alloc.room?.roomNumber || 'Pending'}
                  </p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleMarkAttendance(alloc.studentId, 'PRESENT')}
                    className="flex-1 py-1.5 px-3 bg-success/20 hover:bg-success/30 text-success text-xs font-semibold rounded transition-colors"
                  >
                    Mark Present
                  </button>
                  <button 
                     onClick={() => handleMarkAttendance(alloc.studentId, 'ABSENT')}
                     className="flex-1 py-1.5 px-3 bg-error/20 hover:bg-error/30 text-error text-xs font-semibold rounded transition-colors"
                  >
                     Mark Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pending Complaints */}
      <section className="glass-panel p-8">
        <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-6">
          <AlertTriangle className="text-warning" size={24} /> Active Complaints
        </h2>
        {complaints.length === 0 ? (
           <div className="bg-white/5 p-8 rounded-xl text-center text-textSecondary border border-white/5 border-dashed">
             No active complaints from students.
           </div>
        ) : (
            <div className="space-y-4">
               {complaints.map((comp) => (
                   <div key={comp.id} className="bg-bgTertiary p-5 rounded-xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <div>
                           <div className="flex items-center gap-3 mb-1">
                               <h4 className="font-semibold">{comp.title}</h4>
                               <span className="bg-white/10 text-xs px-2 py-0.5 rounded text-textSecondary">{comp.category}</span>
                           </div>
                           <p className="text-sm text-textSecondary">{comp.description}</p>
                           <p className="text-xs text-textTertiary mt-2">By {comp.student.user.name} • {new Date(comp.createdAt).toLocaleDateString()}</p>
                       </div>
                       <button 
                         onClick={() => handleResolveComplaint(comp.id)}
                         className="btn-secondary whitespace-nowrap text-sm"
                       >
                         Mark Resolved
                       </button>
                   </div>
               ))}
            </div>
        )}
      </section>
    </div>
  );
};
