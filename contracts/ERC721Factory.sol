pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IFactoryERC721.sol";
import "./ERC721.sol";
import "./ERC721Collection.sol";
import "./Strings.sol";

contract ERC721Factory is FactoryERC721, Ownable {
    using Strings for string;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    address public proxyRegistryAddress;
    address public nftAddress;
    address public lootBoxNftAddress;
    string public baseURI = "https://api.hashable.art/api/factory/";

    /**
     * Enforce the existence of only 100 OpenSea creatures.
     */
    uint256 TOKEN_SUPPLY = 100;

    /**
     * Three different options for minting ERC721s (basic, premium, and gold).
     */
    uint256 NUM_OPTIONS = 3;
    uint256 SINGLE_TOKEN_OPTION = 0;
    uint256 MULTIPLE_TOKEN_OPTION = 1;
    uint256 COLLECTION_OPTION = 2;
    uint256 NUM_TOKENS_IN_MULTIPLE_TOKEN_OPTION = 4;

    constructor(address _proxyRegistryAddress, address _nftAddress) public {
        proxyRegistryAddress = _proxyRegistryAddress;
        nftAddress = _nftAddress;
        collectionNftAddress = address(
            new ERC721Collection(_proxyRegistryAddress, address(this))
        );

        fireTransferEvents(address(0), owner());
    }

    function name() external view returns (string memory) {
        return "OpenSeaERC721 Item Sale";
    }

    function symbol() external view returns (string memory) {
        return "CPF";
    }

    function supportsFactoryInterface() public view returns (bool) {
        return true;
    }

    function numOptions() public view returns (uint256) {
        return NUM_OPTIONS;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        address _prevOwner = owner();
        super.transferOwnership(newOwner);
        fireTransferEvents(_prevOwner, newOwner);
    }

    function fireTransferEvents(address _from, address _to) private {
        for (uint256 i = 0; i < NUM_OPTIONS; i++) {
            emit Transfer(_from, _to, i);
        }
    }

    function mint(uint256 _optionId, address _toAddress) public {
        // Must be sent from the owner proxy or owner.
        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        assert(
            address(proxyRegistry.proxies(owner())) == msg.sender ||
                owner() == msg.sender ||
                msg.sender == lootBoxNftAddress
        );
        require(canMint(_optionId));

        ERC721 hashableERC721 = ERC721(nftAddress);
        if (_optionId == SINGLE_TOKEN_OPTION) {
            hashableERC721.mintTo(_toAddress);
        } else if (_optionId == MULTIPLE_TOKEN_OPTION) {
            for (
                uint256 i = 0;
                i < NUM_TOKENS_IN_MULTIPLE_TOKEN_OPTION;
                i++
            ) {
                hashableERC721.mintTo(_toAddress);
            }
        } else if (_optionId == COLLECTION_OPTION) {
            ERC721Collection hashableERC721Collection = ERC721Collection(
                collectionNftAddress
            );
            hashableERC721Collection.mintTo(_toAddress);
        }
    }

    function canMint(uint256 _optionId) public view returns (bool) {
        if (_optionId >= NUM_OPTIONS) {
            return false;
        }

        ERC721 hashableERC721 = ERC721(nftAddress);
        uint256 tokenSupply = hashableERC721.totalSupply();

        uint256 numItemsAllocated = 0;
        if (_optionId == SINGLE_TOKEN_OPTION) {
            numItemsAllocated = 1;
        } else if (_optionId == MULTIPLE_TOKEN_OPTION) {
            numItemsAllocated = NUM_TOKENS_IN_MULTIPLE_TOKEN_OPTION;
        } else if (_optionId == COLLECTION_OPTION) {
            ERC721Collection hashableERC721Collection = ERC721Collection(
                lootBoxNftAddress
            );
            numItemsAllocated = hashableERC721Collection.itemsPerCollection();
        }
        return tokenSupply < (TOKEN_SUPPLY - numItemsAllocated);
    }

    function tokenURI(uint256 _optionId) external view returns (string memory) {
        return Strings.strConcat(baseURI, Strings.uint2str(_optionId));
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use transferFrom so the frontend doesn't have to worry about different method names.
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        mint(_tokenId, _to);
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
     */
    function isApprovedForAll(address _owner, address _operator)
        public
        view
        returns (bool)
    {
        if (owner() == _owner && _owner == _operator) {
            return true;
        }

        ProxyRegistry proxyRegistry = ProxyRegistry(proxyRegistryAddress);
        if (
            owner() == _owner &&
            address(proxyRegistry.proxies(_owner)) == _operator
        ) {
            return true;
        }

        return false;
    }

    /**
     * Hack to get things to work automatically on OpenSea.
     * Use isApprovedForAll so the frontend doesn't have to worry about different method names.
     */
    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return owner();
    }
}
