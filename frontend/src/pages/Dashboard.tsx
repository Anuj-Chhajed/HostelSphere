import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { WardenDashboard } from '../components/dashboards/WardenDashboard';
import { AccountantDashboard } from '../components/dashboards/AccountantDashboard';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { LogOut, Home, User, Bell, LayoutDashboard, Database, Building } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-r border-white/5 bg-bgSecondary/30 lg:min-h-screen flex flex-col pt-8">
        <div className="px-8 pb-8 border-b border-white/5 text-center lg:text-left">
          <h2 className="text-2xl font-display font-semibold mb-1 tracking-tight">SmartHostel</h2>
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
        
        <header className="mb-10 relative z-10 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-display font-semibold text-white tracking-tight">Welcome to the Matrix, {user?.name.split(' ')[0]}</h1>
                <p className="text-textSecondary mt-2 text-lg font-light">Your central nervous system for operations.</p>
            </div>
            
            <div className="hidden sm:flex h-12 w-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center text-textSecondary hover:text-white hover:bg-white/10 hover:scale-105 cursor-pointer transition-all shadow-sm relative group">
               <Bell size={20} className="group-hover:animate-swing" />
               <div className="absolute top-3 right-3 w-2 h-2 bg-error rounded-full animate-pulse blur-[1px]"></div>
               <div className="absolute top-3 right-3 w-2 h-2 bg-error rounded-full"></div>
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
