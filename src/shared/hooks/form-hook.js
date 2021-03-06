import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {

    //olhar aula 60 para entender melhor
    //pega o valor anterior do formIsValid e combina com o novo
    //tabela verdade => false + false = false/ false + true = false/ true + true = true
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true;
            for (const inputId in state.inputs) {
                //se conter um input que estaja undefined, ele desconsidera o mesmo e passa
                //pra próxima propriedade
                if (!state.inputs[inputId]) {
                    continue;
                }
                if ( inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid;
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: { value: action.value, isValid: action.isValid }
                },
                isValid: formIsValid
            };
        case 'SET_DATA':
            return {
              inputs: action.inputs,
              isValid: action.formIsValid  
            };
        default:
            return state;
    }
};


export const useForm = (initialInputs, initialFormValidity) => {

    //inputs = guarda se cada input está válido
    //isValid = se todo o formulário está válido
    const [formState, dispatch] = useReducer(formReducer, {
        //initial state que será atualizado com o useReducer
        inputs: initialInputs,
        isValid: initialFormValidity
    });

        //useCallback = set condição para re-render da página, sem o uso do CallBack viraria um loop
    //quando der o re-render ele não cria uma nova função e usa a antiga
    //caso fosse criada uma nova função o useEffect ia rodar novamente e cair em um loop

    //função para gerenciar os validators do formulário
    const inputHandler = useCallback((id, value, isValid) => {
        dispatch ({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        });
    }, []);

    const setFormData = useCallback((inputData, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            inputs: inputData,
            formIsValid: formValidity
        });
    },[]);

    return [formState, inputHandler,setFormData];
};