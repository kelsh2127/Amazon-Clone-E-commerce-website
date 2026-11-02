// src/components/LayOut/LayOut.jsx
import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useLocation } from 'react-router-dom';

export default function LayOut({ children }) {
  const location = useLocation();
  
  // RESTRICTED: Footer only shows on EXACT home page
  // Block footer on cart, checkout, payment, orders, admin, etc.
  const restrictedPages = ['/cart', '/checkout', '/payment', '/orders', '/admin', '/signin'];
  const showFooter = location.pathname === '/' && !restrictedPages.includes(location.pathname);
  
  return (
    <div>
      <Header />
      {children}
      {showFooter && <Footer />}
    </div>
  );
}