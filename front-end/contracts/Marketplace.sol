// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
        bool isListed;
    }

    // Lưu trữ các NFT đang được niêm yết từ một contract duy nhất
    address public nftContract; // Địa chỉ của contract NFT duy nhất

    // Mỗi tokenId của NFT contract có một listing
    mapping(uint256 => Listing) public listings;

    // Phí 2.5% cho chủ sở hữu marketplace
    uint256 public feePercentage = 250; // 2.5% fee for the marketplace owner

    event ItemListed(address indexed seller, uint256 indexed tokenId, uint256 price);
    event ItemSold(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 price);
    event ItemCanceled(address indexed seller, uint256 indexed tokenId);

    constructor(address _nftContract) Ownable(msg.sender) {
        nftContract = _nftContract; // Khởi tạo địa chỉ contract NFT
    }

    // Hàm list item
    function listItem(uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be greater than 0");

        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "You must own the NFT to list it");
        require(!listings[tokenId].isListed, "Item already listed");

        // Chuyển NFT sang hợp đồng marketplace
        nft.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isListed: true
        });

        emit ItemListed(msg.sender, tokenId, price);
    }

    // Hàm buy item
    function buyItem(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isListed, "Item not listed for sale");
        require(msg.value >= listing.price, "Insufficient funds");

        uint256 fee = (listing.price * feePercentage) / 10000; // Tính phí
        uint256 sellerAmount = listing.price - fee;

        // Chuyển tiền cho seller và phí cho marketplace
        payable(listing.seller).transfer(sellerAmount);
        payable(owner()).transfer(fee);

        // Chuyển NFT cho người mua
        IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId);

        // Hủy listing
        delete listings[tokenId];

        emit ItemSold(listing.seller, msg.sender, tokenId, listing.price);
    }

    // Hàm hủy listing
    function cancelListing(uint256 tokenId) external nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isListed, "Item not listed");
        require(listing.seller == msg.sender, "Only the seller can cancel the listing");

        delete listings[tokenId];
        IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId);

        emit ItemCanceled(msg.sender, tokenId);
    }

    // Hàm lấy tất cả các item đang được niêm yết
    function getAllListedItems() external view returns (uint256[] memory, uint256[] memory) {
        uint256 totalListedItems = 0;

        // Đếm số lượng các NFT đang niêm yết
        for (uint256 tokenId = 0; tokenId < 100; tokenId++) {
            if (listings[tokenId].isListed) {
                totalListedItems++;
            }
        }

        uint256[] memory tokenIds = new uint256[](totalListedItems);
        uint256[] memory prices = new uint256[](totalListedItems);

        uint256 index = 0;
        for (uint256 tokenId = 0; tokenId < 100; tokenId++) {
            if (listings[tokenId].isListed) {
                tokenIds[index] = tokenId;
                prices[index] = listings[tokenId].price;
                index++;
            }
        }

        return (tokenIds, prices);
    }
}
