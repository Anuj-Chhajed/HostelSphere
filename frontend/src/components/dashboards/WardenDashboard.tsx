import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../contexts/AuthContext';
import { AlertTriangle, DoorOpen, ScanLine, ShieldCheck } from 'lucide-react';
import SystemLoader from '../SystemLoader';

type AllocationStatus = 'REQUESTED' | 'APPROVED' | 'OCCUPIED' | string;
type AttendanceStatus = 'PRESENT' | 'ABSENT';

type AttendanceRecord = {
  id: string;
  date: string;
  status: AttendanceStatus;
};

type StudentAllocation = {
  id: string;
  status: AllocationStatus;
  preferredType?: string;
  remarks?: string;
  student: {
    userId: string;
    enrollmentNumber?: string;
    attendanceRecords?: AttendanceRecord[];
    user: {
      name: string;
      email?: string;
    };
  };
  room?: {
    roomNumber?: string;
  } | null;
};

type Complaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  createdAt?: string;
  student: {
    user: { name: string; email?: string };
    roomAllocations?: { room?: { roomNumber: string } }[];
  };
};

type Room = {
  id: string;
  roomNumber: string;
  blockId: string;
  floor: number;
  type: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
  block?: {
    name?: string;
  };
};

type DashboardResponse<T> = {
  data: {
    data: T;
  };
};

const errorMessage = (error: unknown, fallback: string) => (
  axios.isAxiosError(error) ? error.response?.data?.message || fallback : fallback
);

