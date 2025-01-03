// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployModule = buildModule('Token2', (m) => {
  const marketPlace = m.contract("SudokuMarketplacetest");
  return marketPlace;
});

// Export cho CommonJS
module.exports = DeployModule;
