import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Test one component at a time
import Landing from './Pages/Landing/landing'
import Auth from './Pages/Auth/Auth'
import Payment from './Pages/Payment/Payment'
import Orders from './Pages/Orders/Order'
import Cart from './Pages/Cart/Cart'
import Results from './Pages/Result/Result'
import ProductDetail from './Pages/ProductDetail/ProductDetail'
import PaymentSuccess from './components/PaymentSuccess/paymentsucess' // Fixed path
import Checkout from './components/Checkout/Checkout' 
import Productrout from './components/productrout/productrout'
import Admin from './Pages/Admin/Admin'
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Auth />} />
        <Route
          path="/payment"
          element={
            <Productrout msg="You must log in to access payment" redirect="/payment">
              <Payment />
            </Productrout>
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/orders"
          element={
            <Productrout msg="You must log in to view your orders" redirect="/orders">
              <Orders />
            </Productrout>
          }
        /> 
        <Route path="/category/:catagoryName" element={<Results />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}