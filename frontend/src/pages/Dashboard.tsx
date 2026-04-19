import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { WardenDashboard } from '../components/dashboards/WardenDashboard';
import { LogOut, Home, User, Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-r border-white/5 bg-bgSecondary/30 lg:min-h-screen flex flex-col pt-8">
        <div className="px-8 pb-8 border-b border-white/5 text-center lg:text-left">
          <h2 className="text-2xl font-display font-semibold mb-1 tracking-tight">SmartHostel</h2>
          <span className="text-xs bg-accentPrimary/20 text-accentPrimary px-3 py-1 rounded-full font-medium inline-block">
            {user?.role} PORTAL
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 flex justify-center lg:block">
           <div className="bg-white/5 text-accentPrimary rounded-xl px-4 py-3 flex items-center gap-3 font-medium transition-colors cursor-pointer w-full max-w-[200px] lg:max-w-none">
             <Home size={20} /> Dashboard
           </div>
           {/* Add Notifications button later */}
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="flex items-center gap-3 px-4 py-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-accentPrimary/20 text-accentPrimary flex items-center justify-center font-bold">
                   {user?.name.charAt(0).toUpperCase()}
               </div>
               <div className="overflow-hidden">
                   <p className="text-sm font-medium truncate">{user?.name}</p>
                   <p className="text-xs text-textSecondary truncate">{user?.email}</p>
               </div>
           </div>
           <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-textSecondary hover:text-error hover:bg-error/10 rounded-lg transition-colors">
              <LogOut size={16} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 relative overflow-y-auto">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accentPrimary/5 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none" />
        
        <header className="mb-10 relative z-10 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-display font-semibold text-white">Welcome back, {user?.name.split(' ')[0]}</h1>
                <p className="text-textSecondary mt-2 text-lg font-light">Here is your infrastructure overview for today.</p>
            </div>
            
            <div className="hidden sm:flex h-12 w-12 rounded-xl bg-white/5 border border-white/10 items-center justify-center text-textSecondary hover:text-white hover:bg-white/10 cursor-pointer transition-all">
               <Bell size={20} />
            </div>
        </header>

        <div className="relative z-10">
            {user?.role === 'STUDENT' && <StudentDashboard />}
            {user?.role === 'WARDEN' && <WardenDashboard />}
            {user?.role === 'ADMIN' && <WardenDashboard />} {/* Admin shares Warden view for demo defaults */}
            {user?.role === 'ACCOUNTANT' && <div className="glass-panel p-12 text-center text-textSecondary italic">Accountant dashboard module is pending.</div>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
