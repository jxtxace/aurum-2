import React, { useState } from 'react';
import { Shield, LayoutDashboard, History, FileText, Menu, X } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Vault', icon: <LayoutDashboard size={20} />, active: true },
    { name: 'My Activity', icon: <History size={20} /> },
    { name: 'Docs', icon: <FileText size={20} /> },
  ];

  return (
    <>
      {/* Mobile Hamburger */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface-card rounded-md border border-surface-border text-brand-gold"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-surface-card border-r border-surface-border
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center text-surface-bg glow-gold">
            <Shield size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-brand-gold">AURUM</h1>
            <p className="text-xs text-text-secondary">Yield Staking Vault</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:scale-[0.97]
                ${item.active 
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold-glow' 
                  : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between px-4 py-2 bg-black/20 rounded-md border border-surface-border">
            <span className="text-xs text-text-secondary">Network</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-xs font-medium text-brand-gold">Sepolia</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <span>GitHub</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
