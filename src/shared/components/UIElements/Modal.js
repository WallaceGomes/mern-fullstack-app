import React from 'react';
import ReactDOM from 'react-dom';

import './Modal.css';
import Backdrop from './Backdrop';
import { CSSTransition } from 'react-transition-group';

const ModalOverlay = props => {
    // className={`modal ${props.className}`} == carrega o modal do css ou uma classe passada por props
    //className={`modal__header ${props.headerClass}`} == a mesma coisa
    // props.onSubmit ? props.onSubmit : event => event.preventDefault
    // se eu tiver uma props onSubmit executo preventDefault para não carregar a pagina
    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={
                props.onSubmit ? props.onSubmit : event => event.preventDefault()
            }>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal__footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
            </form>
        </div>
    );

    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

// <ModalOverlay {...props}/> pega as props do modal e passa para ModalOverlay
const Modal = props => {
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
            in={props.show}
            mountOnEnter
            unmountOnExit
            timeout={200}
            classNames="modal"
            >
                <ModalOverlay {...props}/>
            </CSSTransition>
        </React.Fragment>
    );
};

export default Modal;