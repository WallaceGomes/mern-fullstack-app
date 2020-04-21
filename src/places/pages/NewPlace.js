import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import LoadingSpiner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import './PlaceForm.css';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

const NewPlace = () => {

    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value:'',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try{
            const formData = new FormData(); //FormData = used to send diferent data types through request
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('creator', auth.userId);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(
                'http://localhost:5000/api/places',
                'POST',
                formData
            );
            history.push('/'); //redireciona para o início após o login
        }catch (err) {}

    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
            {isLoading && <LoadingSpiner asOverlay/>}
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
            <ImageUpload
            id="image"
            center
            errorText="Provide a valid image"
            onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
        </React.Fragment>
    );
};

export default NewPlace;
