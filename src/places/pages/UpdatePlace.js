import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';

import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpiner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import Card from '../../shared/components/UIElements/Card';

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();

    const placeId = useParams().placeId;

    const history = useHistory();

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
        const fetchPlace = async () => {
            try{
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
                );
                setLoadedPlace(responseData.place);
                setFormData(
                    {
                    title: {
                        value: responseData.place.title,
                        isValid: true
                    },
                    description: {
                        value: responseData.place.description,
                        isValid: true
                    }
                }, true);
            }catch (err) {}
        }
        fetchPlace();
    }, [sendRequest, placeId, setFormData])

    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try{
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
                'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {   'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/' + auth.userId + '/places'); //redireciona para o início após o login
        }catch (err) {}
    }

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpiner/>
            </div>
        );
    }

    if (!loadedPlace && !error) {
        return (
            <div className="center">
                <Card>Could not find a place!</Card>
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {!isLoading && loadedPlace &&
                <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
                <Input 
                id="title"
                element="input"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={inputHandler}
                initialvalue={loadedPlace.title}
                initialvalid={true}
                />
                <Input 
                id="description"
                element="input"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (5 chars)."
                onInput={inputHandler}
                initialvalue={loadedPlace.description}
                initialvalid={true}
                />
                <Button type="submit" disabled={!formState.isValid}>
                    UPDATE PLACE
                </Button>
            </form>
            }
        </React.Fragment>
    );
};

export default UpdatePlace;