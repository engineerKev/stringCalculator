import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';

import WithCustomDelimiter from './containers/StringCalculator/WithCustomDelimiter/WithCustomDelimiter';
import Layout from './components/Layout/Layout';


const app = (props) => {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route path="/" component={WithCustomDelimiter} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default app;
