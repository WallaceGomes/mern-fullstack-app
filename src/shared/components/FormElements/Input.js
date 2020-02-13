import React from 'react';

import './Input.css';

const Input = props => {
    //dependendo do props element que receber, renderiza input ou textarea
    const element = 
        props.element === 'input' ? (
            <input id={props.id} type={props.type} placeholder={props.placeholder} />
        ) : (
            <textarea id={props.id} rows={props.row || 3} />
        );

    return (
        <div className={`form-control`} >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
        </div>
    );
};

export default Input;

//poderia ser usado alguma biblioteca para forms como formik