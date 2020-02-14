import React, { useReducer } from 'react';

import './Input.css';
import { validate } from '../../util/validators';


const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action, action.validators)
            };
        case 'TOUCH': {
            return {
                ...state,
                isTouched: true
            }
        }
        default:
            return state;
    }   
};

const Input = props => {

    //useReducer é usado quando o state precisa ser menipulado de uma forma mais complexa
    //ver mais sobre depois
    const [inputState, dispatch] = useReducer(inputReducer, {value: '', isTouched: false, isValid: false});

    const changeHandler = event => {
        dispatch({type: 'CHANGE', val: event.target.value, validators: props.validators});
    };

    const touchHandler = () => {
        dispatch ({
            type: 'TOUCH'
        });
    };

    //dependendo do props element que receber, renderiza input ou textarea
    const element = 
        props.element === 'input' ? (
            <input 
                id={props.id} 
                type={props.type} 
                placeholder={props.placeholder} 
                onChange={changeHandler} 
                onBlur={touchHandler}
                value={inputState.value}
            />
        ) : (
            <textarea 
                id={props.id} 
                rows={props.row || 3} 
                onChange={changeHandler}
                onBlur={touchHandler}
                value={inputState.value} 
            />
        );

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}` } >
            <label htmlFor={props.id}>{props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};

export default Input;

//poderia ser usado alguma biblioteca para forms como formik