import React, { useContext, useEffect, useState } from 'react';
import classes from './Order.module.css';
import Layout from '../../components/LayOut/Layout';
import { db } from '../../Utility/firbase';
import { DataContext } from '../../components/Dataprovider/Dataprovider';

export default function Order() {
  const { state } = useContext(DataContext);
  const { user } = state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Fetch from Firestore with real-time updates
    const unsubscribe = db
      .collection('users')
      .doc(user.uid)
      .collection('orders')
      .orderBy('created', 'desc')
      .onSnapshot(
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(), // Spread data directly for easier access
            }));
            setOrders(firestoreOrders);
            setLoading(false);
          } else {
            // Fallback to localStorage
            try {
              const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
              const userOrders = localOrders.filter(order => order.userId === user.uid);
              setOrders(userOrders);
              setLoading(false);
            } catch (localError) {
              console.error('Error reading local orders:', localError);
              setOrders([]);
              setLoading(false);
            }
          }
        },
        (err) => {
          console.error('Firestore error:', err);
          // Fallback to localStorage
          try {
            const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
            const userOrders = localOrders.filter(order => order.userId === user.uid);
            setOrders(userOrders);
            setLoading(false);
          } catch (localError) {
            setError('Unable to load orders. Please check your connection.');
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, [user]);

  // Format date safely
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    try {
      if (timestamp?.toDate) {
        return timestamp.toDate().toLocaleString();
      }
      if (timestamp?.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      }
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString();
      }
      return 'Invalid date';
    } catch {
      return 'Date error';
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className={classes.container}>
          <div className={classes.orders_container}>
            <h2>Your Orders</h2>
            <div className={classes.loading}>Loading your orders...</div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <section className={classes.container}>
          <div className={classes.orders_container}>
            <h2>Your Orders</h2>
            <div className={classes.error}>{error}</div>
            <button onClick={() => window.location.reload()} className={classes.retryBtn}>
              Retry
            </button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <h2>Your Orders</h2>

          {!loading && orders.length === 0 && (
            <div className={classes.no_orders}>
              <p>You have no orders yet. Place an order to see it here.</p>
              <button onClick={() => window.location.href = '/'} className={classes.shopBtn}>
                Start Shopping
              </button>
            </div>
          )}

          <div className={classes.order_list}>
            {orders.map((order) => {
              const basketItems = order.basket || [];
              const totalAmount = order.amount || order.total || 0;
              const itemCount = basketItems.length;

              return (
                <div key={order.id} className={classes.order_card}>
                  <div className={classes.order_header}>
                    <div className={classes.order_id}>
                      <strong>Order ID:</strong> {order.id}
                    </div>
                    <div className={classes.order_date}>
                      <strong>Date:</strong> {formatDate(order.created)}
                    </div>
                    <div className={classes.order_total}>
                      <strong>Total:</strong> ${typeof totalAmount === 'number' ? totalAmount.toFixed(2) : totalAmount}
                    </div>
                    <div className={classes.order_status}>
                      <span className={classes.status_completed}>✓ Completed</span>
                    </div>
                  </div>

                  <div className={classes.order_items}>
                    {basketItems.map((item, index) => (
                      <div key={index} className={classes.order_item}>
                        <div className={classes.item_image_container}>
                          <img
                            src={item.image || 'https://via.placeholder.com/80?text=No+Image'}
                            alt={item.title || item.name || 'Product'}
                            className={classes.item_image}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                            }}
                          />
                        </div>
                        <div className={classes.item_details}>
                          <h4 className={classes.item_title}>
                            {item.title || item.name || item.productName || 'Product'}
                          </h4>
                          <div className={classes.item_meta}>
                            <span className={classes.item_quantity}>
                              Quantity: {item.amount || item.quantity || 1}
                            </span>
                            <span className={classes.item_price}>
                              Price: ${((item.price || 0) * (item.amount || 1)).toFixed(2)}
                            </span>
                          </div>
                          {item.color && <span className={classes.item_color}>Color: {item.color}</span>}
                          {item.size && <span className={classes.item_size}>Size: {item.size}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={classes.order_footer}>
                    <button 
                      onClick={() => window.location.href = `/order/${order.id}`}
                      className={classes.detailsBtn}
                    >
                      View Order Details
                    </button>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className={classes.buyAgainBtn}
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}