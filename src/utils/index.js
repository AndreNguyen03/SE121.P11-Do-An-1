import nft1 from '../assets/nft1.jpeg'
import nft2 from '../assets/nft2.jpeg'
import nft3 from '../assets/nft3.jpeg'
import nft4 from '../assets/nft4.jpeg'
import nft5 from '../assets/nft5.jpeg'
import nft6 from '../assets/nft6.jpeg'
import nft7 from '../assets/nft7.jpeg'
import nft8 from '../assets/nft8.jpeg'

export const nfts = [
    {
        id: 1,
        name: "NFT 1",
        description: "some description",
        price: 0.001,
        image: nft1,
    }, {
        id: 2,
        name: "NFT 2",
        description: "some description",
        price: 0.001,
        image: nft2,
    },
    {
        id: 3,
        name: "NFT 3",
        description: "some description",
        price: 0.001,
        image: nft3,
    }
    , {
        id: 4,
        name: "NFT 4",
        description: "some description",
        price: 0.001,
        image: nft4,
    }, {
        id: 5,
        name: "NFT 5",
        description: "some description",
        price: 0.001,
        image: nft5,
    },
    {
        id:6,
        name: "NFT 6",
        description: "some description",
        price: 0.001,
        image:nft6,
    },
    {
        id:7,
        name: "NFT 7",
        description: "some description",
        price: 0.001,
        image:nft7,
    },
    {
        id:8,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image:nft8,
    },
    {
        id:9,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image:nft8,
    },
    {
        id:10,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image:nft8,
    },
    {
        id:11,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image:nft8,
    },
    {
        id:12,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image:nft8,
    }
]

export const nftMetadata = [
    {
        name: "NFT 1",
        description: "some description",
        image: "https://ipfs.io/ipfs/bafybeiccb5x3jqh2hy2jmuxb7zccldbr4qah36msiv5rkjvd5jhyb6ibsa",
    }, {
        name: "NFT 2",
        description: "some description",
        image: "https://ipfs.io/ipfs/bafybeibdjreym4plh2p22fqpmbj3hxbqlbcbq6uvtlg63y522zsu4lr7m4",
    },
    {
        name: "NFT 3",
        description: "some description",
        image: "https://ipfs.io/ipfs/bafybeihmnu52esk5nhqyhdrdr6hmlv5h4korntmkqvy6467rhwcrr7o24a",
    }
    , {
        name: "NFT 4",
        description: "some description",
        image: "https://ipfs.io/ipfs/bafybeigrcgt3kbn6yk22yxuyum55ueq3nsrhtonpkfclj4a3ni4xpnkyba",
    }, {
        name: "NFT 5",
        description: "some description",
        image: "https://ipfs.io/ipfs/bafybeiduhrlzvghzwy7xocmbd3emnxzj4vit7zv6rhr3raqplvxd2r2wyq",
    },
    {
        name: "NFT 6",
        description: "some description",
        image:"https://ipfs.io/ipfs/bafybeiadqo55i7tcyrx2lhhyend3vp44jmwe3nvfdrty2gmkwh2ltsxeqa",
    },
    {
        name: "NFT 7",
        description: "some description",
        image:"https://ipfs.io/ipfs/bafkreifjyuqe6biki5qjwl7nvivv6wgsimpfka2jb6c624h3uca7juisfm",
    },
    {
        name: "NFT 8",
        description: "some description",
        image:"https://ipfs.io/ipfs/bafybeibicehzheet7fsdt36oeyn4gsx2esaltqg4qrn4clc3ujuljlbyky",
    }
]

export function getRandomNFTMetadata() {
    const randomIndex = Math.floor(Math.random() * nftMetadata.length);
    return nftMetadata[randomIndex];
  }