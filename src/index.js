import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { createHistory } from 'history';
import Root from 'Root';

const rootEl = document.getElementById('app');

const history = createHistory();

render(<Root history={history} />, rootEl);
