import React,{Component} from "react";
import {Route, BrowserRouter} from "react-router-dom";

import Home from "./Home"
import Register from "./Register"
import Login from "./Login"
import Header from "./Header"
import Transtat from "./Transtat"
import Startsell from "./Startsell"


class App extends Component {
    render () {
        return (
            <BrowserRouter>
                <Header/>
                <Route path="/" exact component={Home}/>
                <Route path="/Register" component={Register}/>
                <Route path="/Login" component={Login}/>
                <Route path="/Transactionstatus" component={Transtat}/>
                <Route path="/Startselling"  component={Startsell}/>
            </BrowserRouter>
        )
    }
}

export default App
