import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import loadable from '@loadable/component';
import MainLayout from 'layouts';

const routes = [
  // Feed
  {
    path: '/browser',
    component: loadable(() => import('pages/Browser')),
    exact: true,
  },
  // Home
  {
    path: '/map',
    component: loadable(() => import('pages/Map')),
    exact: true,
  },
];

const Router = (props) => {
  const { history } = props;

  return (
    <ConnectedRouter history={history}>
      <MainLayout>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/map" />} />
          {routes.map((route) => (
            <Route
              path={route.path}
              component={route.component}
              key={route.path}
              exact={route.exact}
            />
          ))}
        </Switch>
      </MainLayout>
    </ConnectedRouter>
  );
};

export default Router;
