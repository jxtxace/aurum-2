import { DashboardLayout } from './layouts/DashboardLayout';
import { StatCard } from './components/StatCard';
import { PositionChart } from './components/PositionChart';
import { StakeCard } from './components/StakeCard';
import { ClaimCard } from './components/ClaimCard';
import { ActivityTable } from './components/ActivityTable';
import { Activity, ShieldCheck, Wallet, TrendingUp } from 'lucide-react';
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

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Vault Dashboard</h2>
          <p className="text-text-secondary mt-1">Manage your staking position and claim rewards</p>
        </div>
        <ConnectButton />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
