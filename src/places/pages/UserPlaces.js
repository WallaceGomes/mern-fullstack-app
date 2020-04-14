import React, { useState, useEffect } from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';

// const TEMP_PLACES = [
//     {
//         id: 'p1',
//         title: 'Imagem Teste',
//         description: 'Descrição da imagem!',
//         imageUrl: 'https://media.gettyimages.com/photos/empire-state-building-at-sunset-picture-id171080501?s=612x612',
//         address: 'Endereço',
//         location: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: 'Imagem Teste 2',
//         description: 'Descrição da imagem 2!',
//         imageUrl: 'https://media.gettyimages.com/photos/empire-state-building-at-sunset-picture-id171080501?s=612x612',
//         address: 'Endereço',
//         location: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u2'
//     }
// ];

import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = async () => {

    //useParams = analisa a rota e pega oque é passado
    const userId = useParams().userId;
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const {loadedPlaces, setLoadedPLaces} = useState();

    useEffect(() => {
        const fetchPlaces = async () => {
            try{
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/user/${userId}`
                );
                setLoadedPLaces(responseData.places);
            }catch(err) {}
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center" >
                    <LoadingSpinner/>
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
        </React.Fragment>
    );
};

export default UserPlaces;