import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    //por padrão o fetch já é um get
    //não precisa nenhum tipo de headernem body, pq não estou enviando nenhum dado
    //NOTA: Não é uma boa prática utilizar async no useEffect
    //caso utilize uma promisse, fazer usso de uma função para isso
    useEffect(() => {

        const fetchUsers = async () => {
            
            try{
                //para uma operção get, não é necessário enviar mais nada por aqui
                // o hook já está configurado com valores padrões
                const responseData = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/users'
                );

                setLoadedUsers(responseData.users);
            }catch(err) {
            }
        }
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center" >
                    <LoadingSpinner/>
                </div>
            )}
            {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
        </React.Fragment>
    );
};

export default Users;
