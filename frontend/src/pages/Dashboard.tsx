import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { WardenDashboard } from '../components/dashboards/WardenDashboard';
import { AccountantDashboard } from '../components/dashboards/AccountantDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { LogOut, User, Bell, LayoutDashboard, Database, Building, Mail } from 'lucide-react';
import { api } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = React.useState(false);

  // Fetch when opening dropdown
  React.useEffect(() => {
     if (showNotifications) {
         setLoadingNotifications(true);
         api.get('/notifications/me')
            .then(res => setNotifications(res.data.data))
            .catch(e => console.error(e))
            .finally(() => setLoadingNotifications(false));
     }
  }, [showNotifications]);

  const markAsRead = async (id: string) => {
     await api.patch(`/notifications/${id}/read`).catch(() => {});
     setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-r border-white/5 bg-bgSecondary/30 lg:min-h-screen flex flex-col pt-8">
        <div className="px-8 pb-8 border-b border-white/5 text-center lg:text-left">
          <h2 className="text-2xl font-display font-semibold mb-1 tracking-tight">HostelSphere</h2>
          <span className="text-xs bg-accentPrimary/20 text-accentPrimary px-3 py-1 rounded-full font-medium inline-block flex items-center gap-1 justify-center lg:justify-start max-w-fit mx-auto lg:mx-0">
             <div className="w-1.5 h-1.5 rounded-full bg-accentPrimary animate-pulse" />
            {user?.role} PORTAL
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 flex justify-center lg:block">
           <div className="bg-white/5 text-accentPrimary rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition-colors cursor-pointer w-full mx-auto lg:max-w-none">
             <LayoutDashboard size={20} /> System Overview
           </div>
           
           <div className="text-textSecondary hover:bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition-colors cursor-pointer w-full mx-auto lg:max-w-none">
             <User size={20} /> My Profile
           </div>

           {user?.role === 'ADMIN' && (
             <div className="text-textSecondary hover:bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition-colors cursor-pointer w-full mx-auto lg:max-w-none">
               <Database size={20} /> Architecture Log
             </div>
           )}
        </nav>

        {/* Global Pipeline Hint */}
        <div className="hidden lg:block px-6 py-6 border-t border-white/5">
             <div className="bg-bgTertiary text-white/40 p-4 rounded-xl text-xs font-mono leading-relaxed border border-white/5 shadow-inner">
                 <span className="font-semibold text-white/70 block mb-2 opacity-80 uppercase tracking-widest text-[10px]"><Building className="inline -mt-1 mr-1" size={12}/> Unified Pipeline Flow</span>
                 Admin generates Rooms → Student Requests Room → Warden Approves Room → Accountant Bills Account. Active system logic enforced.
             </div>
        </div>

        <div className="p-4 border-t border-white/5">
           <div className="flex items-center gap-3 px-4 py-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-accentPrimary/20 text-accentPrimary border border-accentPrimary/30 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                   {user?.name.charAt(0).toUpperCase()}
               </div>
               <div className="overflow-hidden">
                   <p className="text-sm font-medium text-white truncate drop-shadow-sm">{user?.name}</p>
                   <p className="text-xs text-textSecondary truncate">{user?.email}</p>
               </div>
           </div>
           <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-error/80 bg-error/5 hover:bg-error/10 hover:text-error border border-error/10 rounded-xl transition-all shadow-sm">
              <LogOut size={16} /> Secure Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 relative overflow-y-auto">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accentPrimary/5 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />
        
        <header className="mb-10 relative z-50 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-display font-semibold text-white tracking-tight">Welcome to the Matrix, {user?.name.split(' ')[0]}</h1>
                <p className="text-textSecondary mt-2 text-lg font-light">Your central nervous system for operations.</p>
            </div>
            
            <div className="relative">
                <div onClick={() => setShowNotifications(!showNotifications)} className={`hidden sm:flex h-12 w-12 rounded-xl border border-white/10 items-center justify-center text-textSecondary hover:text-white hover:bg-white/10 hover:scale-105 cursor-pointer transition-all shadow-sm relative group ${showNotifications ? 'bg-white/10 text-white' : 'bg-white/5'}`}>
                <Bell size={20} className={notifications.some(n => !n.isRead) ? "animate-swing text-white" : ""} />
                
                {/* Red dot if unread exists, default pulse for demo if empty */}
                <div className={`absolute top-3 right-3 w-2 h-2 ${notifications.some(n => !n.isRead) ? 'bg-error' : 'bg-white/20'} rounded-full animate-pulse blur-[1px]`}></div>
                <div className={`absolute top-3 right-3 w-2 h-2 ${notifications.some(n => !n.isRead) ? 'bg-error' : 'bg-white/20'} rounded-full`}></div>
                </div>

                {/* Dropdown Panel */}
                {showNotifications && (
                    <div className="absolute right-0 top-14 w-80 bg-bgSecondary border border-white/10 shadow-2xl rounded-2xl p-4 z-50 animate-fade-in-up">
                       <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                           <Mail size={16} className="text-accentPrimary" /> System Updates
                       </h3>
                       {loadingNotifications ? (
                           <div className="text-center text-textSecondary py-4 animate-pulse text-sm">Intercepting feed...</div>
                       ) : notifications.length === 0 ? (
                           <div className="text-center text-textSecondary py-6 bg-white/5 rounded-xl border border-white/5 border-dashed text-sm">
                               Inbox is clear.
                           </div>
                       ) : (
                           <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                               {notifications.map(n => (
                                   <div key={n.id} className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${n.isRead ? 'bg-white/5 border-white/5 opacity-70' : 'bg-white/10 border-white/20 border-l-2 border-l-accentPrimary hover:bg-white/15'}`} onClick={() => markAsRead(n.id)}>
                                       <div className="flex justify-between items-start mb-1">
                                           <h4 className={`text-sm ${n.isRead ? 'text-textSecondary' : 'text-white font-medium'}`}>{n.title}</h4>
                                           <span className="text-[10px] text-textTertiary">{new Date(n.createdAt).toLocaleDateString()}</span>
                                       </div>
                                       <p className="text-xs text-textSecondary line-clamp-2">{n.message}</p>
                                       {!n.isRead && <div className="mt-2 text-[10px] text-accentPrimary font-medium flex justify-end">Click to mark read</div>}
                                   </div>
                               ))}
                           </div>
                       )}
                    </div>
                )}
            </div>
        </header>

        <div className="relative z-10 animate-fade-in-up">
            {user?.role === 'STUDENT' && <StudentDashboard />}
            {user?.role === 'WARDEN' && <WardenDashboard />}
            {user?.role === 'ADMIN' && <AdminDashboard />}
            {user?.role === 'ACCOUNTANT' && <AccountantDashboard />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
