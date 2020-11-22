import React from 'react';
import { hot } from 'react-hot-loader/root';
// Apollo
import ApolloClient from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
// Redux and Redux-saga
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from 'core/redux/sagas';
import rootReducer, { history } from 'core/redux/reducers';
import { createLogger } from 'redux-logger';
// Router
import { routerMiddleware } from 'connected-react-router';
import Router from './router';

import './global.scss';

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
  options: {
    reconnect: true,
  },
});
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_HTTP_ENDPOINT,
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [sagaMiddleware, routeMiddleware];

const logger = createLogger({
  collapsed: (getState, action) => action.type === 'settings/ETH_RATE_UPDATE',
});

if (process.env.NODE_ENV === 'development' && true) {
  middlewares.push(logger);
}

const store = createStore(rootReducer, compose(applyMiddleware(...middlewares)));

sagaMiddleware.run(rootSaga);

function App() {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Router history={history} />
      </ApolloProvider>
    </Provider>
  );
}

export default hot(App);

export { store, history };
