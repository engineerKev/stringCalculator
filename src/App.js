import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';

import './App.css';

import StringCalculator from './containers/StringCalculator/StringCalculator';
import Layout from './components/Layout/Layout';


const app = (props) => {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/" component={StringCalculator} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default app;
