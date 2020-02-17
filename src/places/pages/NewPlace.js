import React, { useCallback, useReducer } from 'react';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';

import './NewPlace.css';

const formReducer = (state, action) => {

    //olhar aula 60 para entender melhor
    //pega o valor anterior do formIsValid e combina com o novo
    //tabela verdade => false + false = false/ false + true = false/ true + true = true
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                if ( inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
        default:
            return state;
    }
};

const NewPlace = () => {

    //inputs = guarda se cada input está válido
    //isValid = se todo o formulário está válido
    const [formState, dispatch] = useReducer(formReducer, {
        //initial state que será atualizado com o useReducer
        inputs: {
            title: {
                value:'',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            }
        },
        isValid: false
    });

    //useCallback = set condição para re-render da página, sem o uso do CallBack viraria um loop
    //quando der o re-render ele não cria uma nova função e usa a antiga
    //caso fosse criada uma nova função o useEffect ia rodar novamente e cair em um loop

    //função para gerenciar os validators do formulário
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch ({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        });
    }, []);

    const placeSubmitHandler = event => {
        event.preventDefaut();
        console.log(formState.inputs); //aqui que vai enviar pro backend
    };

    return (
        <form className="place-form" onSubmit={placeSubmitHandler}>
            <Input 
            id="title"
            element="input"
            label="Title" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid title" 
            onInput={inputHandler}
            />
            <Input 
            id="description"
            element="textarea"
            label="Description" 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText="Please enter a valid description (5 caracters)" 
            onInput={inputHandler}
            />
             <Input 
            id="address"
            element="input" 
            label="Address" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid address" 
            onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
    );
};

export default NewPlace;
