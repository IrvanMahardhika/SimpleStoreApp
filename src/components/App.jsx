import React,{Component} from "react";
import {Route, BrowserRouter} from "react-router-dom";
import {connect} from "react-redux";
import {keepLogin,getData} from "../action/index"

import Home from "./Home"
import Register from "./Register"
import Login from "./Login"
import Header from "./Header"
import Transtat from "./Transtat"
import Startsell from "./Startsell"
import Forgotpasswordstart from "./Forgotpasswordstart"
import Forgotpasswordend from "./Forgotpasswordend"
import Editprofile from "./Editprofile"
import Addproduct from "./Addproduct"
import Listproduct from "./Listproduct"
import Markdown from "./Markdown"


class App extends Component {

    state = {
        check : false
    }

    componentDidMount () {
        let storage = JSON.parse(localStorage.getItem("userData"))
        if (storage) {
            this.props.keepLogin(storage)
            this.props.getData()
        }
        this.setState({check:true})
    }

    render () {
        if (this.state.check) {
            return (
                <BrowserRouter>
                    <Header/>
                    <Route path="/" exact component={Home}/>
                    <Route path="/Register" component={Register}/>
                    <Route path="/Login" component={Login}/>
                    <Route path="/Transactionstatus" component={Transtat}/>
                    <Route path="/Startselling"  component={Startsell}/>
                    <Route path="/Forgotpasswordstart" component={Forgotpasswordstart} />
                    <Route path="/Forgotpasswordend/:userId" component={Forgotpasswordend} />
                    <Route path="/Editprofile" component={Editprofile} />
                    <Route path="/Addproduct" component={Addproduct} />
                    <Route path="/Listproduct" component={Listproduct} />
                    <Route path="/Markdown" component={Markdown} />
                </BrowserRouter>
            )
        } else {
            return <div><h1>Loading</h1></div>
        }
    }
}

export default connect(null,{keepLogin,getData})(App)
