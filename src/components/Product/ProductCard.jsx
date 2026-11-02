import React, { useContext } from 'react'
import Currencyfromat from '../CurrencyFormat/Currencyfromat'
import Rating from '@mui/material/Rating'
import {Link} from 'react-router-dom'
import classes from './Product.module.css'
import { DataContext } from '../Dataprovider/Dataprovider'
import { Type } from '../../Utility/action.type'

export default function ProductCard({product, flex, renderDesc, renderAdd}) {
  const {image, title, id, rating, price, description} = product;
  const { dispatch } = useContext(DataContext);

  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item: {  // Changed from 'payload' to 'item' to match reducer
        id: id,
        title: title,
        image: image,
        price: price,
        rating: rating,
        description: description
      }
    });
  };
  
  return (
    <div className={`${classes.card_container} ${flex ? classes.product_flexed : ''}`}>
      <Link to={`/products/${id}`}> 
        <img src={image} alt={title} className={classes.img_container} />
      </Link>
      <div>
        <h3>{title}</h3>
        {renderDesc && <div className={classes.description}>{description}</div>}
        <div className={classes.rating}>
          <Rating value={rating?.rate || 0} precision={0.1}/>
          <small>{rating?.count || 0}</small>
        </div>
        <div>
          <Currencyfromat amount={price}/>
        </div>
        {
          renderAdd && (
            <button className={classes.button} onClick={addToCart}>
              Add to cart
            </button>
          )
        }
      </div>
    </div>
  );
}