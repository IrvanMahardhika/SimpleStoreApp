import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {Provider} from "react-redux";
import {createStore,applyMiddleware,compose} from "redux";
import thunk from "redux-thunk";


import App from "./components/App"
import reducers from "./reducers/index"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const STORE = createStore(
    reducers,
    composeEnhancers(applyMiddleware(thunk))
    )

ReactDOM.render(
    <Provider store={STORE}>
        <App/>
    </Provider>, 
    document.getElementById('root')
)