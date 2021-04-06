pragma solidity ^0.5.11;

import "./ERC1155Tradable.sol";

/**
 * @title ERC1155
 * ERC1155 - a contract for ERC1155 semi-fungible tokens.
 */
contract ERC1155 is ERC1155Tradable {
    constructor(address _proxyRegistryAddress)
        public
        ERC1155Tradable(
            "Hashable ERC1155",
            "OSCA",
            _proxyRegistryAddress
        )
    {
        _setBaseMetadataURI("https://creatures-api.opensea.io/api/accessory/");
    }

    function contractURI() public pure returns (string memory) {
        return "https://creatures-api.opensea.io/contract/opensea-erc1155";
    }
}
