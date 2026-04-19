import React, { useState } from 'react';
import { api } from '../../contexts/AuthContext';
import { Database, Plus, Building, UserPlus, Server } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [blockName, setBlockName] = useState('');
  const [totalFloors, setTotalFloors] = useState<number>(3);
  
  const [roomId, setRoomId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [capacity, setCapacity] = useState<number>(2);
  const [type, setType] = useState('DOUBLE');
  const [price, setPrice] = useState<number>(1000);

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    try {
      await api.post('/rooms/blocks', { name: blockName, totalFloors });
      setSuccessMsg(`Successfully created Block ${blockName}!`);
      setBlockName('');
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
        roomNumber: roomId, 
        blockId, 
        floor: 1, 
        type, 
        capacity: Number(capacity), 
        pricePerMonth: Number(price) 
      });
      setSuccessMsg(`Successfully created Room ${roomId}!`);
      setRoomId('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Create Block Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <Building className="text-accentPrimary" size={24} /> Register New Block
            </h2>
            <p className="text-sm text-textSecondary mb-6">
                Create a physical building in the database before you add rooms.
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
                    <Plus size={16} /> Deploy Block to Database
                </button>
            </form>
        </section>

        {/* Create Room Widget */}
        <section className="glass-panel p-8">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2 mb-2">
                <Database className="text-warning" size={24} /> Provision Room
            </h2>
            <p className="text-sm text-textSecondary mb-6">
                Attach a new room to an existing Block using its exact Database UUID.
            </p>
            
            <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Room Number</label>
                        <input required value={roomId} onChange={e => setRoomId(e.target.value)} placeholder="101A" className="input-field py-2 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Parent Block UUID</label>
                        <input required value={blockId} onChange={e => setBlockId(e.target.value)} placeholder="block-uuid..." className="input-field py-2 text-sm text-xs" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="input-field py-2 text-sm bg-bgTertiary">
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE">Double</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-textSecondary mb-1 block">Rent Price / Mo</label>
                        <input type="number" required value={price} onChange={e => setPrice(Number(e.target.value))} min={1} className="input-field py-2 text-sm" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-warning/20 hover:bg-warning/30 text-warning border border-warning/10 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <Database size={16} /> Mount Room Entity
                </button>
            </form>
        </section>

      </div>
    </div>
  );
};
