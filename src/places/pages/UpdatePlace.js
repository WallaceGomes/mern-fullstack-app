import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';

import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';

const TEMP_PLACES = [
    {
        id: 'p1',
        title: 'Imagem Teste',
        description: 'Descrição da imagem!',
        imageUrl: 'https://media.gettyimages.com/photos/empire-state-building-at-sunset-picture-id171080501?s=612x612',
        address: 'Endereço',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Imagem Teste 2',
        description: 'Descrição da imagem 2!',
        imageUrl: 'https://media.gettyimages.com/photos/empire-state-building-at-sunset-picture-id171080501?s=612x612',
        address: 'Endereço',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];


const UpdatePlace = () => {

    const [isLoading, setIsLoading] = useState(true);

    const placeId = useParams().placeId;

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

    //movido temporáriamente para simular um atraso no recebimento dos dados do form
    const indentifiedPlace = TEMP_PLACES.find(p => p.id === placeId);

    //usando o setFormData para atribuir os valores carregados após o render da página
    //useEffect impede que o componente renderize novamente após os dados recebidos???
    useEffect(() => {
        //se identifiedPlace existir ok
        if (indentifiedPlace) {
            setFormData(
                {
                title: {
                    value: indentifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: indentifiedPlace.description,
                    isValid: true
                }
            }, true);
        }
        setIsLoading(false)
    }, [setFormData, indentifiedPlace]);

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    if (!indentifiedPlace) {
        return (
            <div className="center">
                <Card>Could not find a place!</Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="center">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
            <Input 
            id="title"
            element="input"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialvalue={formState.inputs.title.value}
            initialvalid={formState.inputs.title.isValid}
            />
            <Input 
            id="description"
            element="input"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (5 chars)."
            onInput={inputHandler}
            initialvalue={formState.inputs.description.value}
            initialvalid={formState.inputs.description.isValid}
            />
            <Button type="submit" disabled={!formState.isValid}>
                UPDATE PLACE
            </Button>
        </form>
    );
};

export default UpdatePlace;