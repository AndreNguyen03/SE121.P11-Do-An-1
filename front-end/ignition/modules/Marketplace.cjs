// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployModule = buildModule('Marketplace', (m) => {
  const nftAddress = "0x84f1f012e39076CCCc9A4533827fAD7455529c37"
  const marketPlace = m.contract("Marketplace", [nftAddress]);
  return marketPlace;
});

// Export cho CommonJS
module.exports = DeployModule;
