import React, { useContext, useState } from 'react';

import './Auth.css';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpiner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Card from '../../shared/components/UIElements/Card';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {

    //"importando" o context de auth
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
 
    const [formState, inputHandler, setFormData] = useForm({
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      } 
    }, false);

    const switchModeHandler = () => {
      //toda vez que muda do modo login para o modo signup tem que fazer um update no formData
      //para o campo do nome fazer parte do form corretamente
      //NOTA: executa antes do setLoginMode mode pois vai entrar caso esteja no modo signup
      //e precisa tirar o campo do nome e atualizar o state antes de mudar o formulário pois
      // pode causar erro de validade do form 
      if(!isLoginMode) {
        setFormData(
          {
            ...formState.inputs, //copia tudo que está no state do form
            //seta o nome para undefined mas ele ainda vai ser considerado no state do form
            //para isso nao acontecer tem que desconsiderar ele no form-hook
            name: undefined,
            image: undefined
          },
          //checa a validade dos outros campos
          formState.inputs.email.isValid && formState.inputs.password.isValid
        );
      } else {
        //caso esteja mudando o form para signup precisa copiar o state dos outros campos
        //e setar o form para false pois entra um novo campo de nome que está vazio e invalido
        //logo a validade do form vai ser false
        setFormData(
          {
            ...formState.inputs, //copia tudo que está no state do form
            name: { //inclui o novo campo de nome no state, inicialmente vazio e inválido
              value: '',
              isValid: false
            },
            image: {
              value: null,
              isValid: false
            }
          }, 
          false);
      }
      setIsLoginMode(prevMode => !prevMode);

      //NOTA: Se uma função conter multiplas mudanças no state o React executa tudo junto
      //para prevenir mudanças extras desencessárias
    };

    const authSubmitHandler = async event => {
        event.preventDefault();

        console.log(formState.inputs);
        
        if(isLoginMode) {
          try{
            const responseData = await sendRequest(
              'http://localhost:5000/api/users/login',
              'POST',
              JSON.stringify({
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            auth.login(responseData.user.id); //acessa o método de login no App.js
          } catch (err) {
          }
        } else {
          try{
            const responseData = await sendRequest(
              'http://localhost:5000/api/users/signup',
              'POST',
              JSON.stringify({
                name: formState.inputs.name.value,
                email: formState.inputs.email.value,
                password: formState.inputs.password.value
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            auth.login(responseData.user.id); //acessa o método de login no App.js
          } catch (err) {
          }
        }
    };

    //caso esteja no modo de Login, mostra o formulário de login e botao de trocar para signup
    //caso esteja no mode de signup, mostra o formulário de signup e botão de trocar para login
    //{isLoginMode ? 'LOGIN' : 'SIGNUP'} => operador ternário > {condição ? true : false}
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <Card className="authentication">
          {isLoading && <LoadingSpiner asOverlay/>}
            <h2>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</h2>
            <hr />
            <form className="auth-form" onSubmit={authSubmitHandler}>
              {!isLoginMode && (
                <Input
                id="name"
                element="input"
                label="Name"
                type="text"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name"
                onInput={inputHandler}
                />
              )}
              {!isLoginMode && <ImageUpload id="image" center errorText="Invalid uploaded image." onInput={inputHandler} />}
                <Input
                id="email"
                element="input"
                label="E-mail"
                type="email"
                validators={[VALIDATOR_EMAIL()]}
                onInput={inputHandler}
                errorText="Please valid email address"
                />
                <Input
                id="password"
                element="input"
                label="Password"
                type="password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                onInput={inputHandler}
                errorText="Password min 6 chars"
                />
                <Button type="submit" disabled={!formState.isValid} >
                    {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
        </Card>
      </React.Fragment>
    );

};

export default Auth;