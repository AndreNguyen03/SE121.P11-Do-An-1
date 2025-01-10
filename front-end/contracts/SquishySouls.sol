// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SquishySouls is ERC721URIStorage, Ownable {
    uint256 public maxTokens = 100;
    uint256 public maxTokensPerUser = 5; 
    uint256[] private availableTokens; 
    string public baseCID; 
    mapping(address => uint256) public mintedTokensCount; 

    constructor(string memory _baseCID) ERC721("SquishySouls", "SSL") Ownable(msg.sender) {
        baseCID = _baseCID;

        // Khởi tạo danh sách tokenId khả dụng
        for (uint256 i = 0; i < maxTokens; i++) {
            availableTokens.push(i);
        }
    }

    /**
     * @notice Mint một NFT cho địa chỉ `to`.
     * @param to Địa chỉ nhận NFT.
     */
    function mint(address to) external {
        require(availableTokens.length > 0, "All tokens have been minted");
        require(mintedTokensCount[to] < maxTokensPerUser, "User mint limit reached");

        _mintSingleNFT(to);
    }

    /**
     * @notice Mint nhiều NFT cho địa chỉ `to`.
     * @param to Địa chỉ nhận NFT.
     * @param quantity Số lượng NFT muốn mint.
     */
    function mintBatch(address to, uint256 quantity) external {
        require(quantity > 0, "Quantity must be greater than zero");
        require(availableTokens.length >= quantity, "Not enough NFTs remaining");
        require(mintedTokensCount[to] + quantity <= maxTokensPerUser, "User mint limit exceeded");

        for (uint256 i = 0; i < quantity; i++) {
            _mintSingleNFT(to);
        }
    }

    /**
     * @notice Lấy số lượng tokenId còn lại chưa mint.
     * @return Số lượng tokenId còn lại.
     */
    function getRemainingTokens() public view returns (uint256) {
        return availableTokens.length;
    }

    /**
     * @notice Lấy số lượng NFT mà một user đã mint.
     * @param user Địa chỉ của user cần kiểm tra.
     * @return Số lượng NFT đã mint.
     */
    function getUserMintedCount(address user) public view returns (uint256) {
        return mintedTokensCount[user];
    }

    /**
     * @notice Cập nhật Base CID của metadata (chỉ owner).
     * @param _newBaseCID CID mới của metadata trên IPFS.
     */
    function updateBaseCID(string memory _newBaseCID) external onlyOwner {
        baseCID = _newBaseCID;
    }

    /**
     * @notice Cập nhật số lượng NFT tối đa mỗi user được phép mint (chỉ owner).
     * @param _newLimit Số lượng tối đa mới.
     */
    function updateMaxTokensPerUser(uint256 _newLimit) external onlyOwner {
        maxTokensPerUser = _newLimit;
    }

    /**
     * @notice Lấy ngẫu nhiên một index từ danh sách availableTokens.
     * @return Chỉ số ngẫu nhiên của tokenId.
     */
    function _getRandomIndex() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % availableTokens.length;
    }

    /**
     * @notice Hàm nội bộ để mint một NFT.
     * @param to Địa chỉ nhận NFT.
     */
    function _mintSingleNFT(address to) private {
        uint256 randomIndex = _getRandomIndex();
        uint256 tokenId = availableTokens[randomIndex];

        // Tạo tokenURI từ baseCID và tokenId
        string memory tokenURI = string(abi.encodePacked(baseCID, "/", Strings.toString(tokenId), ".json"));

        // Loại tokenId khỏi danh sách
        availableTokens[randomIndex] = availableTokens[availableTokens.length - 1];
        availableTokens.pop();

        // Mint NFT
        mintedTokensCount[to]++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit Mint(to, tokenId, tokenURI);
    }

    event Mint(address indexed to, uint256 tokenId, string tokenURI);
}
