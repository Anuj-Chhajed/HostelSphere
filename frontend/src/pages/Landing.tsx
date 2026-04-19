import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Zap, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="bg-bgPrimary text-textPrimary min-h-screen overflow-x-hidden font-sans selection:bg-accentPrimary selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-4 lg:px-12 backdrop-blur-md bg-bgPrimary/60 border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-display font-bold tracking-tight">
                SmartHostel<span className="text-accentPrimary">.</span>
            </div>
            <div className="flex gap-4 items-center">
                <Link to="/login" className="text-textSecondary hover:text-white font-medium transition-colors px-4 py-2">Log In</Link>
                <Link to="/register" className="btn-primary whitespace-nowrap !py-2 !px-5 text-sm">Get Started</Link>
            </div>
        </div>
      </nav>

      <main>
        {/* Cinematic Hero Section */}
        <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 flex flex-col items-center text-center">
            <div className="bg-glow-purple" />
            <div className="bg-glow-emerald opacity-50" />
            
            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center animate-slideUpFade">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-accentPrimary mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentPrimary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accentPrimary"></span>
                    </span>
                    System v1.0 is Live
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-display font-semibold tracking-tight leading-[1.1] mb-6">
                    Elevate Your <br className="hidden sm:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-accentPrimary via-purple-400 to-indigo-400">Hostel Experience.</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-textSecondary max-w-2xl mb-10 leading-relaxed font-light">
                    The all-in-one dynamic operating system for modern campus housing. Seamlessly manage allocations, complaints, payments, and mess plans in a single, beautiful interface.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                    <Link to="/register" className="btn-primary w-full sm:w-auto !px-8 !py-4 text-base">
                        Initiate Setup <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 bg-bgSecondary/30 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-display font-semibold mb-4">Engineered for Scale.</h2>
                    <p className="text-textSecondary text-lg max-w-xl mx-auto">Everything you need to automate your infrastructure, built on a robust clean-architecture foundation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-lg bg-accentPrimary/10 flex items-center justify-center mb-6">
                            <Shield className="text-accentPrimary" size={24} />
                        </div>
                        <h3 className="text-xl font-display font-semibold mb-3">Role-Based Access</h3>
                        <p className="text-textSecondary leading-relaxed text-sm">Dedicated secure dashboards for Admins, Wardens, Accountants, and Students to streamline their unique workflows effortlessly.</p>
                    </div>
                    
                    <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-6">
                            <Zap className="text-warning" size={24} />
                        </div>
                        <h3 className="text-xl font-display font-semibold mb-3">Automated Billing</h3>
                        <p className="text-textSecondary leading-relaxed text-sm">Instant calculation of room fees and dynamic mess plan changes through an intelligent Strategy design pattern.</p>
                    </div>

                    <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-6">
                            <Smartphone className="text-success" size={24} />
                        </div>
                        <h3 className="text-xl font-display font-semibold mb-3">Observer Notifications</h3>
                        <p className="text-textSecondary leading-relaxed text-sm">State-of-the-art observer pipelines keep you automatically updated when a gate pass is logged or complaint is escalated.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-white/5 text-textTertiary text-sm relative z-10">
        <p>© 2026 SmartHostel. Open Architecture. Built with ❤️.</p>
      </footer>
    </div>
  );
};

export default Landing;
