import React from 'react';

import './MainHeader.css';

const MainHeader = props => {

    // {props.children} = qualquer coisa que estiver dentro da tag onde 
    //este componente será usado
    return <header className="main-header"> {props.children} </header>;
};

export default MainHeader;