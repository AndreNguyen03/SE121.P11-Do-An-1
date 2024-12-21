import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import NFTCard from '../components/reuse-component/NFTCard';
import { fetchAllListedNFTs } from '../utils/blockchain';
import { setNfts, setLoading } from '../store/nftSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function Discovery() {
  const dispatch = useDispatch();
  const { nfts, loading } = useSelector((state) => state.nft);

  // New state for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of NFTs to show per page

  useEffect(() => {
    if (nfts.length === 0 && !loading) {
      dispatch(setLoading(true));

      const loadNFTs = async () => {
        try {
          const listedNFTs = await fetchAllListedNFTs();
          if (listedNFTs.length > 0) {
            dispatch(setNfts(listedNFTs));
          }
        } catch (error) {
          console.error('Error fetching NFTs:', error);
        } finally {
          dispatch(setLoading(false));
        }
      };

      loadNFTs();
    }
  }, [dispatch, nfts.length, loading]);

  // Filter NFTs by search term
  const filteredNFTs = nfts.filter((nft) =>
    nft.metadata.name && nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate NFTs
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNFTs = filteredNFTs.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredNFTs.length / itemsPerPage);

  return (
    <Layout className={'m-auto'}>
      <h1 className="text-4xl font-bold">Buy NFTs</h1>
      <h3 className="pb-3">Browse and buy NFTs from this collection.</h3>

      {/* Search Bar */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search NFTs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 w-full rounded-lg"
        />
      </div>

      {/* NFT Grid */}
      <div className="h-[800px] w-[1600px]">
        <div className="h-full w-full grid grid-cols-5 gap-10">
          <div className="h-full lg:col-span-5 col-span-2">
            <div className="w-full grid grid-cols-2 gap-5 lg:grid-cols-5">
              {loading ? (
                [...Array(10)].map((_, index) => (
                  <div key={index}>
                    <Skeleton height={350} />
                  </div>
                ))
              ) : paginatedNFTs && paginatedNFTs.length > 0 ? (
                paginatedNFTs.map((nft) => (
                  <div key={nft.tokenId}>
                    <NFTCard nft={nft} />
                  </div>
                ))
              ) : (
                <p>No NFTs available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className=" flex justify-center items-center space-x-3">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Next
        </button>
      </div>
    </Layout>
  );
}

export default Discovery;
