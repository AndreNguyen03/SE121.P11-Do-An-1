// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployModule = buildModule('Marketplace', (m) => {
  const nftAddress = "0x44eCdFA2204Fc4a9c3e8ee8c4cFaa7392aB9cc74"
  const marketPlace = m.contract("Marketplace", [nftAddress]);
  return marketPlace;
});

// Export cho CommonJS
module.exports = DeployModule;
