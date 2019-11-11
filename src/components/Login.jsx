import React,{Component} from "react";
import { Toast, ToastBody, ToastHeader, Input, Button, FormGroup, Label } from 'reactstrap';
import {connect} from "react-redux";
import {headerChange,login} from "../action/index";
import {Redirect} from "react-router-dom"

class Login extends Component {

    state = {
        keyword : "",
        password : "",
        rememberMe : false,
        username : ""
    }

    componentDidMount () {
        this.props.headerChange()
        let username = JSON.parse(localStorage.getItem("rememberMe"))
        if (username) {
            this.setState({username:username})
        } else {
            this.setState({username:""})
        }
    }

    handleClickRememberMe = ()=>{
        if (this.state.rememberMe) {this.setState({rememberMe:false})}
        else {this.setState({rememberMe:true})}
    }

    loginClick = ()=>{
        let keyword = this.state.keyword
        let password = this.state.password
        let rememberMe = this.state.rememberMe
        if (!keyword || !password) {
            alert("Please fill in the empty field")
        } else {
            this.props.login(keyword, password, rememberMe)
        }
    }

    render () {
        if (this.props.loginRedux.length===0) {
            return (
                <div>
                    <div id="curtain2" className="row p-3 my-2 rounded justify-content-center">
                        <Toast style={{width:"100%"}}>
                            <ToastHeader>
                                Login
                            </ToastHeader>
                            <ToastBody>
                                <div className="my-3">
                                    Dont have account?&nbsp;<a href="/Register">Register</a>&nbsp;here.
                                </div>
                                <Input list="username" autoFocus placeholder="Username/e-mail/cellphone" className="my-3" onChange={(e)=>{this.setState({keyword:e.target.value})}} />
                                {
                                    this.state.username
                                    ?
                                    <datalist id="username">
                                        <option>{this.state.username}</option>
                                    </datalist>
                                    :
                                    null
                                }
                                <Input placeholder="Password" type="password" onChange={(e)=>{this.setState({password:e.target.value})}}/>
                                <div className="row">
                                    <div className="col-6 col-sm-7 text-muted">
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox" onClick={()=>{this.handleClickRememberMe()}} />
                                                Remember me
                                            </Label>
                                        </FormGroup>
                                    </div>
                                    <div className="col-6 col-sm-5">
                                        <span>
                                            <a href="/Forgotpasswordstart"><small>Forgot Password ?</small></a>
                                        </span>
                                    </div>
                                </div>
                                <Button className="btn-block my-3" onClick={()=>{this.loginClick()}} >
                                    Login
                                </Button>
                                <div className="row justify-content-center my-2"> ────────  or login with  ────────</div>
                                <Button className="btn-block btn-outline-secondary" id="buttonFBGoogle">
                                    <div className="row">
                                        <div className="col-2">
                                            <img src={require('./fb.png')} id="imgButton" alt="No pic"/>
                                        </div>
                                        <div className="col-8">
                                            Facebook
                                        </div>
                                    </div>
                                </Button>
                                <Button className="btn-block btn-outline-secondary" id="buttonFBGoogle">
                                    <div className="row">
                                    <div className="col-2">
                                        <img src={require('./Google.png')} id="imgButton" alt="No pic" />
                                        </div>
                                        <div className="col-8">
                                            Google
                                        </div>
                                    </div>
                                </Button>
                            </ToastBody>
                        </Toast>
                    </div>
                </div>
            )
        } else {
            return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        loginRedux : state.login.user
    }
}


export default connect(mapStateToProps,{headerChange,login})(Login)
