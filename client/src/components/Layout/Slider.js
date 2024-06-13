import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import './Slider.css';

const CustomSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slides = [
    { id: 1, image: 'https://via.placeholder.com/1920x1080?text=Slide+1', text: 'This is slide 1' },
    { id: 2, image: 'https://via.placeholder.com/1920x1080?text=Slide+2', text: 'This is slide 2' },
    { id: 3, image: 'https://via.placeholder.com/1920x1080?text=Slide+3', text: 'This is slide 3' },
  ];

  return (
    <Slider {...settings}>
      {slides.map(slide => (
        <div key={slide.id} className="slide">
          <img src={slide.image} alt={`Slide ${slide.id}`} />
          <div className="slide-text">{slide.text}</div>
        </div>
      ))}
    </Slider>
  );
};

export default CustomSlider;
