import React from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';

import './PlaceForm.css';

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
    const placeId = useParams().placeId;

    const indentifiedPlace = TEMP_PLACES.find(p => p.id === placeId);

    if (!indentifiedPlace) {
        return (
            <div className="center">
                <h2>Could not find a place!</h2>
            </div>
        );
    }

    return (
        <form className="place-form">
            <Input 
            id="title"
            element="input"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={() => {}}
            value={indentifiedPlace.title}
            valid={true}
            />
            <Input 
            id="description"
            element="input"
            label="Description"
            validators={[VALIDATOR_MINLENGTH()]}
            errorText="Please enter a valid description (5 chars)."
            onInput={() => {}}
            value={indentifiedPlace.description}
            valid={true}
            />
            <Button type="submit" disabled={true}>
                UPDATE PLACE
            </Button>
        </form>
    );
};

export default UpdatePlace;