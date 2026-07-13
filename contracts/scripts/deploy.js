import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Stake Token (mSTK)
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1M tokens
  
  const stakeToken = await MockERC20.deploy("Mock Stake Token", "mSTK", initialSupply);
  await stakeToken.waitForDeployment();
  console.log("StakeToken deployed to:", await stakeToken.getAddress());

  // Deploy Reward Token (mRWD)
  const rewardToken = await MockERC20.deploy("Mock Reward Token", "mRWD", initialSupply);
  await rewardToken.waitForDeployment();
  console.log("RewardToken deployed to:", await rewardToken.getAddress());

  // Deploy StakingVault (12% APR initially)
  const StakingVault = await hre.ethers.getContractFactory("StakingVault");
  const vault = await StakingVault.deploy(
    await stakeToken.getAddress(),
    await rewardToken.getAddress(),
    1200 // 12% APR in bps
  );
  await vault.waitForDeployment();
  console.log("StakingVault deployed to:", await vault.getAddress());

  // Fund the vault with rewards
  const fundAmount = hre.ethers.parseUnits("500000", 18); // 500k reward tokens
  await rewardToken.approve(await vault.getAddress(), fundAmount);
  await vault.fundRewards(fundAmount);
  console.log("Funded vault with 500,000 mRWD");

  console.log("\nDeployment completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
