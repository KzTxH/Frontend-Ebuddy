import React from 'react';
import Slider from 'react-slick';
import './Slider.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <Slider {...settings} className="slider">
      <div className="slide">
        <img src="https://via.placeholder.com/1920x1080" alt="Slide 1" />
        <div className="slide-text">
          <h1>Welcome to My App</h1>
          <p>This is a simple, elegant, and responsive app built with React and Bootstrap.</p>
        </div>
      </div>
      <div className="slide">
        <img src="https://via.placeholder.com/1920x1080" alt="Slide 2" />
        <div className="slide-text">
          <h1>Feature One</h1>
          <p>Description of feature one.</p>
        </div>
      </div>
      <div className="slide">
        <img src="https://via.placeholder.com/1920x1080" alt="Slide 3" />
        <div className="slide-text">
          <h1>Feature Two</h1>
          <p>Description of feature two.</p>
        </div>
      </div>
      <div className="slide">
        <img src="https://via.placeholder.com/1920x1080" alt="Slide 4" />
        <div className="slide-text">
          <h1>Feature Three</h1>
          <p>Description of feature three.</p>
        </div>
      </div>
    </Slider>
  );
};

export default SliderComponent;
