import React from 'react'
import classes from './Catagory.module.css'
import { Link } from 'react-router-dom';

export default function CatagoryCard({ data }) {
  return (
    <div className={classes.catagory}>  
      {/* Fix: Use the original category name without replacing spaces with hyphens */}
      <Link to={`/category/${data.category}`}>
        <div className={classes.imageContainer}>
          <img src={data.image} alt={data.title} />
        </div>
        <h2>{data.title}</h2>
        <span className={classes.shopNow}>shop now</span>
      </Link>
    </div>
  )
}