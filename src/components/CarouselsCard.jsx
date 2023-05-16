// create a component for the carousels geting Cards components as a props and return the carousels
import React from "react";
import { Carousel } from "react-bootstrap";
import "../scss/components/carouselsCard.scss";

const CarouselsCard = ({ cards, interval }) => {
  return (
    <Carousel
      className="carousel"
      indicators={true}
      controls={false}
      touch={true}
      slide={true}
      interval={interval}
      keyboard={true}
      pause="hover"
    >
      {cards && cards.map((card, index) => (
        <Carousel.Item key={index}>{card}</Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselsCard;
