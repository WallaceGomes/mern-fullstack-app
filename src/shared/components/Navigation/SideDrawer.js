import React from 'react';
import ReactDOM from 'react-dom';

import './SideDrawer.css';

//adiciona animação na barra lateral
// props.show = se a barra deve ser mostrada ou não
//timeout = duração da animação
import { CSSTransition } from 'react-transition-group';

const SideDrawer = props => {
    const content = (
        <CSSTransition
        in={props.show}
        timeout={200}
        classNames="slide-in-left"
        mountOnEnter
        unmountOnExit
        >
            <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
        </CSSTransition>
    );

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;