import React from 'react';
import classes from './Result.module.css';
import Layout from '../../components/LayOut/Layout.jsx';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { productUrl } from '../../APII/endpoin';
import { useState, useEffect } from 'react';
import ProductCard from '../../components/Product/ProductCard';
import Loader from '../../components/Loader/Loader'; // Import loader

export default function Result() {
  const { catagoryName } = useParams();
  const [Result, setResult] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true);
    axios.get(`${productUrl}/products/category/${catagoryName}`)
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [catagoryName]); // Added missing dependency

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <section>
        <h1 style={{ padding: "30px" }}>Result</h1>
        <p style={{ padding: "30px" }}>Category: {catagoryName}</p>
        <hr />
        <div className={classes.products_container}>
          {Result?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              renderDesc={false}
              renderAdd={true}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}