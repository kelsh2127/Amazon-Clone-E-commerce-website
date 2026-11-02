import React, { useContext } from 'react';
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import Class from './Header.module.css';
import LowerHeader from './lowerheader.jsx';
import { Link } from 'react-router-dom';
import { DataContext } from '../../components/Dataprovider/Dataprovider';
import {auth} from "../../Utility/firbase"

const Header = () => {
    const { state, dispatch } = useContext(DataContext);
    const { user, basket } = state;
    const totalItem = basket?.reduce((amount, item) => {
        return item.amount + amount;
    }, 0);

    // Handler for admin navigation
    const handleAdminClick = () => {
        window.location.href = '/admin';
    };

    return (
        <section className={Class.fixed}>
            <section>
                <div className={Class.header_container}>
                    {/* Logo and Delivery */}
                    <div className={Class.logo_container}>
                        <Link to="/">
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJEsLucn6b9xPwccsc6dyYNBBCfpJ8-tVMUQ&s" 
                                alt="amazon logo" 
                            />
                        </Link>
                        {/* Delivery section with icon */}
                        <div className={Class.delivery_logo}>
                            <span>
                                <MdLocationOn />
                            </span>
                            <div>
                                <p>Deliver to</p>
                                <span>Ethiopian</span>
                            </div>
                        </div>
                    </div>
                    {/* Search section */}
                    <div className={Class.search_container}>
                        <select name="" id="">
                            <option value="">All</option>
                        </select>
                        <input type="text" name="search" id="search" placeholder="Search Amazon" />
                        <button className={Class.search_button}><FaSearch /></button>
                    </div>
                    
                    {/* Flag and Language */}
                    <div className={Class.language_container}>
                        <img 
                            src="https://cdn.britannica.com/33/4833-050-F6E415FE/Flag-United-States-of-America.jpg" 
                            alt="USA flag" 
                        />
                        <section>
                            <select>
                                <option value="">EN</option>
                            </select>
                        </section>
                    </div>
                    
                    {/* Sign In */}
                    <Link to={ !user && "/signin"} className={Class.link}>
                        <div>
                            {
                                user ?(
                                    <>
                                     <p>Hello {user?.email?.split("@")[0]}</p>
                                  <span onClick={()=>auth.signOut()}>Sign Out</span>
                                    </>
                                ):(
                                    <>
                                    <p>Hello,Sign In</p>
                                    <span>Account & Lists <IoMdArrowDropdown /></span>
                                    </>
                                )
                            }
                        </div>


                    </Link>
                    
                    {/* Returns & Orders */}
                    <Link to="/orders" className={Class.link}>
                        <div>
                            <p>Returns</p>
                            <span>& Orders</span>
                        </div>
                    </Link>
                    
                    {/* Cart */}
                    <Link to="/cart" className={Class.cart_link}>
                        <FaShoppingCart />
                        {/* FIX 2: Add safe checking for basket.length */}
                        <span className={Class.cart_count}>{totalItem}</span>
                    </Link>
                </div>
            </section>
            <LowerHeader />
        </section>
    );
};

export default Header;




