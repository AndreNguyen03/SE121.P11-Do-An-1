// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SquishySouls is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    uint256 public constant maxTokens = 100;

    mapping(address => uint256) public minted;

    event Mint(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("SquishySouls", "SSL") Ownable(msg.sender) {}

    function mint(address to, string memory tokenURI) external {
        require(minted[to] < 10, "A user can mint only 10 NFTs");
        require(nextTokenId < maxTokens, "Max supply reached");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        minted[to]++;
        emit Mint(to, tokenId, tokenURI);
    }

    function getMintedCount(address user) external view returns (uint256) {
        return minted[user];
    }

    function getRemainingSupply() external view returns (uint256) {
        return maxTokens - nextTokenId;
    }
    
}
