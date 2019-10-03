import React,{Component} from "react";
import {Toast, ToastBody, ToastHeader, Input, Button, FormGroup, Col, Label, FormFeedback} from 'reactstrap';
import {connect} from "react-redux";
import {headerChange,addUser} from "../action/index";
import {Redirect} from "react-router-dom"

class Register extends Component {

    state = {
        fullname : "",
        cellphone : "a",
        email : "a",
        gender : "",
        username : "a",
        password : "a",
        retype_password : "b",
        acknowledge : ""
    }

    componentDidMount () {
        this.props.headerChange()
    }
    
    handleBlurCellphone = (val)=>{
        if (val==="") {this.setState({cellphone:"a"})}
        else if (isNaN(val)===true || val.length<11 || val.substr(0,1)!=="0"){this.setState({cellphone:false})}
        else {this.setState({cellphone:val})}
    }

    handleBlurEmail = (val)=>{
        if (val==="") {this.setState({email:"a"})}
        else if (val.indexOf("@")===-1 || val.indexOf(".")===-1){this.setState({email:false})}
        else {this.setState({email:val})}
    }

    handleBlurUsername = (val)=>{
        if (val==="") {this.setState({username:"a"})}
        else if (val.length<8){this.setState({username:false})}
        else {this.setState({username:val})}
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

    handleClickAcknowledge = ()=>{
        if (this.state.acknowledge) {this.setState({acknowledge:false})}
        else {this.setState({acknowledge:true})}
    }

    registerClick = ()=>{
        if (!this.state.fullname || !this.state.cellphone || this.state.cellphone==="a" || !this.state.email|| this.state.email==="a" || !this.state.username || this.state.username==="a" || !this.state.password || this.state.password==="a" || !this.state.retype_password || this.state.retype_password==="a" || this.state.password!==this.state.retype_password) {
            alert("Please fill in the field with correct data")
        } else if (!this.state.gender) {
            alert("Please choose your gender")
        } else if (!this.state.acknowledge) {
            alert("Please check the term and privacy policy")
        } else {
            this.props.addUser(this.state)
        }
    }

    render () {
        switch (true) {
            case this.props.loginRedux.length===0 && this.props.registerRedux==="":
                return (
                    <div>
                        <div id="curtain" className="row p-3 my-2 rounded justify-content-center">
                            <Toast style={{width:"100%"}}>
                                <ToastHeader>
                                    Register New Account
                                </ToastHeader>
                                <ToastBody>
                                    <Input autoFocus placeholder="Full name" className="my-3" onChange={e=>this.setState({fullname:e.target.value})} />
                                    <FormGroup>
                                        <Input invalid={!this.state.cellphone} placeholder="Cellphone" className="mt-3" onBlur={e=>this.handleBlurCellphone(e.target.value)} />
                                        <FormFeedback onInvalid>Please type a correct cellphone number</FormFeedback>      
                                    </FormGroup>
                                    <FormGroup>
                                        <Input invalid={!this.state.email} placeholder="E-mail" type="text" className="mt-3" onBlur={e=>this.handleBlurEmail(e.target.value)} />
                                        <FormFeedback onInvalid>Not a correct email format</FormFeedback>    
                                    </FormGroup>
                                    <FormGroup tag="fieldset" row>
                                        <Col sm={10}>
                                            <FormGroup className="d-inline mr-5" style={{width:"100px"}} check>
                                            <Label check>
                                                <Input type="radio" name="radio1" value="Male" onClick={()=>{this.setState({gender:"male"})}} />
                                                Male
                                            </Label>
                                            </FormGroup>
                                            <FormGroup className="d-inline" style={{width:"100px"}} check>
                                            <Label check>
                                                <Input type="radio" name="radio1" value="Female" onClick={()=>{this.setState({gender:"female"})}} />
                                                Female
                                            </Label>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Input invalid={!this.state.username} placeholder="Username" className="mt-3" onBlur={e=>this.handleBlurUsername(e.target.value)} />
                                        <FormFeedback onInvalid>Username must contain at least 8 character</FormFeedback>    
                                    </FormGroup>
                                    <FormGroup>
                                        <Input invalid={!this.state.password} placeholder="Password" type="password" className="mt-3" onChange={e=>this.handleBlurPassword(e.target.value)} />
                                        <FormFeedback onInvalid>Password must contain at least 8 character</FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Input disabled={!this.state.password || this.state.password==="a"} invalid={!this.state.retype_password} placeholder="Re-type password" type="password" className="mt-3" onBlur={e=>this.handleBlurRetypePassword(e.target.value)} />
                                        <FormFeedback onInvalid>Doesnt match with password</FormFeedback>
                                    </FormGroup>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox" onClick={()=>{this.handleClickAcknowledge()}} />
                                            I acknowledge that I have read and agree to the <a href="#">Terms and Privacy policy</a> of SimpleStore
                                        </Label>
                                    </FormGroup>
                                    <Button className="btn-block my-3" onClick={()=>{this.registerClick()}} >
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
            case this.props.loginRedux.length>0:
                    alert("You have logged in.")
                    return <Redirect to="/" />
            case this.props.registerRedux==="success":
                    return <Redirect to="/Login" />
            default:
                break
        }
    }
}

const mapStateToProps = state => {
    return {
        loginRedux : state.login.user,
        registerRedux : state.register.register
    }
}


export default connect(mapStateToProps,{headerChange,addUser})(Register)
