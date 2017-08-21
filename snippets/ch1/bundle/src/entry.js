import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

let rootNode = document.getElementById('root');

let renderApp = (Component) => {
  ReactDOM.render(
      <Component/>
  , rootNode);
};

renderApp(App);
