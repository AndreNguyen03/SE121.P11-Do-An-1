import { ethers } from 'ethers';
import NFT from '../models/nft.model.js';
import ActionHistory from '../models/actionHistory.model.js';
import marketplaceAbi from './Marketplace.json' assert { type: 'json' };
import nftAbi from './SquishySouls.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

// Contract addresses
const contractAddressNFT = "0x44eCdFA2204Fc4a9c3e8ee8c4cFaa7392aB9cc74";
const contractAddressMarketplace = "0x81936Ef8ED97A08aD4867b1cDf48A895F8b7e210";

// Providers and contracts
const provider = new ethers.providers.WebSocketProvider(`wss://${process.env.ALCHEMY_URL}`);
const marketplaceContract = new ethers.Contract(contractAddressMarketplace, marketplaceAbi.abi, provider);
const nftContract = new ethers.Contract(contractAddressNFT, nftAbi.abi, provider);

// Lắng nghe tất cả các sự kiện từ Marketplace và NFT
export const listenToMarketplaceEvents = () => {

    console.log('Listening to marketplace and NFT events...');

    marketplaceContract.on('ItemListed', handleItemListed);
    marketplaceContract.on('ItemSold', handleItemSold);
    marketplaceContract.on('ItemCanceled', handleItemCanceled);
    nftContract.on('Transfer', handleTransfer);

};

// Hàm xử lý sự kiện ItemListed
const handleItemListed = async (seller, tokenId, price) => {
    try {
        console.log(`ItemListed detected: TokenID ${tokenId} listed by ${seller} for price ${price}`);

        console.log(`ngươi list :::`, seller);
        // Cập nhật thông tin NFT trong database
        await NFT.updateOne(
            { tokenId: tokenId.toString() },
            {
                isListed: true,
                listedAt: new Date(),
                owner: seller.toLowerCase(),
                price: ethers.utils.formatEther(price),
                status: 'listed',
            },
            { upsert: true }
        );

        // Lưu lịch sử thao tác
        await ActionHistory.create({
            tokenId: tokenId.toString(),
            action: 'list',
            by: seller.toLowerCase(),
            price: ethers.utils.formatEther(price),
            timestamp: new Date(),
        });

        console.log(`NFT ${tokenId} listed successfully.`);
    } catch (error) {
        console.error(`Error processing ItemListed for TokenID ${tokenId}:`, error);
    }
};

// Hàm xử lý sự kiện ItemSold
const handleItemSold = async (seller, buyer, tokenId, price) => {
    try {
        console.log(`ItemSold detected: TokenID ${tokenId} sold by ${seller} to ${buyer} for price ${price}`);

        // Cập nhật thông tin NFT trong database
        await NFT.updateOne(
            { tokenId: tokenId.toString() },
            {
                isListed: false,
                soldAt: new Date(),
                soldBy: seller.toLowerCase(),
                ownerAddress: buyer.toLowerCase(),
                price: ethers.utils.formatEther(price),
                status: 'sold',
            },
            { upsert: true }
        );

        // Lưu lịch sử thao tác
        await ActionHistory.create({
            tokenId: tokenId.toString(),
            action: 'sell',
            by: seller.toLowerCase(),
            to: buyer.toLowerCase(),
            price: ethers.utils.formatEther(price),
            timestamp: new Date(),
        });

        console.log(`NFT ${tokenId} sold successfully.`);
    } catch (error) {
        console.error(`Error processing ItemSold for TokenID ${tokenId}:`, error);
    }
};

// Hàm xử lý sự kiện ItemCanceled
const handleItemCanceled = async (seller, tokenId) => {
    try {
        console.log(`ItemCanceled detected: TokenID ${tokenId} canceled by ${seller}`);

        // Cập nhật thông tin NFT trong database
        await NFT.updateOne(
            { tokenId: tokenId.toString() },
            {
                isListed: false,
                price: null,
                status: 'canceled',
            },
            { upsert: true }
        );

        // Lưu lịch sử thao tác
        await ActionHistory.create({
            tokenId: tokenId.toString(),
            action: 'cancel',
            by: seller.toLowerCase(),
            timestamp: new Date(),
        });

        console.log(`NFT ${tokenId} canceled successfully.`);
    } catch (error) {
        console.error(`Error processing ItemCanceled for TokenID ${tokenId}:`, error);
    }
};

// Hàm xử lý sự kiện Transfer
const handleTransfer = async (from, to, tokenId) => {
    try {
        console.log(`Transfer detected: TokenID ${tokenId} transferred from ${from} to ${to}`);

        // Kiểm tra nếu là sự kiện mint (from là address zero)
        if (from === ethers.constants.AddressZero) {
            console.log(`TokenID ${tokenId} minted to ${to}`);

            // Fetch metadata từ tokenURI
            const tokenURI = await nftContract.tokenURI(tokenId);
            const metadata = await fetchMetadata(tokenURI);

            // Lưu thông tin NFT vào database
            await NFT.updateOne(
                { tokenId: tokenId.toString() },
                {
                    ownerAddress: to.toLowerCase(),
                    tokenURI,
                    metadata,
                    created: new Date(),
                    createdBy: to.toLowerCase(),
                    isListed: false,
                    status: 'minted',
                },
                { upsert: true }
            );

            // Lưu lịch sử thao tác


            console.log(`NFT ${tokenId} minted and saved to database.`);
        } else {
            // Cập nhật thông tin chủ sở hữu mới trong database
            if (to !== contractAddressMarketplace) {
                await NFT.updateOne(
                    { tokenId: tokenId.toString() },
                    {
                        ownerAddress: to.toLowerCase(),
                    }
                );
            }

            console.log(`NFT ${tokenId} ownership transferred to ${to}.`);
        }

        await ActionHistory.create({
            tokenId: tokenId.toString(),
            action: 'transfer',
            by: from.toLowerCase(),
            to: to.toLowerCase(),
            timestamp: new Date(),
        });

    } catch (error) {
        console.error(`Error processing Transfer for TokenID ${tokenId}:`, error);
    }
};

const fetchMetadata = async (tokenURI) => {
    try {
        if (tokenURI.startsWith('ipfs://')) {
            tokenURI = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        }

        console.log(`Fetching metadata from TokenURI: ${tokenURI}`);
        const response = await fetch(tokenURI);
        if (!response.ok) throw new Error(`Failed to fetch metadata from ${tokenURI}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return null;
    }
};
