import { useState, useCallback, useRef } from 'react';
import { useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    //useCallback = evitar que essa função seja recriada toda vez que um component
    // que utiliza este hook rerender 
    const sendRequest = useCallback(async (
        url,
        method = 'GET',
        body= null,
        headers = {}
        ) => {
        setIsLoading(true);
        
        //caso o usuário realise alguma ação inesperada durante a aperação
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try{
            const response = await fetch(url, {
                method: method,
                body: body,
                headers: headers,
                signal: httpAbortCtrl.signal
            });
    
            const responseData = response.json();
    
            if(!response.ok){
                throw new Error(responseData.message);
            }

            return responseData;
        }catch (err){
            setError(err.message);
        }
        setIsLoading(false);
    }, []);

    const clearError = () => {
        setError(null);
    };

    //useEffect também pode ser usado no unmount do componente
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError }
};