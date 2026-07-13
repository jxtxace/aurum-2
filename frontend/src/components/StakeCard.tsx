import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowRight, Loader2 } from 'lucide-react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, STAKING_VAULT_ABI, ERC20_ABI } from '../contracts';
import toast from 'react-hot-toast';

interface StakeCardProps {
  userStaked: number;
  onTxSuccess: () => void;
}

export const StakeCard: React.FC<StakeCardProps> = ({ userStaked, onTxSuccess }) => {
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();

  // STK Balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.STAKE_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.STAKE_TOKEN,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.STAKING_VAULT] : undefined,
  });

  const stkBalance = balanceData ? Number(formatUnits(balanceData, 18)) : 0;
  const currentAllowance = allowanceData ? Number(formatUnits(allowanceData, 18)) : 0;
  const parsedAmount = Number(amount) || 0;

  const { writeContract: writeApprove, data: hashApprove, isPending: isPendingApprove } = useWriteContract();
  const { isLoading: isConfirmingApprove, isSuccess: isSuccessApprove } = useWaitForTransactionReceipt({ hash: hashApprove });

  const { writeContract: writeStake, data: hashStake, isPending: isPendingStake } = useWriteContract();
  const { isLoading: isConfirmingStake, isSuccess: isSuccessStake } = useWaitForTransactionReceipt({ hash: hashStake });

  const { writeContract: writeUnstake, data: hashUnstake, isPending: isPendingUnstake } = useWriteContract();
  const { isLoading: isConfirmingUnstake, isSuccess: isSuccessUnstake } = useWaitForTransactionReceipt({ hash: hashUnstake });

  const handleMax = () => {
    if (activeTab === 'stake') {
      setAmount(stkBalance.toString());
    } else {
      setAmount(userStaked.toString());
    }
  };

  const handleAction = () => {
    if (!amount || parsedAmount <= 0) return;
    const amountWei = parseUnits(amount, 18);

    if (activeTab === 'stake') {
      if (currentAllowance < parsedAmount) {
        writeApprove({
          address: CONTRACT_ADDRESSES.STAKE_TOKEN,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.STAKING_VAULT, amountWei],
        });
      } else {
        writeStake({
          address: CONTRACT_ADDRESSES.STAKING_VAULT,
          abi: STAKING_VAULT_ABI,
          functionName: 'stake',
          args: [amountWei],
        });
      }
    } else {
      writeUnstake({
        address: CONTRACT_ADDRESSES.STAKING_VAULT,
        abi: STAKING_VAULT_ABI,
        functionName: 'unstake',
        args: [amountWei],
      });
    }
  };

  useEffect(() => {
    if (isSuccessApprove) {
      toast.success('Approval successful!');
      refetchAllowance();
    }
    if (isSuccessStake) {
      toast('Successfully staked!', {
        icon: (
          <div className="relative flex items-center justify-center">
            <Lock size={20} className="text-brand-gold animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_1_reverse]" />
            <div className="absolute inset-0 bg-brand-gold/50 blur-md rounded-full animate-pulse" />
          </div>
        ),
        style: {
          background: '#181b22',
          color: '#fff',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
        },
      });
      setAmount('');
      refetchBalance();
      onTxSuccess();
    }
    if (isSuccessUnstake) {
      toast.success('Successfully unstaked & claimed!');
      setAmount('');
      refetchBalance();
      onTxSuccess();
    }
  }, [isSuccessApprove, isSuccessStake, isSuccessUnstake, refetchAllowance, refetchBalance, onTxSuccess]);

  const isLoading = isPendingApprove || isConfirmingApprove || isPendingStake || isConfirmingStake || isPendingUnstake || isConfirmingUnstake;
  
  let buttonText = '';
  if (activeTab === 'stake') {
    if (isPendingApprove || isConfirmingApprove) buttonText = 'Approving...';
    else if (isPendingStake || isConfirmingStake) buttonText = 'Staking...';
    else if (currentAllowance < parsedAmount) buttonText = 'Approve STK';
    else buttonText = 'Stake';
  } else {
    if (isPendingUnstake || isConfirmingUnstake) buttonText = 'Unstaking...';
    else buttonText = 'Unstake & Claim';
  }

  const balanceDisplay = activeTab === 'stake' ? stkBalance : userStaked;
  const isInvalid = parsedAmount <= 0 || parsedAmount > balanceDisplay;

  return (
    <div className="bg-surface-card rounded-2xl p-6 border border-surface-border">
      <div className="flex bg-black/20 p-1 rounded-lg mb-6">
        <button
          onClick={() => { setActiveTab('stake'); setAmount(''); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]
            ${activeTab === 'stake' 
              ? 'bg-brand-gold text-surface-bg shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
              : 'text-text-secondary hover:text-white'
            }`}
        >
          <Lock size={16} /> Stake
        </button>
        <button
          onClick={() => { setActiveTab('unstake'); setAmount(''); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]
            ${activeTab === 'unstake' 
              ? 'bg-surface-border text-white shadow-sm' 
              : 'text-text-secondary hover:text-white'
            }`}
        >
          <Unlock size={16} /> Unstake
        </button>
      </div>

      <div className="space-y-4">
        <button onClick={() => toast('Successfully staked!', {
        icon: (
          <div className="relative flex items-center justify-center">
            <Lock size={20} className="text-brand-gold animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_1_reverse]" />
            <div className="absolute inset-0 bg-brand-gold/50 blur-md rounded-full animate-pulse" />
          </div>
        ),
        style: {
          background: '#181b22',
          color: '#fff',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',
        },
      })} id="mock-success" className="opacity-0 w-0 h-0 absolute pointer-events-auto">Mock Success</button>
        <div>
          <div className="flex justify-between text-sm mb-2 text-text-secondary">
            <span>Amount</span>
            <span>{activeTab === 'stake' ? 'Wallet' : 'Staked'}: {balanceDisplay.toLocaleString(undefined, { maximumFractionDigits: 2 })} STK</span>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full bg-surface-bg border border-surface-border rounded-lg px-4 py-3 text-lg text-white placeholder-text-secondary focus:outline-none focus:border-brand-gold/50 transition-colors font-mono"
            />
            <button 
              onClick={handleMax}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium bg-brand-gold/10 text-brand-gold px-2 py-1 rounded hover:bg-brand-gold/20 transition-colors active:scale-95"
            >
              MAX
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button 
            onClick={handleAction}
            disabled={isLoading || isInvalid || !address}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed
              ${activeTab === 'stake' 
                ? 'bg-brand-gold text-surface-bg hover:bg-brand-gold-bright hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                : 'bg-surface-border text-white hover:bg-surface-border/80'
              }`}
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            {!isLoading && <ArrowRight size={18} />}
            {buttonText}
          </button>
        </div>
        
        {activeTab === 'unstake' && (
          <p className="text-xs text-center text-brand-gold mt-2">
            Unstaking will automatically claim your pending rewards.
          </p>
        )}
      </div>
    </div>
  );
};
