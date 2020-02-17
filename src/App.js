import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

//Route = Define uma rota "path", é como um href
//Redirect = Qualquer coisa diferente que for digitada no endereço será redirecionada
//Switch = Quando uma rota for encontrada ao longo do código ele para nela

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';

const App = () => {
  return (
    <Router>
      <MainNavigation/>
      <main>
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
      </main>
    </Router>
  );
}

export default App;
