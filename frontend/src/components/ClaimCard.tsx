import React, { useState, useEffect } from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_VAULT_ABI } from '../contracts';
import toast from 'react-hot-toast';

interface ClaimCardProps {
  initialRewards: number;
  aprBps: number;
  userStaked: number;
  onClaimSuccess: () => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ initialRewards, aprBps, userStaked, onClaimSuccess }) => {
  const [displayRewards, setDisplayRewards] = useState(initialRewards);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Reset display when initialRewards updates (e.g. after a tx)
  useEffect(() => {
    setDisplayRewards(initialRewards);
  }, [initialRewards]);

  // Client-side ticking
  useEffect(() => {
    if (userStaked <= 0) return;

    const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
    const ratePerSecond = (userStaked * aprBps) / (10000 * SECONDS_PER_YEAR);
    // tick every 100ms for smoothness
    const interval = setInterval(() => {
      setDisplayRewards(prev => prev + (ratePerSecond / 10));
    }, 100);

    return () => clearInterval(interval);
  }, [userStaked, aprBps]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Rewards claimed successfully!', {
        icon: '🎉',
        style: {
          background: '#181b22',
          color: '#D4AF37',
          border: '1px solid rgba(212, 175, 55, 0.3)',
        },
      });
      onClaimSuccess();
    }
  }, [isSuccess, onClaimSuccess]);

  const handleClaim = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.STAKING_VAULT,
      abi: STAKING_VAULT_ABI,
      functionName: 'claimRewards',
    });
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className={`bg-surface-card rounded-2xl p-6 border transition-all duration-500 flex flex-col justify-between h-full
      ${isSuccess ? 'border-brand-gold glow-gold-strong' : 'border-brand-gold/30 glow-gold'}
    `}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-medium text-text-secondary">Pending Rewards</h3>
          <p className="text-xs text-text-secondary mt-1">Live accrual</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
          <Gift size={20} />
        </div>
      </div>

      <div>
        <div className="text-3xl font-bold font-mono text-gradient-gold mb-4">
          {displayRewards.toFixed(6)} RWD
        </div>
        
        <button 
          onClick={handleClaim}
          disabled={isLoading || displayRewards <= 0}
          className="w-full py-3 rounded-xl font-bold text-brand-gold border border-brand-gold hover:bg-brand-gold/10 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
             <><Loader2 size={18} className="animate-spin" /> Claiming...</>
          ) : (
            'Claim Rewards'
          )}
        </button>
      </div>
    </div>
  );
};
