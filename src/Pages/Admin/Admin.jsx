import React, { useState } from 'react';
import styles from './Admin.module.css';

export default function Admin() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2>Admin Panel</h2>
        <ul>
          <li className={tab === 'dashboard' ? styles.active : ''} onClick={() => setTab('dashboard')}>Dashboard</li>
          <li className={tab === 'products' ? styles.active : ''} onClick={() => setTab('products')}>Products</li>
          <li className={tab === 'orders' ? styles.active : ''} onClick={() => setTab('orders')}>Orders</li>
          <li className={tab === 'users' ? styles.active : ''} onClick={() => setTab('users')}>Users</li>
        </ul>
      </aside>
      <main className={styles.mainContent}>
        {tab === 'dashboard' && (
          <section>
            <h1>Dashboard</h1>
            <p>Welcome to the admin dashboard. Here you can manage products, orders, and users.</p>
          </section>
        )}
        {tab === 'products' && (
          <section>
            <h1>Products</h1>
            <p>View, add, edit, or delete products here.</p>
            {/* Product management UI goes here */}
          </section>
        )}
        {tab === 'orders' && (
          <section>
            <h1>Orders</h1>
            <p>View and manage customer orders here.</p>
            {/* Orders management UI goes here */}
          </section>
        )}
        {tab === 'users' && (
          <section>
            <h1>Users</h1>
            <p>View and manage registered users here.</p>
            {/* Users management UI goes here */}
          </section>
        )}
      </main>
    </div>
  );
}
