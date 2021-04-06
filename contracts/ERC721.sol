pragma solidity ^0.5.0;

import "./ERC721Tradable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title ERC721
 * ERC721 - a contract for my non-fungible tokens.
 */
contract ERC721 is ERC721Tradable {
    constructor(address _proxyRegistryAddress)
        public
        ERC721Tradable("ERC721", "721", _proxyRegistryAddress)
    {}

    function baseTokenURI() public pure returns (string memory) {
        return "https://api.hashable.art/api/token/";
    }

    function contractURI() public pure returns (string memory) {
        return "https://api.hashable.art/contract/hashable-tokens";
    }
}
