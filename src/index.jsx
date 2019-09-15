import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {Provider} from "react-redux";
import {createStore} from "redux";

import App from "./components/App"
import reducers from "./reducers/index"

const STORE = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )

ReactDOM.render(
    <Provider store={STORE}>
        <App/>
    </Provider>, 
    document.getElementById('root')
)