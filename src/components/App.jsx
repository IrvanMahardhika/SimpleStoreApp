import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import { keepLogin, getData } from "../action/index"
import { getCartLogin, getCartNonLogin, keepCart } from "../action/tran"

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
import Productdetail from "./Productdetail"
import Cart from "./Cart"
import Checkout from "./Checkout"


class App extends Component {

    state = {
        check: false
    }

    componentDidMount() {
        let localUser = localStorage.getItem("localUser")
        if (!localUser) {
            let random
            do {
                random = parseInt(Math.random() * 1000000).toString()
            } while (random < 100000);
            localStorage.setItem("localUser", random);
        }
        let storage = JSON.parse(localStorage.getItem("userData"))
        let cart = JSON.parse(localStorage.getItem("cart"))
        let cartLogin = JSON.parse(localStorage.getItem("cartLogin"))
        if (storage) {
            if (cartLogin) {
                this.props.keepLogin(storage)
                this.props.getData()
                this.props.keepCart(cartLogin)
                this.props.getCartLogin()
            } else {
                this.props.keepLogin(storage)
                this.props.getData()
            }
        } else {
            if (cart) {
                this.props.keepCart(cart)
                this.props.getCartNonLogin()
            }
        }
        this.setState({ check: true })
    }

    render() {
        if (this.state.check) {
            return (
                <BrowserRouter>
                    <Header />
                    <Route path="/" exact component={Home} />
                    <Route path="/Register" component={Register} />
                    <Route path="/Login" component={Login} />
                    <Route path="/Transactionstatus" component={Transtat} />
                    <Route path="/Startselling" component={Startsell} />
                    <Route path="/Forgotpasswordstart" component={Forgotpasswordstart} />
                    <Route path="/Forgotpasswordend/:userId" component={Forgotpasswordend} />
                    <Route path="/Editprofile" component={Editprofile} />
                    <Route path="/Addproduct" component={Addproduct} />
                    <Route path="/Listproduct" component={Listproduct} />
                    <Route path="/Markdown" component={Markdown} />
                    <Route path="/Productdetail/:id" component={Productdetail} />
                    <Route path="/Cart" component={Cart} />
                    <Route path="/Checkout" component={Checkout} />
                </BrowserRouter>
            )
        } else {
            return (
                <div style={{ backgroundColor: "#ffc61a", height: "1000px" }} className="text-center" >
                    <img src={require("./Logo.png")} style={{ width: "1200px", height: "600px" }} alt="No pic" />
                    <h1 >Loading .....</h1>
                </div>
            )
        }
    }
}

export default connect(null, { keepLogin, getData, getCartLogin, getCartNonLogin, keepCart })(App)
