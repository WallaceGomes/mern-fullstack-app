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

const App = () => {

  const [token, setToken] = useState(false);
  const [userId, setUserID] = useState(false);

  //necessário utilizar o useCallback para evitar a criação de novas funções e loops infinitos
  //sem dependências pois esta função não precisará ser recriada
  const login = useCallback((uid, token) => {
    setToken(token);
    //gravando token no localstorage para continuar logado mesmo depois do reload
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token
    }));
    setUserID(uid);
  },[]);

  const logout = useCallback(() => {
    setToken(null);
    setUserID(null);
    //quando logout apaga as credenciais (userId, token)
    localStorage.removeItem('userData');
  },[]);

  //seguindo o ciclo de vida, o useEffect roda depois ao final do render
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if(storedData && storedData.token){
      login(storedData.userId, storedData.token);
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
