import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import NFTCard from '../reuse-component/NFTCard';
import { nfts } from '../../utils';

function TrendingNFTs() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500, // Speed of the sliding animation (in ms)
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, // Delay between each auto-scroll (in ms)
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1050,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 450,
                settings: {
                    slidesToShow: 1, 
                    centerMode: true,
                }
            }
        ]
    };
  return (
    <div className='mt-10 lg:mt-20'>
    <h1 className='text-black text-xl lg:text-3xl font-semibold mb-5'>Trending NFTs</h1>
    <div className="carousel-container">
        <Slider {...settings}>
            {nfts.map((nft) => (
                <div key={nft.id}>
                    <NFTCard
                        nft={{
                            metadata: {
                                image: nft.image,
                                name: nft.name,
                            },
                            price: nft.price,
                            isListed: true,
                        }}
                    />
                </div>
            ))}
        </Slider>  
    </div>
</div>
  )
}

export default TrendingNFTs