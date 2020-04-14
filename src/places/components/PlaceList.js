import React from 'react';

import './PlaceList.css';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';

const PlaceList = props => {

    // Caso não exista nada na lista
    if (props.items.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>No Places found. Create one?</h2>
                    <Button to="places/new">Share Place</Button>
                </Card>
            </div>
        );
    }

    //props.items.map => passa por todos os items do array e executa x
    return (
        <ul className="place-list">
            {props.items.map(place =>(
                <PlaceItem
                    key={place.id}
                    id={place.id}
                    image={place.image}
                    title={place.title}
                    description={place.description}
                    address={place.address}
                    creatorId={place.creator}
                    coordinates={place.location}    
                />
            ))}
        </ul>
    );
};

export default PlaceList;