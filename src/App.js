import React, { useCallback, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

//Route = Define uma rota "path", é como um href
//Redirect = Qualquer coisa diferente que for digitada no endereço será redirecionada
//Switch = Quando uma rota for encontrada ao longo do código ele para nela

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import { AuthContext } from './shared/context/auth-context';

let logoutTimer;

const App = () => {

  //todo > 187 auth-hook
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExporationDate] = useState();
  const [userId, setUserID] = useState(false);

  //necessário utilizar o useCallback para evitar a criação de novas funções e loops infinitos
  //sem dependências pois esta função não precisará ser recriada
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserID(uid);
    //Date getTime => tempo em milisegundos > +1000 * 60 * 60 = 1h > * 12 > 12h
    //Se existir expirationDate é esse valor que quero usar para o token, caso contrário crio outro
    const tokenExpirationDateNew = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 12);
    //gravando token no localstorage para continuar logado mesmo depois do reload
    setTokenExporationDate(tokenExpirationDateNew);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDateNew.toISOString()
    }));
  },[]);

  const logout = useCallback(() => {
    setToken(null);
    setUserID(null);
    setTokenExporationDate(null);
    //quando logout apaga as credenciais (userId, token)
    localStorage.removeItem('userData');
  },[]);

  //auto logout
  useEffect(() => {
    if(token && tokenExpirationDate){
      //getTime() => retorna o tempo em milisegundos
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    }else{
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate])

  //seguindo o ciclo de vida, o useEffect roda depois ao final do render
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    //new Date(storedData.expiration) > new Date() 
    //===> se a data que eu tiver for maior que a data de "agora" eu faço o login com ela
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  let routes;

  //aplicando diferentes rotas para o usuário logado e nã logado
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/places/new" exact>
          <NewPlace/>
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace/>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
        </Route>
        <Route path="/auth">
          <Auth/>
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  /* para lembrar dos parâmetros
  createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {}
  */
  return (
    <AuthContext.Provider
    value={{
      isLoggedIn: !!token,
      token: token,
      userId: userId,
      login: login,
      logout: logout
    }}
    >
      <Router>
        <MainNavigation/>
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
