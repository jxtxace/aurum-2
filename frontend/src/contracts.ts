import { parseAbi } from 'viem';

// We will update these addresses after deployment
export const CONTRACT_ADDRESSES = {
  STAKE_TOKEN: '0x0000000000000000000000000000000000000000' as const,
  REWARD_TOKEN: '0x0000000000000000000000000000000000000000' as const,
  STAKING_VAULT: '0x0000000000000000000000000000000000000000' as const,
};

export const ERC20_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
]);

export const STAKING_VAULT_ABI = parseAbi([
  'function aprBps() view returns (uint256)',
  'function totalStaked() view returns (uint256)',
  'function earned(address user) view returns (uint256)',
  'function stake(uint256 amount)',
  'function unstake(uint256 amount)',
  'function claimRewards()',
  'function getUserInfo(address user) view returns (uint256 stakedAmount, uint256 pendingRewards)',
  'event Staked(address indexed user, uint256 amount)',
  'event Unstaked(address indexed user, uint256 amount)',
  'event RewardsClaimed(address indexed user, uint256 amount)',
]);
