import React from 'react'
import Layout from '../components/layout/Layout'
import Hero from '../components/LandingPage/Hero'
import TrendingNFTs from '../components/LandingPage/TrendingNFTs'

function LandingPage() {
  return (
    <Layout>
        <Hero/>
        <TrendingNFTs />
    </Layout>
  )
}

export default LandingPage