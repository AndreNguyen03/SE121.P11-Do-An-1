// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DeployModule = buildModule('NFTV3', (m) => {
  const baseCID = "ipfs://bafybeibv4rsudbtbuyybffaqwdtn3wpxkfg4dyy33kwwzqvhexowxnwrgi"
  const marketPlace = m.contract("SquishySouls", [baseCID]);
  return marketPlace;
});

// Export cho CommonJS
module.exports = DeployModule;
