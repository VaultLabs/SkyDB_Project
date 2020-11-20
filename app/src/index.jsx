import React from 'react';
import ReactDOM from 'react-dom';
import { setConfig } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

setConfig({
  ignoreSFC: true,
  pureRender: true,
});

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
