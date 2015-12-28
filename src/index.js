import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import Root from 'Root';

ReactDOM.render(
    <Root history={createHistory()} />, document.getElementById('app')
);
