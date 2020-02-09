import React from 'react';

import './Card.css';

const Card = props => {

  //aceita um estilo e da merge com os seus
  return (
    <div className={`card ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
