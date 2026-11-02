import React from 'react'
import { Catagoryinfos } from './CatagoryFullinfos'
import CatagoryCard from './CatagoryCard'
import classes from './Catagory.module.css'

export default function Catagory() {
  return (
    <section className={classes.Catagory_container}>
      {/* Dark overlay is in CSS ::before */}
      
      {/* New container for cards */}
      <div className={classes.cardsContainer}>
        {Catagoryinfos.map((infos, index) => {
          // Get unique categories (optional - if you want only one per category)
          // Remove this if you want all products
          return <CatagoryCard key={infos.id || index} data={infos} />
        })}
      </div>
    </section>
  )
}