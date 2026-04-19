import React, { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { Database, Plus, Building, Server, ChevronDown, ChevronUp, Users, DoorOpen, BarChart3, Eye, EyeOff } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [blockName, setBlockName] = useState('');
  const [totalFloors, setTotalFloors] = useState<number>(3);
  
  const [roomNumber, setRoomNumber] = useState('');
  const [blockId, setBlockId] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [capacity, setCapacity] = useState<number>(2);
  const [type, setType] = useState('DOUBLE');
  const [price, setPrice] = useState<number>(1000);

  // Data states
  const [blocks, setBlocks] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [showInventory, setShowInventory] = useState(true);
  const [filterBlock, setFilterBlock] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [blocksRes, roomsRes] = await Promise.all([
        api.get('/rooms/blocks').catch(() => ({ data: { data: [] } })),
        api.get('/rooms/rooms').catch(() => ({ data: { data: [] } })),
      ]);
      setBlocks(blocksRes.data.data || []);
      setRooms(roomsRes.data.data || []);
      // Default blockId to first block if available
      const b = blocksRes.data.data || [];
      if (b.length > 0 && !blockId) setBlockId(b[0].id);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    try {
      await api.post('/rooms/blocks', { name: blockName, totalFloors });
      setSuccessMsg(`Successfully created Block "${blockName}"!`);
      setBlockName('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create block');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    try {
      await api.post('/rooms/rooms', { 
        roomNumber, blockId, floor: Number(floor), type, 
        capacity: Number(capacity), pricePerMonth: Number(price) 
      });
      setSuccessMsg(`Successfully created Room "${roomNumber}"!`);
      setRoomNumber('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  // Derived stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED' || r.status === 'FULL').length;
  const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
  const totalOccupants = rooms.reduce((s, r) => s + r.currentOccupancy, 0);

  // Filtered rooms
  const filteredRooms = rooms.filter(r => {
    if (filterBlock !== 'ALL' && r.blockId !== filterBlock) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    return true;
  });

  const statusColor = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-success/20 text-success';
      case 'OCCUPIED': return 'bg-accentPrimary/20 text-accentPrimary';
      case 'FULL': return 'bg-error/20 text-error';
      case 'UNDER_MAINTENANCE': return 'bg-warning/20 text-warning';
      default: return 'bg-white/10 text-textSecondary';
    }
  };

  return (
    <div className="space-y-8">
      {successMsg && (
         <div className="bg-success/10 border border-success/30 text-success px-6 py-4 rounded-xl flex items-center gap-3 font-medium cursor-pointer" onClick={() => setSuccessMsg(null)}>
             <Server size={20} />
             {successMsg}
         </div>
      )}

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 text-center">
          <DoorOpen size={20} className="mx-auto mb-2 text-accentPrimary" />
          <div className="text-2xl font-display font-bold">{totalRooms}</div>
          <div className="text-xs text-textSecondary mt-1">Total Rooms</div>
        </div>
        <div className="glass-panel p-5 text-center">
          <div className="w-5 h-5 rounded-full bg-success/30 mx-auto mb-2 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-success" /></div>
          <div className="text-2xl font-display font-bold text-success">{availableRooms}</div>
          <div className="text-xs text-textSecondary mt-1">Available</div>
        </div>
        <div className="glass-panel p-5 text-center">
          <Users size={20} className="mx-auto mb-2 text-warning" />
          <div className="text-2xl font-display font-bold">{totalOccupants} <span className="text-sm text-textSecondary font-normal">/ {totalCapacity}</span></div>
          <div className="text-xs text-textSecondary mt-1">Occupancy</div>
        </div>
        <div className="glass-panel p-5 text-center">
          <BarChart3 size={20} className="mx-auto mb-2 text-error" />
          <div className="text-2xl font-display font-bold">{occupiedRooms}</div>
          <div className="text-xs text-textSecondary mt-1">Occupied / Full</div>
        </div>
      </div>

      {/* Create Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Block Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <Building className="text-accentPrimary" size={24} /> Register New Block
            </h2>
            <p className="text-sm text-textSecondary mb-6">
                Create a physical building before adding rooms to it.
            </p>
            
            <form onSubmit={handleCreateBlock} className="space-y-4">
                <div>
                   <label className="text-xs text-textSecondary mb-1 block">Block Name</label>
                   <input required value={blockName} onChange={e => setBlockName(e.target.value)} placeholder="e.g. Alpha Tower" className="input-field py-2 text-sm" />
                </div>
                <div>
                   <label className="text-xs text-textSecondary mb-1 block">Total Floors</label>
                   <input type="number" required value={totalFloors} onChange={e => setTotalFloors(Number(e.target.value))} min={1} className="input-field py-2 text-sm" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex justify-center items-center gap-2">
                    <Plus size={16} /> Deploy Block
                </button>
            </form>
        </section>

        {/* Create Room Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <Database className="text-warning" size={24} /> Provision Room
            </h2>
            <p className="text-sm text-textSecondary mb-6">
                Attach a new room to an existing Block.
            </p>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Room Number</label>
                        <input required value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="101A" className="input-field py-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Block</label>
                        <select required value={blockId} onChange={e => setBlockId(e.target.value)} className="input-field py-2 text-sm bg-bgTertiary">
                            {blocks.map(b => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Floor</label>
                        <input type="number" required value={floor} onChange={e => setFloor(Number(e.target.value))} min={1} className="input-field py-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Type</label>
                        <select value={type} onChange={e => { setType(e.target.value); setCapacity(e.target.value === 'DOUBLE' ? 2 : 1); }} className="input-field py-2 text-sm bg-bgTertiary">
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE">Double</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Rent / Mo</label>
                        <input type="number" required value={price} onChange={e => setPrice(Number(e.target.value))} min={1} className="input-field py-2 text-sm" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-warning/20 hover:bg-warning/30 text-warning border border-warning/10 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <Database size={16} /> Mount Room Entity
                </button>
            </form>
        </section>
      </div>

      {/* Room Inventory */}
      <section className="glass-panel p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold flex items-center gap-2">
            <DoorOpen className="text-accentPrimary" size={24} /> Room Inventory
          </h2>
          <button onClick={() => setShowInventory(!showInventory)} className="flex items-center gap-1 text-sm text-textSecondary hover:text-white transition-colors">
            {showInventory ? <EyeOff size={16} /> : <Eye size={16} />}
            {showInventory ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {showInventory && (
          <>
            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select value={filterBlock} onChange={e => setFilterBlock(e.target.value)} className="bg-bgTertiary border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none">
                <option value="ALL">All Blocks</option>
                {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-bgTertiary border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none">
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="FULL">Full</option>
                <option value="UNDER_MAINTENANCE">Under Maintenance</option>
              </select>
              <div className="ml-auto text-xs text-textTertiary self-center">
                Showing {filteredRooms.length} of {totalRooms} rooms
              </div>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="text-center py-12 text-textSecondary bg-white/5 rounded-xl border border-white/5 border-dashed">
                No rooms found. Create blocks and rooms above to populate the inventory.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 text-[11px] uppercase tracking-wider text-textTertiary font-semibold">
                  <div className="col-span-2">Room</div>
                  <div className="col-span-2">Building</div>
                  <div className="col-span-1">Floor</div>
                  <div className="col-span-1">Type</div>
                  <div className="col-span-2">Occupancy</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Rent</div>
                  <div className="col-span-1"></div>
                </div>

                {filteredRooms.map(room => (
                  <div key={room.id}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-bgTertiary rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-colors items-center text-sm">
                      <div className="col-span-2 font-semibold text-white">{room.roomNumber}</div>
                      <div className="col-span-2 text-textSecondary">{room.block?.name || '—'}</div>
                      <div className="col-span-1 text-textSecondary">{room.floor}</div>
                      <div className="col-span-1 text-textSecondary">{room.type}</div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${room.currentOccupancy >= room.capacity ? 'bg-error' : room.currentOccupancy > 0 ? 'bg-accentPrimary' : 'bg-white/10'}`}
                              style={{ width: `${(room.currentOccupancy / room.capacity) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-textSecondary whitespace-nowrap">{room.currentOccupancy}/{room.capacity}</span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${statusColor(room.status)}`}>
                          {room.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="col-span-1 text-textSecondary text-xs">₹{parseFloat(room.pricePerMonth).toLocaleString()}</div>
                      <div className="col-span-1 text-right">
                        {room.roomAllocations?.length > 0 && (
                          <button onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)} className="text-textSecondary hover:text-white transition-colors">
                            {expandedRoom === room.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded occupant details */}
                    {expandedRoom === room.id && room.roomAllocations?.length > 0 && (
                      <div className="ml-4 mr-4 mt-1 mb-2 bg-white/5 rounded-xl p-4 border border-white/5 space-y-2 animate-fade-in-up">
                        <h4 className="text-xs uppercase tracking-wider text-textTertiary font-semibold mb-2">Current Residents</h4>
                        {room.roomAllocations.map((alloc: any) => (
                          <div key={alloc.id} className="flex justify-between items-center text-sm py-1.5 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-accentPrimary/20 text-accentPrimary flex items-center justify-center text-xs font-bold">
                                {alloc.student.user.name.charAt(0)}
                              </div>
                              <div>
                                <span className="text-white font-medium">{alloc.student.user.name}</span>
                                <span className="text-textTertiary text-xs ml-2">{alloc.student.user.email}</span>
                              </div>
                            </div>
                            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${statusColor(alloc.status === 'OCCUPIED' ? 'OCCUPIED' : 'AVAILABLE')}`}>
                              {alloc.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
