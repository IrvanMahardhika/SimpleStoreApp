import React,{Component} from "react";
import { Toast, ToastBody, ToastHeader, Input, Button, FormGroup, Col, Label, FormFeedback } from 'reactstrap';
import {connect} from "react-redux";
import {headerChange} from "../action/index";

class Register extends Component {

    componentDidMount () {
        this.props.headerChange()
    }

    render () {
        return (
            <div>
                <div id="curtain" className="row p-3 my-2 rounded justify-content-center">
                    <Toast style={{width:"100%"}}>
                        <ToastHeader>
                            Register New Account
                        </ToastHeader>
                        <ToastBody>
                            <Input autoFocus placeholder="Full name" className="my-3"/>
                            <Input placeholder="Cellphone" className="my-3"/>
                            <Input placeholder="E-mail" className="my-3"/>
                            <FormGroup tag="fieldset" row>
                                <Col sm={10}>
                                    <FormGroup className="d-inline mr-5" style={{width:"100px"}} check>
                                    <Label check>
                                        <Input type="radio" name="radio1"/>
                                        Male
                                    </Label>
                                    </FormGroup>
                                    <FormGroup className="d-inline" style={{width:"100px"}} check>
                                    <Label check>
                                        <Input type="radio" name="radio1"/>
                                        Female
                                    </Label>
                                    </FormGroup>
                                </Col>
                            </FormGroup>
                            <Input placeholder="Username" className="my-3"/>
                            <Input placeholder="Password" type="password" className="my-3"/>
                            <Input placeholder="Re-type password" type="password" className="my-3"/>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox"/>
                                    I acknowledge that I have read and agree to the <a href="/">Terms and Privacy policy</a> of SimpleStore
                                </Label>
                            </FormGroup>
                            <Button className="btn-block my-3">
                                Register
                            </Button>
                            <div className="row justify-content-center my-2"> ────────  or register with  ────────</div>
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
                            <div className="row justify-content-center my-3">
                                Already have account?&nbsp;<a href="/Login">Login</a>&nbsp;here.
                            </div>
                        </ToastBody>
                    </Toast>
                </div>
            </div>  
        )
    }
}

export default connect(null,{headerChange})(Register)
