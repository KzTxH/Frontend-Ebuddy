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
    { id: 1, image: 'https://thuthuatnhanh.com/wp-content/uploads/2020/09/hinh-nen-gai-xinh-hd.jpg', text: 'This is slide 1' },
    { id: 2, image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNBjmnS3O9f_BcfNaIqp2PqpxY_nVY37YcrfXSUUJy77fnLgS9AwIB0xuiS9SNusBD_MPDXuaYk3SblH3LZrXT7K9se4VvOC06RKvnB_O9tIO_TYbtiVIjgglMvf7U4Tk8W_IDozcqRIAt/s1600/hinh-nen-girl-xinh-full-hd-cho-laptop_emdep4k+%25281%2529.jpg', text: 'This is slide 2' },
    { id: 3, image: 'https://1.bp.blogspot.com/-cRSnWwRpD34/XpmW-4G-yXI/AAAAAAAAASk/8FGWX3THS9Y3WPsTABHKk6IOTtPoYhDwQCLcBGAsYHQ/s1600/hinh-nen-girl-xinh-full-hd-cho-laptop_emdep4k%2B%252821%2529.jpg', text: 'This is slide 3' },
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
