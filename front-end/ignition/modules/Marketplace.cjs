// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployModule = buildModule('MarketplaceTest2', (m) => {
  const nftAddress = "0x513Ae2fAD04819ad12acb71b5D5998080DD6D478"
  const marketPlace = m.contract("Marketplace", [nftAddress]);
  return marketPlace;
});

// Export cho CommonJS
module.exports = DeployModule;
