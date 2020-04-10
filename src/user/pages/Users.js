import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';


const Users = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [loadedUsers, setLoadedUsers] = useState();

    //por padrão o fetch já é um get
    //não precisa nenhum tipo de headernem body, pq não estou enviando nenhum dado
    //NOTA: Não é uma boa prática utilizar async no useEffect
    //caso utilize uma promisse, fazer usso de uma função para isso
    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true);
            try{
                const response = await fetch('http://localhost:5000/api/users');

                //tem que usar o parser pois não vem json por padrão
                const responseData = await response.json();

                //uma resposta é ok se for do tipo 200
                //respostas com mensagem 400 ou 500 não são ok logo serão tratados como erro aqui
                if(!response.ok) {
                    throw new Error(responseData.message);//vai pro catch
                }

                setLoadedUsers(responseData.users);
            }catch(err) {
                setError(err.message);
            }
            setIsLoading(false);
        }
        sendRequest();
    }, []);

    const errorHandler = () => {
        setError(null);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler} />
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
