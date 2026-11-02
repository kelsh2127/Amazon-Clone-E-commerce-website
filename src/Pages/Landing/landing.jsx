import React from 'react'
import Layout from '../../components/LayOut/Layout'
import Header from '../../components/Header/Header'
import Carousel from '../../components/Carousel/Carousel'
import Catagory from '../../components/Catagory/Catagory'
import Product from '../../components/Product/Product'

export default function Landing() {  // Capitalized 'Landing' (was 'landing')
  return (
    <Layout>
      {/* <Header/> */}
      <Carousel/>
      <Catagory/>
      <Product/>
    </Layout>
  )
}