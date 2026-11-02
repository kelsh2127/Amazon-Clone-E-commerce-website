import React from 'react'
import { IoMenu } from "react-icons/io5";
import Class from './Header.module.css'
export default function lowerheader() {
  // Handler for admin navigation (copied from Header)
  const handleAdminClick = () => {
    window.location.href = '/admin';
  };
  return (
    <div className={Class.lower_container}>
      <ul>
        <li onClick={handleAdminClick} style={{cursor:'pointer', display:'flex', alignItems:'center', gap:'4px'}}>
            <IoMenu />
            <p style={{margin:0}}>ALL</p>
        </li>
        <li>Today's Deals</li>
        <li>Customer Service</li>
        <li>Gift Cards</li>
        <li>Sell</li>
      </ul>
    </div>
  )
}
