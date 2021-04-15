const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraURL = 'https://rinkeby.infura.io/v3/27474adcf0c34510a42c99fc6e116d6a';
const fs = require('fs');
const mnemonic = fs.readFileSync('.secret').toString().trim();

module.exports = {
  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infuraURL),
      network_id: 4,
      gas: 5500000,        
    }
  },
  migrations_directory: "./migrations",
  compilers: {
    solc: {
      version: "0.7.4",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: false        // Use "0.5.1" you've installed locally with docker (default: false)
    }
  }
};
