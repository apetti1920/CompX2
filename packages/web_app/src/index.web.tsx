import React from 'react';
import ReactDOM from 'react-dom';
import App from "./app/app.web";
import store from './store'

import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('app-root'))