// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SquishySouls is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    uint256 public constant maxTokens = 1000;


    event Mint(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("SquishySouls", "SSL") Ownable(msg.sender) {}

    function mint(address to, string memory tokenURI) external {
        require(nextTokenId < maxTokens, "Max supply reached");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit Mint(to, tokenId, tokenURI);
    }

    function getRemainingSupply() external view returns (uint256) {
        return maxTokens - nextTokenId;
    }
    
}
