import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';
import classes from './Product.module.css';
import Loader from '../Loader/Loader'; // Import your loader

export default function Product() {
  const [Products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true); // Changed to true initially
  
  useEffect(() => {
    setLoading(true);
    axios.get('https://fakestoreapi.com/products')
      .then((res) => {
        setproducts(res.data);
        setLoading(false);
      }).catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <section className={classes.products_container}>
      {Products.map((singleproduct) => {
        return <ProductCard 
        renderAdd={true}
        product={singleproduct} key={singleproduct.id} />;
      })}
    </section>
  );
}