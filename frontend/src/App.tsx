import { DashboardLayout } from './layouts/DashboardLayout';
import { StatCard } from './components/StatCard';
import { PositionChart } from './components/PositionChart';
import { StakeCard } from './components/StakeCard';
import { ClaimCard } from './components/ClaimCard';
import { ActivityTable } from './components/ActivityTable';
import { Activity, ShieldCheck, Wallet, TrendingUp } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_VAULT_ABI } from './contracts';
import { formatUnits } from 'viem';

function App() {
  const { address, isConnected } = useAccount();

  // Read APR
  const { data: aprBps } = useReadContract({
    address: CONTRACT_ADDRESSES.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'aprBps',
  });

  // Read TVL
  const { data: totalStaked } = useReadContract({
    address: CONTRACT_ADDRESSES.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'totalStaked',
  });

  // Read User Info
  const { data: userInfo, refetch: refetchUserInfo } = useReadContract({
    address: CONTRACT_ADDRESSES.STAKING_VAULT,
    abi: STAKING_VAULT_ABI,
    functionName: 'getUserInfo',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    }
  });

  const formattedApr = aprBps ? (Number(aprBps) / 100).toFixed(1) + '%' : '12.0%';
  const formattedTvl = totalStaked ? Number(formatUnits(totalStaked, 18)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0';
  
  const userStaked = userInfo ? Number(formatUnits(userInfo[0], 18)) : 0;
  const initialPendingRewards = userInfo ? Number(formatUnits(userInfo[1], 18)) : 0;

  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 1 }, // Keep container visible, children will handle opacity
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="relative mb-16 py-16 md:py-24 flex flex-col items-center justify-center text-center rounded-3xl border border-white/5 overflow-hidden bg-black/20">
        {/* Animated Gold Glow Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600">
              Aurum
            </span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            Stake. Earn. Compound.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
            A fixed-APR staking vault built on Ethereum Sepolia — deposit, earn continuously, withdraw anytime.
          </p>
          
          {isConnected ? (
            <button 
              onClick={() => window.scrollTo({ top: document.getElementById('dashboard-section')?.offsetTop, behavior: 'smooth' })}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-bold text-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5"
            >
              View Vault
            </button>
          ) : (
            <div className="transform hover:-translate-y-0.5 transition-transform scale-110">
              <ConnectButton />
            </div>
          )}
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16"></div>

      {/* Dashboard Section */}
      <div id="dashboard-section" className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 scroll-mt-32">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Vault Dashboard</h2>
          <p className="text-text-secondary mt-1">Manage your staking position and claim rewards</p>
        </div>
        <ConnectButton />
      </div>

      {/* Stats Grid Area with Ambient Depth */}
      <div className="relative mb-8">
        {/* Ambient Background Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-black/0 to-transparent pointer-events-none rounded-3xl" />
        
        <motion.div 
          variants={shouldReduceMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
        >
          <StatCard 
            title="Current APR" 
            value={formattedApr} 
            numericValue={Number(aprBps) / 100}
            decimals={1}
            suffix="%"
            icon={<TrendingUp size={20} />} 
            glow={true}
            sparklineData={[{value: 12}, {value: 12}, {value: 12}]} // Neutral placeholder
          />
          <StatCard 
            title="Total Value Locked" 
            value={`${formattedTvl} STK`} 
            numericValue={Number(formatUnits(totalStaked || 0n, 18))}
            decimals={0}
            suffix=" STK"
            icon={<ShieldCheck size={20} />} 
            gradientText={true}
            sparklineData={[{value: 0}, {value: Number(formatUnits(totalStaked || 0n, 18))}]} // Neutral placeholder
          />
          <StatCard 
            title="Your Position" 
            value={userStaked.toLocaleString(undefined, { maximumFractionDigits: 2 })} 
            numericValue={userStaked}
            decimals={2}
            subtitle="STK Tokens"
            icon={<Wallet size={20} />} 
          />
          <StatCard 
            title="Banked Rewards" 
            value={initialPendingRewards.toLocaleString(undefined, { maximumFractionDigits: 4 })} 
            numericValue={initialPendingRewards}
            decimals={4}
            subtitle="RWD Tokens"
            icon={<Activity size={20} />} 
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PositionChart />
        </div>
        <div className="flex flex-col gap-6">
          <StakeCard onTxSuccess={() => refetchUserInfo()} userStaked={userStaked} />
          <ClaimCard initialRewards={initialPendingRewards} aprBps={Number(aprBps || 1200)} userStaked={userStaked} onClaimSuccess={() => refetchUserInfo()} />
        </div>
      </div>

      {/* Activity Table */}
      <div className="mb-8">
        <ActivityTable />
      </div>
    </DashboardLayout>
  );
}

export default App;
