import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Home } from './Home';
import { Generate } from './Generate';
import { Resolve } from './Resolve';

export function Pages() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/generate/:type">
          <Generate />
        </Route>

        <Route exact path="/:did">
          <Resolve />
        </Route>
      </Switch>
    </Router>
  );
}
