import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../contexts/AuthContext';
import { Building, ChevronDown, ChevronUp, Database, DoorOpen, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

type Block = {
  id: string;
  name: string;
  totalFloors: number;
};

type ResidentAllocation = {
  id: string;
  status: string;
  student: {
    user: {
      name: string;
      email?: string;
    };
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
  pricePerMonth: string;
  block?: {
    name?: string;
  };
  roomAllocations?: ResidentAllocation[];
};

type DashboardResponse<T> = {
  data: {
    data: T;
  };
};

const errorMessage = (error: unknown, fallback: string) => (
  axios.isAxiosError(error) ? error.response?.data?.message || fallback : fallback
);

export const AdminDashboard: React.FC<{ activeView?: 'blocks' | 'rooms' | 'inventory' }> = ({ activeView = 'blocks' }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [blockName, setBlockName] = useState('');
  const [totalFloors, setTotalFloors] = useState(3);

  const [roomNumber, setRoomNumber] = useState('');
  const [blockId, setBlockId] = useState('');
  const [floor, setFloor] = useState(1);
  const [capacity, setCapacity] = useState(2);
  const [type, setType] = useState('DOUBLE');
  const [price, setPrice] = useState(1000);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showInventory, setShowInventory] = useState(true);
  const [filterBlock, setFilterBlock] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  const fetchData = React.useEffectEvent(async () => {
    try {
      const [blocksRes, roomsRes] = await Promise.all([
        api.get('/rooms/blocks').catch(() => ({ data: { data: [] as Block[] } })),
        api.get('/rooms/rooms').catch(() => ({ data: { data: [] as Room[] } })),
      ]) as [
        DashboardResponse<Block[]>,
        DashboardResponse<Room[]>,
      ];

      const blockData = blocksRes.data.data || [];
      const roomData = roomsRes.data.data || [];
      setBlocks(blockData);
      setRooms(roomData);
      if (blockData.length > 0 && !blockId) setBlockId(blockData[0].id);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    try {
      await api.post('/rooms/blocks', { name: blockName, totalFloors });
      setSuccessMsg(`Successfully created Block "${blockName}"`);
      setBlockName('');
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Failed to create block'));
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
        roomNumber,
        blockId,
        floor: Number(floor),
        type,
        capacity: Number(capacity),
        pricePerMonth: Number(price),
      });
      setSuccessMsg(`Successfully created Room "${roomNumber}"`);
      setRoomNumber('');
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Failed to create room'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlock = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete Block "${name}"?\nThis will also delete all rooms inside it. This action cannot be undone.`)) return;
    try {
      await api.delete(`/rooms/blocks/${id}`);
      setSuccessMsg(`Successfully deleted Block "${name}"`);
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Failed to delete block'));
    }
  };

  const handleDeleteRoom = async (id: string, roomNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete Room "${roomNumber}"?`)) return;
    try {
      await api.delete(`/rooms/rooms/${id}`);
      setSuccessMsg(`Successfully deleted Room "${roomNumber}"`);
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Failed to delete room'));
    }
  };

  const handleVacateRoom = async (allocationId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to unallocate ${studentName} from this room?`)) return;
    try {
      await api.post(`/allocations/${allocationId}/vacate`);
      setSuccessMsg(`Successfully unallocated ${studentName}`);
      void fetchData();
    } catch (error) {
      alert(errorMessage(error, 'Failed to unallocate resident'));
    }
  };

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((room) => room.status === 'AVAILABLE').length;
  const occupiedRooms = rooms.filter((room) => room.status === 'OCCUPIED' || room.status === 'FULL').length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalOccupants = rooms.reduce((sum, room) => sum + room.currentOccupancy, 0);

  const filteredRooms = rooms.filter((room) => {
    if (filterBlock !== 'ALL' && room.blockId !== filterBlock) return false;
    if (filterStatus !== 'ALL' && room.status !== filterStatus) return false;
    return true;
  });

  const statusTone = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-[#53d18a]/15 text-[#53d18a]';
      case 'OCCUPIED':
        return 'bg-[#66e3ff]/15 text-[#66e3ff]';
      case 'FULL':
        return 'bg-rose-400/15 text-rose-300';
      case 'UNDER_MAINTENANCE':
        return 'bg-[#f7c948]/15 text-[#f7c948]';
      default:
        return 'bg-white/10 text-white/[0.45]';
    }
  };

  return (
    <div className="space-y-5">
      {successMsg && (
        <div className="border border-[#53d18a]/25 bg-[#53d18a]/10 px-5 py-4 text-sm font-medium text-[#53d18a]" onClick={() => setSuccessMsg(null)}>
          {successMsg}
        </div>
      )}

      {activeView === 'blocks' && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                  <Building className="text-[#ff6b9a]" size={19} />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">block control</span>
                </div>
                <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Hostel Blocks</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                  Create building blocks first, then attach room inventory to the correct structure.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">registered blocks</p>
                <p className="font-display text-4xl font-black text-[#ff6b9a]">{blocks.length.toString().padStart(2, '0')}</p>
              </div>
            </div>

            <form onSubmit={handleCreateBlock} className="grid gap-4 lg:grid-cols-[1fr_180px_auto] lg:items-end">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/[0.45]">Block name</label>
                <input required value={blockName} onChange={(e) => setBlockName(e.target.value)} placeholder="Alpha Tower" className="input-field py-3 text-sm" />
              </div>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/[0.45]">Total floors</label>
                <input type="number" min={1} required value={totalFloors} onChange={(e) => setTotalFloors(Number(e.target.value))} className="input-field py-3 text-sm" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary px-5 py-3 text-xs">
                <Plus size={15} /> Create Block
              </button>
            </form>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {blocks.length === 0 ? (
                <EmptyState label="No blocks registered yet." />
              ) : (
                blocks.map((block) => (
                  <div key={block.id} className="group flex items-start justify-between border border-white/10 bg-white/[0.03] p-4">
                    <div>
                      <p className="font-display text-2xl font-black">{block.name}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/[0.45]">{block.totalFloors} floors</p>
                    </div>
                    <button onClick={() => handleDeleteBlock(block.id, block.name)} className="p-2 text-white/30 opacity-0 transition-colors hover:text-rose-400 group-hover:opacity-100" title="Delete Block">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <InfoCell label="Total Rooms" value={totalRooms.toString().padStart(2, '0')} />
            <InfoCell label="Available" value={availableRooms.toString().padStart(2, '0')} />
            <InfoCell label="Occupancy" value={`${totalOccupants}/${totalCapacity}`} />
          </div>
        </section>
      )}

      {activeView === 'rooms' && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                  <DoorOpen className="text-[#d8ff65]" size={19} />
                  <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">room provisioning</span>
                </div>
                <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Create Rooms</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                  Add room records to a block with floor, type, capacity, and monthly rent.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.45]">provisioned rooms</p>
                <p className="font-display text-4xl font-black text-[#d8ff65]">{totalRooms.toString().padStart(2, '0')}</p>
              </div>
            </div>

            <form onSubmit={handleCreateRoom} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label="Room number">
                <input required value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="101A" className="input-field py-3 text-sm" />
              </Field>
              <Field label="Block">
                <select required value={blockId} onChange={(e) => setBlockId(e.target.value)} className="input-field py-3 text-sm">
                  {blocks.map((block) => <option key={block.id} value={block.id}>{block.name}</option>)}
                </select>
              </Field>
              <Field label={`Floor (Max: ${blocks.find((b) => b.id === blockId)?.totalFloors || 1})`}>
                <input type="number" min={1} max={blocks.find((b) => b.id === blockId)?.totalFloors || 1} required value={floor} onChange={(e) => setFloor(Number(e.target.value))} className="input-field py-3 text-sm" />
              </Field>
              <Field label="Type">
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setCapacity(e.target.value === 'DOUBLE' ? 2 : 1);
                  }}
                  className="input-field py-3 text-sm"
                >
                  <option value="SINGLE">Single</option>
                  <option value="DOUBLE">Double</option>
                </select>
              </Field>
              <Field label="Capacity">
                <input type="number" value={capacity} disabled className="input-field py-3 text-sm opacity-50 cursor-not-allowed border-none bg-white/5" title="Capacity is automatically set by room type" />
              </Field>
              <Field label="Rent / month">
                <input type="number" min={1} required value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input-field py-3 text-sm" />
              </Field>
              <div className="md:col-span-2 xl:col-span-3">
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-xs">
                  <Plus size={15} /> Create Room
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-4">
            <InfoCell label="Available Rooms" value={availableRooms.toString().padStart(2, '0')} />
            <InfoCell label="Occupied / Full" value={occupiedRooms.toString().padStart(2, '0')} />
          </div>
        </section>
      )}

      {activeView === 'inventory' && (
        <section className="border border-white/10 bg-[#10110f]/[0.82] p-5 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="mb-4 inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-4 py-3">
                <Database className="text-[#66e3ff]" size={19} />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-white/[0.5]">inventory graph</span>
              </div>
              <h3 className="font-display text-4xl font-black uppercase sm:text-5xl">Room Inventory</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/[0.55]">
                Filter room state, inspect occupancy, and expand resident assignments when needed.
              </p>
            </div>
            <button onClick={() => setShowInventory(!showInventory)} className="btn-secondary px-4 py-2 text-xs">
              {showInventory ? <EyeOff size={15} /> : <Eye size={15} />}
              {showInventory ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {showInventory && (
            <>
              <div className="mb-5 flex flex-wrap gap-3">
                <select value={filterBlock} onChange={(e) => setFilterBlock(e.target.value)} className="input-field w-auto min-w-[180px] py-3 text-sm">
                  <option value="ALL">All Blocks</option>
                  {blocks.map((block) => <option key={block.id} value={block.id}>{block.name}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto min-w-[200px] py-3 text-sm">
                  <option value="ALL">All Statuses</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="FULL">Full</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                </select>
                <div className="ml-auto self-center text-xs text-white/[0.42]">
                  Showing {filteredRooms.length} of {totalRooms}
                </div>
              </div>

              {filteredRooms.length === 0 ? (
                <EmptyState label="No rooms found for the selected filters." />
              ) : (
                <div className="space-y-3">
                  {filteredRooms.map((room) => (
                    <div key={room.id}>
                      <div className="grid gap-4 border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[.9fr_.9fr_.55fr_.55fr_.85fr_.85fr_auto] lg:items-center">
                        <div>
                          <p className="font-display text-2xl font-black">{room.roomNumber}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/[0.42]">{room.block?.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">occupancy</p>
                          <p className="mt-2 font-display text-2xl font-black">{room.currentOccupancy}/{room.capacity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">floor</p>
                          <p className="mt-2 font-semibold">{room.floor}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">type</p>
                          <p className="mt-2 font-semibold">{room.type}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">rent</p>
                          <p className="mt-2 font-semibold">₹{parseFloat(room.pricePerMonth).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-white/[0.4]">status</p>
                          <span className={`mt-2 inline-flex px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${statusTone(room.status)}`}>
                            {room.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 lg:justify-self-end">
                          <button onClick={() => handleDeleteRoom(room.id, room.roomNumber)} className="p-2 text-white/30 transition-colors hover:text-rose-400" title="Delete Room">
                            <Trash2 size={16} />
                          </button>
                          {room.roomAllocations && room.roomAllocations.length > 0 && (
                            <button onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)} className="btn-secondary px-4 py-2 text-xs">
                              {expandedRoom === room.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                              {expandedRoom === room.id ? 'Hide' : 'Residents'}
                            </button>
                          )}
                        </div>
                      </div>

                      {expandedRoom === room.id && room.roomAllocations && room.roomAllocations.length > 0 && (
                        <div className="mt-2 border border-white/10 bg-black/20 p-4">
                          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/[0.42]">current residents</p>
                          <div className="space-y-3">
                            {room.roomAllocations.map((allocation) => (
                              <div key={allocation.id} className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3">
                                <div>
                                  <p className="font-semibold">{allocation.student.user.name}</p>
                                  <p className="text-xs text-white/[0.45]">{allocation.student.user.email || 'No email'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className={`px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${statusTone(allocation.status === 'OCCUPIED' ? 'OCCUPIED' : 'AVAILABLE')}`}>
                                    {allocation.status}
                                  </span>
                                  <button onClick={() => handleVacateRoom(allocation.id, allocation.student.user.name)} className="text-[10px] font-bold uppercase tracking-widest text-rose-400 hover:text-rose-300">
                                    Unallocate
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/[0.45]">{label}</label>
    {children}
  </div>
);

const InfoCell = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="border border-white/10 bg-black/20 p-4">
    <p className="text-[10px] uppercase tracking-[0.22em] text-white/[0.4]">{label}</p>
    <p className="mt-3 font-display text-2xl font-black">{value}</p>
  </div>
);
