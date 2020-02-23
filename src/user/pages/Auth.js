import React from 'react';

import './Auth.css';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
import Card from '../../shared/components/UIElements/Card';

const Auth = () => {

    const [formState, inputHandler] = useForm({
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      } 
    }, false);

    const authSubmitHandler = event => {
        event.prevenDefault();
    };

    return (
        <Card className="authentication">
            <h2>Login</h2>
            <hr />
            <form className="auth-form" onSubmit={authSubmitHandler}>
                <Input
                id="email"
                element="input"
                label="E-mail"
                type="email"
                placeholder="Email"
                validators={[VALIDATOR_EMAIL()]}
                onInput={inputHandler}
                errorText="Please valid email address"
                />
                <Input
                id="password"
                element="input"
                label="password"
                type="password"
                placeholder="Password"
                validators={[VALIDATOR_MINLENGTH(5)]}
                onInput={inputHandler}
                errorText="Password min 5 chars"
                />
                <Button type="submit" disable={!formState.isValid} >
                    LOGIN
                </Button>
        </form>
        </Card>
    );

};

export default Auth;