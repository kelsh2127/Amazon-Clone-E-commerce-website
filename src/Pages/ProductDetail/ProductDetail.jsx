import React from 'react';
import Layout from '../../components/LayOut/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { productUrl } from '../../APII/endpoin';
import { useState, useEffect } from 'react';
import ProductCard from '../../components/Product/ProductCard';
import classes from '../../components/Product/Product.module.css';
import Loader from '../../components/Loader/Loader'; // Import loader

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    axios.get(`${productUrl}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [productId]);
  
  if (loading) {
    return (
      <Layout>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <Loader />
       
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className={classes.message}>Product not found</div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className={classes.products_container}>
        <ProductCard product={product} flex={true}
        renderDesc={true}
        renderAdd={true}
        />

      </div>
    </Layout>
  );
}