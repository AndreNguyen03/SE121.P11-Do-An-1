import axios from 'axios';
import FormData from 'form-data';

const PINATA_JWT = import.meta.env.VITE_JWT;

export async function uploadMetadataToPinata(metadata) {
    const form = new FormData();
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    form.append('file', blob, 'metadata.json');

    const headers = {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'multipart/form-data',
    };

    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
            headers: headers,
        });
        return response.data.IpfsHash;  // Trả về URI của metadata đã upload
    } catch (error) {
        console.error('Error uploading metadata:', error.response ? error.response.data : error);
        throw error;
    }
}
