import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// console.log('STARTED index.jsx');
ReactDOM.render(
  <App />,
  document.getElementById('app'),
);

module.hot.accept();
