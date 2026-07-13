import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-card border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-brand-gold" size={20} />
              <span className="text-lg font-bold tracking-widest text-brand-gold">AURUM</span>
            </div>
            <p className="text-sm text-text-secondary max-w-sm">
              A secure, fixed-APR yield staking vault. Deposit your assets and watch them grow safely over time.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-white">Product</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-brand-gold transition-colors">Vault</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 text-white">Resources</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">Sepolia Faucet</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">Smart Contract</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} Aurum Protocol. Testnet Only.</p>
          <p className="mt-2 md:mt-0">
            Built for portfolio demonstration. Not real financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};
