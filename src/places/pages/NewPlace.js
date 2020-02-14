import React, { useCallback } from 'react';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';

import './NewPlace.css';

const NewPlace = () => {

    //useCallback = set condição para rerender da página, sem o uso do CallBack viraria um loop
    const titleInputHandler = useCallback((id, value, isValid) => {

    },[]);

    return (
        <form className="place-form">
            <Input 
            id="title"
            element="input" 
            type="text" 
            label="Title" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText="Please enter a valid title" 
            onInput={titleInputHandler}
            />
            <Input 
            id="description"
            element="textarea" 
            type="text" 
            label="Description" 
            validators={[VALIDATOR_REQUIRE(5)]} 
            errorText="Please enter a valid description" 
            onInput={titleInputHandler}
            />
        </form>
    );
};

export default NewPlace;
