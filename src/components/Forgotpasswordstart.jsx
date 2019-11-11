import React,{Component} from "react";
import {Toast, ToastBody, ToastHeader, Input, Button, FormGroup, FormFeedback} from 'reactstrap';
import {connect} from "react-redux";
import {headerChange,sendLinkChangePasswordEmail} from "../action/index";
import {Redirect} from "react-router-dom"

class Forgotpasswordstart extends Component {

    state = {
        email : "a"
    }

    componentDidMount () {
        this.props.headerChange()
    }

    handleBlurEmail = (val)=>{
        if (val==="") {this.setState({email:"a"})}
        else if (val.indexOf("@")===-1 || val.indexOf(".")===-1){this.setState({email:false})}
        else {this.setState({email:val})}
    }

    sendLinkChangePasswordEmailClick = ()=>{
        if (!this.state.email|| this.state.email==="a") {
            alert("Please fill in the field with correct data")
        } else {
            this.props.sendLinkChangePasswordEmail(this.state.email)
        }
    }

    render () {
        switch (true) {
            case this.props.registerRedux==="":
                return (
                    <div>
                        <div id="curtain2" className="row p-3 my-5 rounded justify-content-center">
                            <Toast style={{width:"100%"}}>
                                <ToastHeader>
                                    Forgot Password
                                </ToastHeader>
                                <ToastBody>
                                    <p className="mb-4 text-justify">
                                        Insert your <b>registered e-mail</b>. 
                                        We will e-mail you a link to reset your password.
                                    </p>
                                    <FormGroup>
                                        <Input autoFocus invalid={!this.state.email} placeholder="E-mail" type="text" className="mt-3" onBlur={e=>this.handleBlurEmail(e.target.value)} />
                                        <FormFeedback onInvalid>Not a correct email format</FormFeedback>    
                                    </FormGroup>
                                    <Button className="btn-block my-4" onClick={()=>{this.sendLinkChangePasswordEmailClick()}} >
                                        Continue
                                    </Button>
                                    <div className="row justify-content-center my-3">
                                        Back to&nbsp;<a href="/Login">Login</a>&nbsp;or&nbsp;<a href="/Register">Register</a>
                                    </div>
                                </ToastBody>
                            </Toast>
                        </div>
                    </div>
                )
            case this.props.registerRedux==="success":
                return <Redirect to="/" />
            default:
                break
        }
    }
}

const mapStateToProps = state => {
    return {
        registerRedux : state.register.register
    }
}


export default connect(mapStateToProps,{headerChange,sendLinkChangePasswordEmail})(Forgotpasswordstart)