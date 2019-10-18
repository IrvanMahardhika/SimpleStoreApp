import React,{Component} from "react";
import {Toast, ToastBody, ToastHeader, Input, Button, FormGroup, FormFeedback} from 'reactstrap';
import {connect} from "react-redux";
import {headerChange,changePassword} from "../action/index";
import {Redirect} from "react-router-dom"

class Forgotpasswordend extends Component {

    state = {
        userId : "",
        username : "",
        password : "a",
        retype_password : "b"
    }

    componentDidMount () {
        this.props.headerChange()
        this.setState({userId:this.props.match.params.userId})
        
        
    }

    handleBlurPassword = (val)=>{
        if (val==="") {this.setState({password:"a"})}
        else if (val.length<8){this.setState({password:false})}
        else {this.setState({password:val})}
    }

    handleBlurRetypePassword = (val)=>{
        if (val==="") {this.setState({retype_password:"b"})}
        else if (val!==this.state.password){this.setState({retype_password:false})}
        else {this.setState({retype_password:val})}
    }

    changePasswordClick = ()=>{
        if (!this.state.password || this.state.password==="a" || !this.state.retype_password || this.state.retype_password==="a" || this.state.password!==this.state.retype_password) {
            alert("Please fill in the field with correct data")
        } else {
            this.props.changePassword(this.state)
        }
    }

    render () {
        switch (true) {
            case this.props.registerRedux==="":
                return (
                    <div>
                        <div id="curtain" className="row p-3 my-5 rounded justify-content-center">
                            <Toast style={{width:"100%"}}>
                                <ToastHeader>
                                    Forgot Password
                                </ToastHeader>
                                <ToastBody>
                                    <p className="mb-4 text-justify">
                                        Insert your username and <b>new password</b>.
                                    </p>
                                    <Input autoFocus placeholder="Username" type="text" className="mt-3" onChange={e=>this.setState({username:e.target.value})} />
                                    <FormGroup>
                                        <Input invalid={!this.state.password} placeholder="New password" type="password" className="mt-3" onChange={e=>this.handleBlurPassword(e.target.value)} />
                                        <FormFeedback onInvalid>Password must contain at least 8 character</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Input disabled={!this.state.password || this.state.password==="a"} invalid={!this.state.retype_password} placeholder="Re-type new password" type="password" className="mt-3" onBlur={e=>this.handleBlurRetypePassword(e.target.value)} />
                                        <FormFeedback onInvalid>Doesnt match with password</FormFeedback>
                                    </FormGroup>
                                    <Button className="btn-block my-4" onClick={()=>{this.changePasswordClick()}} >
                                        Change Password
                                    </Button>
                                    <div className="row justify-content-center my-3">
                                        Back to&nbsp;<a href="/Login">Login</a>
                                    </div>
                                </ToastBody>
                            </Toast>
                        </div>
                    </div>
                )
            case this.props.registerRedux==="success":
                return <Redirect to="/Login" />
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


export default connect(mapStateToProps,{headerChange,changePassword})(Forgotpasswordend)