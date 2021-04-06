console.log("Setting up Contracts.");
const Pirate = artifacts.require("./Pirate.sol");
const PirateFactory = artifacts.require("./PirateFactory.sol");
const PirateBootyBox = artifacts.require("./PirateBootyBox.sol");
const PirateTreasure = artifacts.require("../contracts/PirateTreasure.sol");
const PirateTreasureFactory = artifacts.require("../contracts/PirateTreasureFactory.sol");
const PirateTreasureBootyBox = artifacts.require("../contracts/PirateTreasureBootyBox.sol");
const BootyBoxRandomness = artifacts.require("../contracts/BootyBoxRandomness.sol");

console.log("Setting up Treasures.");
const setupPirateTreasures = require("../lib/setupPirateTreasures.js");

// If you want to hardcode what deploys, comment out process.env.X and use
// true/false;
const DEPLOY_ALL = process.env.DEPLOY_ALL;
const DEPLOY_TREASURES_SALE = process.env.DEPLOY_TREASURES_SALE || DEPLOY_ALL;
const DEPLOY_TREASURES = process.env.DEPLOY_TREASURES || DEPLOY_TREASURES_SALE || DEPLOY_ALL;
const DEPLOY_PIRATES_SALE = process.env.DEPLOY_PIRATES_SALE || DEPLOY_ALL;
// Note that we will default to this unless DEPLOY_TREASURES is set.
// This is to keep the historical behavior of this migration.
const DEPLOY_PIRATES = process.env.DEPLOY_PIRATES || DEPLOY_PIRATES_SALE || DEPLOY_ALL || (! DEPLOY_TREASURES);

module.exports = async (deployer, network, addresses) => {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress = "";
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }
   console.log("Deploying Pirates.");

  if (DEPLOY_PIRATES) {
    await deployer.deploy(Pirate, proxyRegistryAddress, {gas: 5000000});
  }

  if (DEPLOY_PIRATES_SALE) {
    await deployer.deploy(PirateFactory, proxyRegistryAddress, Pirate.address, {gas: 7000000});
    const pirate = await Pirate.deployed();
    await pirate.transferOwnership(PirateFactory.address);
  }

  if (DEPLOY_TREASURES) {
    await deployer.deploy(
      PirateTreasure,
      proxyRegistryAddress,
      { gas: 5000000 }
    );
    const treasures = await PirateTreasure.deployed();
    await setupPirateTreasures.setupTreasure(
      treasures,
      addresses[0]
    );
  }

  if (DEPLOY_TREASURES_SALE) {
    await deployer.deploy(BootyBoxRandomness);
    await deployer.link(BootyBoxRandomness, PirateTreasureBootyBox);
    await deployer.deploy(
      PirateTreasureBootyBox,
      proxyRegistryAddress,
      { gas: 6721975 }
    );
    const bootyBox = await PirateTreasureBootyBox.deployed();
    await deployer.deploy(
      PirateTreasureFactory,
      proxyRegistryAddress,
      PirateTreasure.address,
      PirateTreasureBootyBox.address,
      { gas: 5000000 }
    );
    const treasures = await PirateTreasure.deployed();
    const factory = await PirateTreasureFactory.deployed();
    await treasures.setApprovalForAll(
      addresses[0],
      PirateTreasureFactory.address
    );
    await treasures.transferOwnership(
      PirateTreasureFactory.address
    );
    await setupPirateTreasures.setupTreasureBootyBox(bootyBox, factory);
    await bootyBox.transferOwnership(factory.address);
  }
};
