import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import { img } from './img/data.js'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Carousel.css'; // Import the CSS file

function CarouselEff() {
  return (
    <div className="hero_img"> {/* Add the class here */}
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showIndicators={false}
        showThumbs={false}
        showStatus={false}
      >
        {img.map((imageItemLinks, index) => (
          <div key={index}>
            <img src={imageItemLinks} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default CarouselEff;