import React, { useCallback, useState } from 'react';
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserID] = useState(false);
  //necessário utilizar o useCallback para evitar a criação de novas funções e loops infinitos
  //sem dependências pois esta função não precisará ser recriada
  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserID(uid);
  },[]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserID(null);
  },[]);

  let routes;

  //aplicando diferentes rotas para o usuário logado e nã logado
  if (isLoggedIn) {
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
      isLoggedIn: isLoggedIn,
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
