import React,{Component} from "react";
import { Toast, ToastBody, ToastHeader, Input, Button, FormGroup, Col, Label } from 'reactstrap';
import {connect} from "react-redux";
import {headerChange} from "../action/index";

class Login extends Component {

    componentDidMount () {
        this.props.headerChange()
    }

    render () {
        return (
            <div>
                <div id="curtain" className="row p-3 my-2 rounded justify-content-center">
                    <Toast style={{width:"100%"}}>
                        <ToastHeader>
                            Login
                        </ToastHeader>
                        <ToastBody>
                            <div className="my-3">
                                Dont have account?&nbsp;<a href="/Register">Register</a>&nbsp;here.
                            </div>
                            <Input autoFocus placeholder="Username/e-mail/cellphone" className="my-3"/>
                            <Input placeholder="Password" type="password"/>
                            <div className="row">
                                <div className="col-6 col-sm-7 text-muted">
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox"/>
                                            Remember me
                                        </Label>
                                    </FormGroup>
                                </div>
                                <div className="col-6 col-sm-5">
                                    <span>
                                        <a href=""><small>Forgot Password ?</small></a>
                                    </span>
                                </div>
                            </div>
                            <Button className="btn-block my-3">
                                Login
                            </Button>
                            <div className="row justify-content-center my-2"> ────────  or login with  ────────</div>
                            <Button className="btn-block btn-outline-secondary" id="buttonFBGoogle">
                                <div className="row">
                                    <div className="col-2">
                                        <img src={require('./fb.png')} id="imgButton"/>
                                    </div>
                                    <div className="col-8">
                                        Facebook
                                    </div>
                                </div>
                            </Button>
                            <Button className="btn-block btn-outline-secondary" id="buttonFBGoogle">
                                <div className="row">
                                <div className="col-2">
                                    <img src={require('./Google.png')} id="imgButton"/>
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
    }
}

export default connect(null,{headerChange})(Login)
