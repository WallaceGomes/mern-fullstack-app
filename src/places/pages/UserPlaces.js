import React from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';

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

const UserPlaces = () => {

    //useParams = analisa a rota e pega oque é passado
    const userId = useParams().userId;
    //filtra o conteúdo carregado e pega apenas os do userId
    const loadedPlaces = TEMP_PLACES.filter(place => place.creator === userId);

    return (
        <PlaceList items={loadedPlaces} />
    );
};

export default UserPlaces;