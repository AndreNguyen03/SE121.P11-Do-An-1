import express from 'express';

const router = express.Router();

// Route để lấy thông tin người dùng theo địa chỉ ví
router.get('/:ipfsHash', async (req, res) => {
  const ipfsUrl = `https://alchemy.mypinata.cloud/ipfs/${req.params.ipfsHash}`;
  try {
    const response = await fetch(ipfsUrl);
    
    // Kiểm tra nếu phản hồi thành công
    if (!response.ok) {
      console.log(`IPFS Gateway Error: ${response.status} - ${response.statusText}`);
      return res.status(response.status).send({ error: 'Failed to fetch IPFS data' });
    }

    // Kiểm tra Content-Type trước khi parse
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(data);
      res.send(data);
    } else {
      console.log('Non-JSON response received');
      res.status(400).send({ error: 'Non-JSON content returned from IPFS' });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default router;
