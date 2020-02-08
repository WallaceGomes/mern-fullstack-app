import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

//Route = Define uma rota "path", é como um href
//Redirect = Qualquer coisa diferente que for digitada no endereço será redirecionada
//Switch = Quando uma rota for encontrada ao longo do código ele para nela

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';

const App = () => {
  return <Router>
    <Switch>
      <Route path="/" exact>
        <Users/>
      </Route>
      <Route path="/places/new" exact>
        <NewPlace/>
      </Route>
      <Redirect to="/" />
    </Switch>
  </Router>
;}

export default App;