export const WardenDashboard: React.FC<{ activeView?: 'approvals' | 'attendance' | 'issues' }> = ({ activeView = 'approvals' }) => {
  const [allocations, setAllocations] = useState<StudentAllocation[]>([]);
  const [activeStudents, setActiveStudents] = useState<StudentAllocation[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomOverrides, setSelectedRoomOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [allocRes, compRes, roomsRes] = await Promise.all([
        api.get('/allocations/all').catch(() => ({ data: { data: [] as StudentAllocation[] } })),
        api.get('/complaints/all').catch(() => ({ data: { data: [] as Complaint[] } })),
        api.get('/rooms/rooms').catch(() => ({ data: { data: [] as Room[] } })),
      ]) as [
        DashboardResponse<StudentAllocation[]>,
        DashboardResponse<Complaint[]>,
        DashboardResponse<Room[]>
      ];

      const allAlloc = allocRes.data.data || [];
      const allComplaints = compRes.data.data || [];
      const allRooms = roomsRes.data.data || [];

      setAllocations(allAlloc.filter((allocation) => allocation.status === 'REQUESTED'));
      setActiveStudents(allAlloc.filter((allocation) => allocation.status === 'OCCUPIED' || allocation.status === 'APPROVED'));
      setComplaints(allComplaints.filter((complaint) => ['OPEN', 'ASSIGNED', 'IN_PROGRESS'].includes(complaint.status)));
      setRooms(allRooms);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleMarkAttendance = async (studentUserId: string, status: AttendanceStatus) => {
    try {
      const targetDate = new Date().toLocaleDateString('en-CA');
      await api.post('/attendance/mark', { studentUserId, status, date: targetDate });
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Error marking attendance'));
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const roomId = selectedRoomOverrides[id];
      await api.post(`/allocations/${id}/status`, { status: 'APPROVED', roomId: roomId || undefined });
      
      const newOverrides = { ...selectedRoomOverrides };
      delete newOverrides[id];
      setSelectedRoomOverrides(newOverrides);
      
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Error approving allocation'));
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this room request?')) return;
    try {
      await api.post(`/allocations/${id}/status`, { status: 'REJECTED' });
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Error rejecting allocation'));
    }
  };

  const handleResolveComplaint = async (id: string) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status: 'RESOLVED' });
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Error updating status'));
    }
  };

  if (loading) {
    return (
      <SystemLoader
        variant="panel"
        label="warden systems"
        title="WARDEN"
        detail="Syncing approvals, roll call, and complaint operations"
        accent="#66e3ff"
      />
    );
  }

  return (
    <div className="space-y-5">
      {activeView === 'approvals' && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,.95fr)_minmax(360px,1.05fr)]">
          <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                  <DoorOpen className="text-[#66e3ff]" size={19} />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">allocation queue</span>
                </div>
                <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Room Requests</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                  Approve or reject pending resident room requests with a clear queue view.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">pending approvals</p>
                <p className="font-display text-4xl font-black text-[#66e3ff]">{allocations.length.toString().padStart(2, '0')}</p>
              </div>
            </div>

            {allocations.length === 0 ? (
              <EmptyState label="All caught up. No pending room requests." />
            ) : (
              <div className="space-y-3">
                {allocations.map((allocation) => (
                  <div key={allocation.id} className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1.1fr_.65fr_auto] lg:items-center">
                    <div>
                      <p className="font-display text-2xl font-black">{allocation.student.user.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/[0.45]">
                        {allocation.student.enrollmentNumber || 'Resident'} • {allocation.preferredType || 'Unknown'} request
                      </p>
                      {allocation.remarks && <p className="mt-3 text-sm italic text-white/[0.5]">"{allocation.remarks}"</p>}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">target room type</p>
                      <p className="mt-2 font-display text-2xl font-black">{allocation.preferredType || '—'}</p>
                    </div>
                    <div className="grid gap-2 lg:min-w-[180px]">
                      <select 
                        value={selectedRoomOverrides[allocation.id] || ''} 
                        onChange={(e) => setSelectedRoomOverrides({ ...selectedRoomOverrides, [allocation.id]: e.target.value })}
                        className="input-field py-2 text-xs"
                      >
                        <option value="">Auto-Assign Room</option>
                        {rooms
                          .filter(r => r.type === allocation.preferredType && r.currentOccupancy < r.capacity)
                          .map(r => (
                            <option key={r.id} value={r.id}>
                              {r.block?.name || 'Block'} - {r.roomNumber} ({r.currentOccupancy}/{r.capacity})
                            </option>
                          ))
                        }
                      </select>
                      <button onClick={() => handleApprove(allocation.id)} className="btn-primary py-3 text-xs">Approve</button>
                      <button onClick={() => handleReject(allocation.id)} className="border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-rose-200">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <ShieldCheck className="text-[#d8ff65]" size={22} />
              <h3 className="font-display text-2xl font-black">Occupancy Signal</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <InfoCell label="Active Residents" value={activeStudents.length.toString().padStart(2, '0')} />
              <InfoCell label="Pending Queue" value={allocations.length.toString().padStart(2, '0')} />
              <InfoCell label="Open Issues" value={complaints.length.toString().padStart(2, '0')} />
            </div>
            <div className="mt-5 border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/[0.45]">current lane</p>
              <p className="mt-4 text-sm leading-relaxed text-white/[0.6]">
                Use this module to clear pending room approvals before moving to roll call or issue handling.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeView === 'attendance' && (
        <section className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                <ScanLine className="text-[#d8ff65]" size={19} />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">roll call lane</span>
              </div>
              <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Daily Attendance</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                Mark present or absent, and correct today’s records without leaving the operational view.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">students to review</p>
              <p className="font-display text-4xl font-black text-[#d8ff65]">{activeStudents.length.toString().padStart(2, '0')}</p>
            </div>
          </div>

          {activeStudents.length === 0 ? (
            <EmptyState label="No occupied or approved residents yet." />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {activeStudents.map((allocation) => {
                const todayStr = new Date().toLocaleDateString('en-CA');
                const todaysRecord = allocation.student.attendanceRecords?.find(
                  (record) => new Date(record.date).toLocaleDateString('en-CA') === todayStr,
                );

                return (
                  <div key={allocation.id} className="border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-2xl font-black">{allocation.student.user.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/[0.45]">
                          {allocation.student.enrollmentNumber || 'Resident'} • Room {allocation.room?.roomNumber || 'Pending'}
                        </p>
                      </div>
                      {todaysRecord && (
                        <span className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${
                          todaysRecord.status === 'PRESENT' ? 'bg-[#53d18a]/15 text-[#53d18a]' : 'bg-rose-400/15 text-rose-300'
                        }`}>
                          {todaysRecord.status}
                        </span>
                      )}
                    </div>

                    {todaysRecord ? (
                      <div className="mt-5 border border-white/10 bg-black/20 p-4">
                        <p className="text-sm text-white/[0.58]">
                          Already marked today. Switch only if the original record was wrong.
                        </p>
                        <button
                          onClick={() => handleMarkAttendance(allocation.student.userId, todaysRecord.status === 'PRESENT' ? 'ABSENT' : 'PRESENT')}
                          className="btn-secondary mt-4 w-full py-3 text-xs"
                        >
                          Switch to {todaysRecord.status === 'PRESENT' ? 'Absent' : 'Present'}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <button onClick={() => handleMarkAttendance(allocation.student.userId, 'PRESENT')} className="btn-primary py-3 text-xs">
                          Mark Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(allocation.student.userId, 'ABSENT')}
                          className="border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-rose-200"
                        >
                          Mark Absent
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {activeView === 'issues' && (
        <section className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                <AlertTriangle className="text-[#f7c948]" size={19} />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">complaint lane</span>
              </div>
              <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Active Issues</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                Resolve student complaint backlog with clearer status and ownership context.
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">open tickets</p>
              <p className="font-display text-4xl font-black text-[#f7c948]">{complaints.length.toString().padStart(2, '0')}</p>
            </div>
          </div>

          {complaints.length === 0 ? (
            <EmptyState label="No active complaints from residents." />
          ) : (
            <div className="space-y-3">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1.15fr_.75fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-display text-2xl font-black">{complaint.title}</p>
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/[0.45] border border-white/10">
                        {complaint.category}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-white/[0.58]">{complaint.description}</p>
                    <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-white/[0.42]">
                      {complaint.student.user.name} • {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">status</p>
                    <p className="mt-2 font-display text-2xl font-black">{complaint.status.replace('_', ' ')}</p>
                  </div>
                  <div className="lg:justify-self-end">
                    <button onClick={() => handleResolveComplaint(complaint.id)} className="btn-primary px-5 py-3 text-xs">
                      Mark Resolved
                    </button>
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
