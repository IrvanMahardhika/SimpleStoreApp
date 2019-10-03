import React,{Component} from "react";
import {connect} from "react-redux";
import { InputGroup, TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Input, FormGroup, FormFeedback, Label } from 'reactstrap';
import classnames from 'classnames';
import {Redirect} from "react-router-dom";
import axios from "axios";

import {headerChange,sendVerifyEmail} from "../action/index";
import {showLocation,addStore,finish} from "../action/store"


class Startsell extends Component {

    constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
        activeTab: '1',
        disabledTab1: false,
        disabledTab2: true,
        disabledTab3: true,
        storename: "",
        postalCode: "a",
        address:"",
        acknowledge : "",
        randomCode: "",
        input1: "",
        input2: "",
        input3: "",
        input4: "",
        input5: "",
        input6: "",
        emailverified: "",
        verCel: false,
        cellphoneverified: ""
    };
    }

    componentDidMount () {
        this.props.headerChange();
        
        if (this.props.loginRedux.length>0) {
            axios.get("http://localhost:5555/auth/getlogin", {
                params : {
                    username : this.props.loginRedux[0].username,
                    email : this.props.loginRedux[0].username,
                    cellphone : this.props.loginRedux[0].username
                }
            }).then(res=>{
                this.setState({emailverified:res.data[0].emailverified})
            }).catch()
        }
    }
    
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({activeTab: tab});
        }
    }

    z = () => {
        let container = document.getElementsByClassName("code")[0];
        container.onkeyup = (e) => {
            var target = e.srcElement || e.target;
            var maxLength = parseInt(target.attributes["maxlength"].value, 10);
            var myLength = target.value.length;
            if (myLength >= maxLength) {
                var next = target;
                while (next = next.nextElementSibling) {
                    if (next == null)
                        break;
                    if (next.tagName.toLowerCase() === "input") {
                        next.focus();
                        break;
                    }
                }
            } else if (myLength === 0) {
                var previous = target;
                while (previous = previous.previousElementSibling) {
                    if (previous == null)
                        break;
                    if (previous.tagName.toLowerCase() === "input") {
                        previous.focus();
                        // previous.value=""
                        break;
                    }
                }
            }
        }
    }

    handleBlurPostalCode = (val)=>{
        if (val==="") {this.setState({postalCode:"a"})}
        else if (isNaN(val)===true || val.length<5){this.setState({postalCode:false})}
        else {
            this.setState({postalCode:val});
            this.props.showLocation(val)
        }
    }

    handleClickAcknowledge = ()=>{
        if (this.state.acknowledge) {this.setState({acknowledge:false})}
        else {this.setState({acknowledge:true})}
    }

    continueClick1 = ()=>{
        if (!this.state.storename || !this.state.postalCode || this.state.postalCode==="a" || !this.state.address) {
            alert("Please fill in the field with correct data")
        } else if (!this.state.acknowledge) {
            alert("Please check the term and privacy policy")
        } else {
            this.setState({disabledTab1:true, disabledTab2:false}); 
            this.toggle('2');
        }
    }

    resendClick = ()=>{
        this.props.sendVerifyEmail(this.props.loginRedux[0])
    }

    verCelShow = ()=>{
        let random
        do {
            random = parseInt(Math.random()*1000000).toString()
        } while (random<100000);
        this.setState({randomCode:random})
        if (this.state.verCel===false) {
            this.setState({verCel:true})
        } else {
            document.getElementById("verCod1").value='';
            document.getElementById("verCod2").value='';
            document.getElementById("verCod3").value='';
            document.getElementById("verCod4").value='';
            document.getElementById("verCod5").value='';
            document.getElementById("verCod6").value='';
            document.getElementById("verCod1").focus()
        } 
    }

    verCel = (val)=>{
        let inputCode = [this.state.input1,this.state.input2,this.state.input3,this.state.input4,this.state.input5,val].join("")
        if (inputCode===this.state.randomCode) {
            axios.put("http://localhost:5555/auth/verifyCellphone",
            {
                username : this.props.loginRedux[0].username
            }
            )
            .then(res=>{
                alert("Cellphone verified");
                this.setState({cellphoneverified:1})
            })
            .catch()
        }
        else {
            alert("Wrong input code")
            document.getElementById("verCod1").value='';
            document.getElementById("verCod2").value='';
            document.getElementById("verCod3").value='';
            document.getElementById("verCod4").value='';
            document.getElementById("verCod5").value='';
            document.getElementById("verCod6").value='';
            document.getElementById("verCod1").focus()
        }
    }

    continueClick2 = ()=>{
        axios.get("http://localhost:5555/auth/getlogin", {
            params : {
                username : this.props.loginRedux[0].username,
                email : this.props.loginRedux[0].username,
                cellphone : this.props.loginRedux[0].username
            }
        }).then(res=>{
            this.setState({emailverified:res.data[0].emailverified})
        }).catch()

        switch (true) {
            case this.state.emailverified===0:
                alert("Your e-mail has not been verified.\nPlease click button above.")
            case this.state.cellphoneverified==="":
                alert("Your cellphone has not been verified.\nPlease click button above.")
            default:
                break;
        }

        if (this.state.cellphoneverified===1 && this.state.emailverified===1) {
            this.props.addStore(this.state,this.props.locationRedux[0].district,this.props.locationRedux[0].cityregency,this.props.locationRedux[0].province,this.props.loginRedux[0].userId)
            this.setState({disabledTab2:true, disabledTab3:false}); 
            this.toggle('3'); 
        }
    }

    finishClick = ()=>{
        localStorage.removeItem("userData");
        this.props.finish(this.props.loginRedux[0].username)     
    }

    render () {
        console.log(this.state.randomCode);
        switch (true) {
            case this.props.loginRedux.length>0 && this.props.loginRedux[0].storename===null :
                return (
                    <div id="curtain" className="mt-3 mx-5">
                        <p className="h3">
                            Take your chance <br></br> selling at SimpleStore
                        </p>
                        <Nav className="mt-3" tabs>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '1' },{ disabled: this.state.disabledTab1 === true} )}>
                                    <p style={{textAlign:"center"}} className="h5">Step 1</p>
                                    <p style={{textAlign:"center"}}>Create Store</p>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '2' },{ disabled: this.state.disabledTab2 === true} )}>
                                    <p style={{textAlign:"center"}} className="h5">Step 2</p>
                                    <p style={{textAlign:"center"}}>Verification</p>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '3' },{ disabled: this.state.disabledTab3 === true})} onClick={() => { this.toggle('3'); }}>
                                    <p style={{textAlign:"center"}} className="h5">Step 3</p>
                                    <p style={{textAlign:"center"}}>Approval</p>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent id="curtain" activeTab={this.state.activeTab}>
                            <TabPane style={{width:"500px"}} tabId="1">
                                <Input autoFocus placeholder="Store name" className="my-3" onChange={e=>this.setState({storename:e.target.value})} />
                                <p className="mb-1">Store Address :</p>
                                <FormGroup>
                                    <Input maxLength="5" invalid={!this.state.postalCode} placeholder="Postal code" onChange={e=>this.handleBlurPostalCode(e.target.value)} />
                                    <FormFeedback onInvalid>Please type a correct postal code</FormFeedback>  
                                </FormGroup>
                                {
                                    this.props.locationRedux.length>0
                                    ?
                                    <p>Province : {this.props.locationRedux[0].province} <br></br>
                                        City/Regency : {this.props.locationRedux[0].cityregency} <br></br>
                                        District : {this.props.locationRedux[0].district}
                                    </p>
                                    :
                                    null
                                }
                                <Input disabled={!this.state.postalCode || this.state.postalCode==="a"} placeholder="Address (exp : JL.Roda No.3)" className="mb-3" onChange={e=>this.setState({address:e.target.value})} />
                                <FormGroup check>
                                    <Label check>
                                        <Input type="checkbox" onClick={()=>{this.handleClickAcknowledge()}} />
                                        I acknowledge that I have read and agree to the <a href="#">Terms and Privacy policy</a> of SimpleStore
                                    </Label>
                                </FormGroup>
                                <Button className="btn-block my-3" onClick={()=>{this.continueClick1()}}>
                                    Continue
                                </Button>
                            </TabPane>
                            <TabPane style={{width:"500px"}} tabId="2">
                                <h5 className="mt-3">Your e-mail and cellphone have to be verified to continue</h5>
                                <Card className="my-3" body>
                                    <CardTitle className="h3" style={{textAlign:"center"}}>E-mail Verification</CardTitle>
                                    {
                                        this.state.emailverified===0
                                        ?
                                        <CardText style={{textAlign:"center"}}>
                                            Your e-mail has not been verified. Please verify your e-mail, by clicking the link we have sent.
                                            <br></br>
                                            <br></br>
                                            If you have not received the link, please click the button below to resend the link to your e-mail.
                                        </CardText>
                                        :
                                        <CardText style={{textAlign:"center"}}>
                                            Your e-mail has been verified.
                                        </CardText>
                                    }
                                    {
                                        this.state.emailverified===0
                                        ?
                                        <Button color="secondary" onClick={()=>{this.resendClick()}}>Resend Verification Link</Button>
                                        :
                                        null
                                    }
                                </Card>
                                <Card className="my-3" body>
                                    <CardTitle className="h3" style={{textAlign:"center"}}>Cellphone Verification</CardTitle>
                                    {
                                        this.state.verCel===false
                                        ?
                                        <Button className="my-3" onClick={() => {this.verCelShow()}}>
                                            Verify Cellphone
                                        </Button>
                                        :
                                        null
                                    }
                                    {
                                        this.state.verCel===true && this.state.cellphoneverified===""
                                        ?
                                        <CardTitle className="h3" style={{textAlign:"center"}}>Cellphone Verification</CardTitle>
                                        :
                                        null
                                    }
                                    {
                                        this.state.verCel===true && this.state.cellphoneverified===""
                                        ?
                                        <CardText style={{textAlign:"center"}}>
                                            Verification code has been sent via text message to 
                                            <br></br> 
                                            <b>{this.props.loginRedux[0].cellphone}</b>
                                            <br></br> 
                                            <br></br>
                                            Verification code :
                                        </CardText>
                                        :
                                        null
                                    }
                                    {
                                        this.state.verCel===true && this.state.cellphoneverified===""
                                        ?
                                        <InputGroup className="code">
                                            <Input autoFocus onChange={(e)=>{this.z();this.setState({input1:e.target.value})}} maxLength="1" className="mx-2 pl-4" id="verCod1" type="text"/>
                                            <Input onChange={e=>this.setState({input2:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod2" type="text"/>
                                            <Input onChange={e=>this.setState({input3:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod3" type="text"/>
                                            <Input onChange={e=>this.setState({input4:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod4" type="text"/>
                                            <Input onChange={e=>this.setState({input5:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod5" type="text"/>
                                            <Input onChange={e=>{this.verCel(e.target.value)}} maxLength="1" className="mx-2 pl-4" id="verCod6" type="text"/> 
                                        </InputGroup>
                                        :
                                        null
                                    }
                                    {
                                        this.state.verCel===true && this.state.cellphoneverified===""
                                        ?
                                        <CardText style={{textAlign:"center"}} className="my-3">
                                            Re-send <a href="#" onClick={() => {this.verCelShow()}} >verification code</a>
                                        </CardText>
                                        :
                                        null
                                    }
                                    {
                                        this.state.verCel===true && this.state.cellphoneverified===1
                                        ?
                                        <CardText style={{textAlign:"center"}}>
                                            Your cellphone has been verified.
                                        </CardText>
                                        :
                                        null
                                    }
                                </Card>
                                <Button className="my-3" onClick={() => {this.continueClick2()}}>
                                    Continue
                                </Button>
                            </TabPane>
                            <TabPane style={{width:"500px"}} tabId="3">
                                <Card className="my-3" body>
                                    <CardText style={{textAlign:"center"}}>
                                        We need 24 hours to do approval process.
                                        <br></br>
                                        In the mean time, your store will be displayed in the navigation-bar but can not be accessed due to inactive state.
                                        <br></br>
                                        After your store is approved, your store will be activated, online, and you can start upload your products.
                                    </CardText>
                                    <Button className="my-3" onClick={()=>{this.finishClick()}}>
                                        Finish
                                    </Button>
                                </Card>
                            </TabPane>
                        </TabContent>
                    </div>
                )
            case this.props.loginRedux.length>0 :
                return <Redirect to="/" />
            default:
                alert("You need to have account to start selling")
                return <Redirect to="/Register" />
        }  
    }
}

const mapStateToProps = state => {
    return {
        loginRedux : state.login.user,
        locationRedux : state.location.location
    }
}


export default connect(mapStateToProps,{headerChange,showLocation,sendVerifyEmail,addStore,finish})(Startsell)