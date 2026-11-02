import React from 'react';
import classes from './Cart.module.css';
import LayOut from '../../components/LayOut/LayOut';
import { DataContext } from '../../components/Dataprovider/Dataprovider';
import { useContext } from 'react';
import ProductCard from '../../components/Product/ProductCard';
import Currencyfromat from '../../components/CurrencyFormat/Currencyfromat';
import { Link } from 'react-router-dom';
import { Type } from '../../Utility/action.type';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

export default function Cart() {
  const { state, dispatch } = useContext(DataContext);
  const { basket, user } = state; 
  
  const total = basket.reduce((amount, item) => 
    item.price * item.amount + amount, 0);
  
  const increment = (item) => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item
    });
  };
  
  const decrement = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id
    });
  };
  
  return (
    <LayOut>
      <section className={classes.container}> 
        <div className={classes.cart_container}>
          <h2>Hello</h2>
          <h3>Your shopping basket</h3>
          <hr />
          {
            basket?.length === 0 ? 
              <p>Your basket is empty</p> : 
              basket?.map((item, i) => {
                return (
                  <section key={i} className={classes.cart_product}>
                    <ProductCard
                      product={item}
                      renderDesc={true}
                      renderAdd={false}
                      flex={true}
                    />
                    <div className={classes.btn_container}>
                      <button  className={classes.btn}   onClick={() => increment(item)}><IoIosArrowUp size={25} /></button>
                      <span>{item.amount}</span>
                      <button className={classes.btn}     onClick={() => decrement(item.id)}><IoIosArrowDown size={25} /></button>
                    </div>
                  </section>
                );
              })
          }
        </div>
        {
          basket?.length !== 0 && (
            <div className={classes.subtotal}>
              <div>
                <span>Subtotal ({basket?.length} {basket?.length === 1 ? 'item' : 'items'}): </span>
                <Currencyfromat amount={total} />
              </div>
              <div>
                <input type="checkbox" id="gift" />
                <label htmlFor="gift">This order contains a gift</label>
              </div>
              <Link to="/payment">Continue to checkout</Link>
            </div>
          )
        }
      </section>
    </LayOut>
  );
}