// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract SudokuMarketplacetest is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    uint256 public gameFee = 0.001 ether; // Phí để bắt đầu game

    struct NFTItem {
        uint256 tokenId;
        address owner;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => NFTItem) public nftItems; // Lưu thông tin NFT

    event StartGame(address indexed player);
    event MintNFT(address indexed owner, uint256 indexed tokenId, string tokenURI);
    event ListNFT(uint256 indexed tokenId, uint256 price);
    event BuyNFT(uint256 indexed tokenId, address indexed buyer);
    event GameFeeChanged(uint256 newGameFee);

    constructor() ERC721("SudokuNFTtest", "SUDOT") Ownable(msg.sender) {}

    /**
     * @dev Người chơi trả phí và bắt đầu chơi game.
     */
    function startGame() external payable {
        require(msg.value == gameFee, "You must pay the exact game fee to start");

        emit StartGame(msg.sender);
    }

    /**
     * @dev Mint NFT sau khi hoàn thành game.
     */
    function mintAfterGame(string memory tokenURI) external {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        nftItems[tokenId] = NFTItem(tokenId, msg.sender, 0, false);

        emit MintNFT(msg.sender, tokenId, tokenURI);
    }

    /**
     * @dev List NFT để bán.
     */
    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        require(price > 0, "Price must be greater than zero");

        nftItems[tokenId].price = price;
        nftItems[tokenId].isListed = true;

        emit ListNFT(tokenId, price);
    }

    /**
     * @dev Mua NFT.
     */
    function buyNFT(uint256 tokenId) external payable {
        NFTItem storage item = nftItems[tokenId];
        require(item.isListed, "NFT is not listed for sale");
        require(msg.value >= item.price, "Not enough ETH to buy NFT");

        address seller = item.owner;

        // Chuyển quyền sở hữu
        item.owner = msg.sender;
        item.isListed = false;

        _transfer(seller, msg.sender, tokenId);

        // Thanh toán cho người bán
        payable(seller).transfer(item.price);

        emit BuyNFT(tokenId, msg.sender);
    }

    /**
     * @dev Lấy danh sách tất cả NFT trên Marketplace.
     */
    function getAllListedNFTs() external view returns (NFTItem[] memory) {
        uint256 totalNFTs = nextTokenId;
        uint256 listedCount;

        for (uint256 i = 0; i < totalNFTs; i++) {
            if (nftItems[i].isListed) {
                listedCount++;
            }
        }

        NFTItem[] memory listedNFTs = new NFTItem[](listedCount);
        uint256 index;

        for (uint256 i = 0; i < totalNFTs; i++) {
            if (nftItems[i].isListed) {
                listedNFTs[index] = nftItems[i];
                index++;
            }
        }

        return listedNFTs;
    }

    /**
     * @dev Lấy danh sách NFT mà một địa chỉ sở hữu.
     */
    function getUserNFTs(address user) external view returns (NFTItem[] memory) {
        uint256 balance = balanceOf(user);
        uint256 count = 0;
        NFTItem[] memory result = new NFTItem[](balance);

        for (uint256 i = 0; i < nextTokenId; i++) {
            if (nftItems[i].owner == user) {
                result[count] = nftItems[i];
                count++;
            }
        }
        return result;
    }

    /**
     * @dev Rút số dư từ hợp đồng.
     */
    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Chỉnh sửa phí game.
     */
    function setGameFee(uint256 newGameFee) external onlyOwner {
        gameFee = newGameFee;
        emit GameFeeChanged(newGameFee);
    }
    /**
     * @dev Chỉnh sửa phí game.
     */
     function getGameFee() external view returns (uint256) {
        return gameFee;
    }
}