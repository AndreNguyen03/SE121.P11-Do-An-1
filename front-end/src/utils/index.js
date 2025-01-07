import nft1 from '../assets/1.png'
import nft2 from '../assets/2.png'
import nft3 from '../assets/3.png'
import nft4 from '../assets/5.png'
import nft5 from '../assets/6.png'
import nft6 from '../assets/7.png'
import nft7 from '../assets/8.png'
import nft8 from '../assets/10.png'

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
        id: 6,
        name: "NFT 6",
        description: "some description",
        price: 0.001,
        image: nft6,
    },
    {
        id: 7,
        name: "NFT 7",
        description: "some description",
        price: 0.001,
        image: nft7,
    },
    {
        id: 8,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image: nft8,
    },
    {
        id: 9,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image: nft8,
    },
    {
        id: 10,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image: nft8,
    },
    {
        id: 11,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image: nft8,
    },
    {
        id: 12,
        name: "NFT 8",
        description: "some description",
        price: 0.001,
        image: nft8,
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
        image: "https://ipfs.io/ipfs/bafybeiadqo55i7tcyrx2lhhyend3vp44jmwe3nvfdrty2gmkwh2ltsxeqa",
    },
    {
        name: "NFT 7",
        description: "some description",
        image: "https://ipfs.io/ipfs/bafkreifjyuqe6biki5qjwl7nvivv6wgsimpfka2jb6c624h3uca7juisfm",
    },
    {
        name: "NFT 8",
        description: "some description",
        image: "https://ipfs.io/ipfs/bafybeibicehzheet7fsdt36oeyn4gsx2esaltqg4qrn4clc3ujuljlbyky",
    }
]

export function getRandomNFTMetadata() {
    const randomIndex = Math.floor(Math.random() * nftMetadata.length);
    return nftMetadata[randomIndex];
}


export const base64ToFile = (base64, fileName) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    // Tạo File từ Blob
    return new File([u8arr], fileName, { type: mime });
}

export const slugify = (text) => {
    return text
        .toLowerCase() // Chuyển tất cả các ký tự về chữ thường
        .trim() // Loại bỏ khoảng trắng ở đầu và cuối
        .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự không phải chữ cái, số hoặc dấu gạch ngang
        .replace(/[\s_-]+/g, '-') // Thay thế khoảng trắng và dấu gạch dưới thành dấu gạch ngang
        .replace(/^-+|-+$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
};

import { verifiedFetch } from '@helia/verified-fetch';

export async function fetchImageFromIPFS(ipfsLink) {
  try {
    // Chuyển đổi URL HTTP sang ipfs://
    const ipfsUrl = ipfsLink.replace('https://ipfs.io/ipfs/', 'ipfs://');

    // Fetch ảnh từ IPFS sử dụng verified-fetch
    const response = await verifiedFetch(ipfsUrl);

    // Kiểm tra xem phản hồi có OK không
    if (!response.ok) {
      throw new Error('Failed to fetch the image');
    }

    // Chuyển đổi dữ liệu từ response thành Blob (để xử lý ảnh)
    const imageBlob = await response.blob();
    
    // Tạo URL đối tượng để hiển thị ảnh
    const imageUrl = URL.createObjectURL(imageBlob);

    return imageUrl; // Trả về URL ảnh để sử dụng trong <img src={imageUrl} />
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}
