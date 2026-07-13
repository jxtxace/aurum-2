// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title StakingVault
/// @notice Stake a token, earn rewards continuously at a fixed APR. No lock-up.
/// @dev Built for a portfolio project on Sepolia testnet. Not audited — do not use with real funds.
contract StakingVault is Ownable, ReentrancyGuard {
    IERC20 public immutable stakeToken;
    IERC20 public immutable rewardToken;

    uint256 public aprBps; // e.g. 1200 = 12% APR
    uint256 public constant BPS_DENOM = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    uint256 public totalStaked;

    struct UserInfo {
        uint256 stakedAmount;
        uint256 rewardDebt;     // rewards accrued but not yet claimed, banked at last checkpoint
        uint256 lastUpdateTime; // last time this user's rewards were checkpointed
    }

    mapping(address => UserInfo) public users;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event AprUpdated(uint256 newAprBps);
    event RewardsFunded(address indexed funder, uint256 amount);

    constructor(address _stakeToken, address _rewardToken, uint256 _initialAprBps) {
        require(_stakeToken != address(0) && _rewardToken != address(0), "Zero address");
        stakeToken = IERC20(_stakeToken);
        rewardToken = IERC20(_rewardToken);
        aprBps = _initialAprBps;
    }

    function _updateReward(address user) internal {
        UserInfo storage info = users[user];
        if (info.stakedAmount > 0) {
            info.rewardDebt += _pendingReward(user);
        }
        info.lastUpdateTime = block.timestamp;
    }

    function _pendingReward(address user) internal view returns (uint256) {
        UserInfo storage info = users[user];
        if (info.stakedAmount == 0) return 0;
        uint256 timeElapsed = block.timestamp - info.lastUpdateTime;
        return (info.stakedAmount * aprBps * timeElapsed) / (BPS_DENOM * SECONDS_PER_YEAR);
    }

    function earned(address user) external view returns (uint256) {
        return users[user].rewardDebt + _pendingReward(user);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Zero amount");
        _updateReward(msg.sender);

        require(stakeToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        users[msg.sender].stakedAmount += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        UserInfo storage info = users[msg.sender];
        require(amount > 0 && amount <= info.stakedAmount, "Invalid amount");

        _updateReward(msg.sender);

        info.stakedAmount -= amount;
        totalStaked -= amount;

        require(stakeToken.transfer(msg.sender, amount), "Transfer failed");

        uint256 reward = info.rewardDebt;
        if (reward > 0) {
            info.rewardDebt = 0;
            require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");
            emit RewardsClaimed(msg.sender, reward);
        }

        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        _updateReward(msg.sender);

        UserInfo storage info = users[msg.sender];
        uint256 reward = info.rewardDebt;
        require(reward > 0, "No rewards to claim");

        info.rewardDebt = 0;
        require(rewardToken.transfer(msg.sender, reward), "Reward transfer failed");

        emit RewardsClaimed(msg.sender, reward);
    }

    function setApr(uint256 newAprBps) external onlyOwner {
        aprBps = newAprBps;
        emit AprUpdated(newAprBps);
    }

    function fundRewards(uint256 amount) external onlyOwner {
        require(rewardToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit RewardsFunded(msg.sender, amount);
    }

    function getUserInfo(address user) external view returns (uint256 stakedAmount, uint256 pendingRewards) {
        return (users[user].stakedAmount, users[user].rewardDebt + _pendingReward(user));
    }
}
