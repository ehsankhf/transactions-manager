import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';

import { Auth } from '../Auth/Auth';
import { Requests } from '../Requests/Requests';
import { Transactions } from '../Transactions/Transactions';

import './App.scss';

interface Props {}

export const App: React.FC<Props> = ({}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/transactions">Transactions</Link>
              </li>
              <li>
                <Link to="/requests">Requests</Link>
              </li>
              <li>{isLoggedIn && <Link to="/login">Login</Link>}</li>
            </ul>
          </nav>
        </header>
        <Switch>
          {isLoggedIn ? (
            <>
              <Route exact path="/transactions">
                <Transactions />
              </Route>
              <Route exact path="/requests">
                <Requests />
              </Route>
              <Route>
                <Redirect to="/transactions" />
              </Route>
            </>
          ) : (
            <>
              <Route exact path="/login">
                <Auth />
              </Route>
              <Route>
                <Redirect to="/login" />
              </Route>
            </>
          )}
        </Switch>
      </Router>
    </div>
  );
};
