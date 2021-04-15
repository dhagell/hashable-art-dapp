// ERC721
//const hashartERC721 = artifacts.require("./hashartERC721.sol");
//const ERC721Factory = artifacts.require("./ERC721Factory.sol");
//const ERC721Collection = artifacts.require("./ERC721Collection.sol");
// ERC1155
const hashartERC1155 = artifacts.require("../contracts/hashartERC1155.sol");
//const ERC1155Factory = artifacts.require("../contracts/ERC1155Factory.sol");
//const ERC1155Collection = artifacts.require("../contracts/ERC1155Collection.sol");
//const CollectionRandomness = artifacts.require("../contracts/CollectionRandomness.sol");

const setupERC1155 = require("../lib/setupERC1155.js");

// If you want to hardcode what deploys, comment out process.env.X and use
// true/false;
const DEPLOY_ALL = process.env.DEPLOY_ALL;
const DEPLOY_ERC1155_SALE = process.env.DEPLOY_ERC1155_SALE || DEPLOY_ALL;
const DEPLOY_ERC1155 = process.env.DEPLOY_ERC1155 || DEPLOY_ERC1155_SALE || DEPLOY_ALL;
const DEPLOY_CREATURES_SALE = process.env.DEPLOY_CREATURES_SALE || DEPLOY_ALL;
// Note that we will default to this unless DEPLOY_ERC1155 is set.
// This is to keep the historical behavior of this migration.
const DEPLOY_CREATURES = process.env.DEPLOY_CREATURES || DEPLOY_CREATURES_SALE || DEPLOY_ALL || (! DEPLOY_ERC1155);

module.exports = async (deployer, network, addresses) => {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress = "";
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }
/*
  if (DEPLOY_CREATURES) {
    await deployer.deploy(hashartERC721, proxyRegistryAddress, {gas: 5000000});
  }

  if (DEPLOY_CREATURES_SALE) {
    await deployer.deploy(ERC721Factory, proxyRegistryAddress, hashartERC721.address, {gas: 7000000});
    const creature = await hashartERC721.deployed();
    await creature.transferOwnership(ERC721Factory.address);
  }
*/
  if (DEPLOY_ERC1155) {
    await deployer.deploy(
      hashartERC1155,
      proxyRegistryAddress,
      { gas: 5000000 }
    );
    const accessories = await hashartERC1155.deployed();
    await setupERC1155.setupAccessory(
      accessories,
      addresses[0]
    );
  }
/*
  if (DEPLOY_ERC1155_SALE) {
    await deployer.deploy(CollectionRandomness);
    await deployer.link(CollectionRandomness, ERC1155Collection);
    await deployer.deploy(
      ERC1155Collection,
      proxyRegistryAddress,
      { gas: 6721975 }
    );
    const collection = await ERC1155Collection.deployed();
    await deployer.deploy(
      ERC1155Factory,
      proxyRegistryAddress,
      hashartERC1155.address,
      ERC1155Collection.address,
      { gas: 5000000 }
    );
    const accessories = await hashartERC1155.deployed();
    const factory = await ERC1155Factory.deployed();
    await accessories.setApprovalForAll(
      addresses[0],
      ERC1155Factory.address
    );
    await accessories.transferOwnership(
      ERC1155Factory.address
    );
    await setupERC1155.setupERC1155Collection(collection, factory);
    await collection.transferOwnership(factory.address);
  }
 */
};
