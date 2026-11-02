import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Brand Section */}
        <div className={styles.brandSection}>
          <h3 className={styles.brandName}>AMAZON CLONE E-commerce</h3>
          <p className={styles.brandDesc}>
            Premium online shopping experience with quality products,
             exclusive deals, and exceptional customer service.
          </p>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook" className={styles.socialIcon}>📘</a>
            <a href="#" aria-label="Instagram" className={styles.socialIcon}>📸</a>
            <a href="#" aria-label="Pinterest" className={styles.socialIcon}>📌</a>
            <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>🔗</a>
            <a href="#" aria-label="YouTube" className={styles.socialIcon}>▶️</a>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className={styles.footerGrid}>
          {/* Quick Links */}
          <div className={styles.footerColumn}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">Services</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className={styles.footerColumn}>
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Return Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className={styles.footerColumn}>
            <h4>Newsletter</h4>
            <p className={styles.newsletterText}>Subscribe to get exclusive offers and updates</p>
            <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className={styles.newsletterInput} 
                required 
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} GHIYON E-commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}