import React,{Component} from "react";
import {connect} from "react-redux";
import { InputGroup, TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, Input, FormGroup, Label } from 'reactstrap';
import classnames from 'classnames';

import {headerChange} from "../action/index";

class Startsell extends Component {

    componentDidMount () {
        this.props.headerChange()
    }

    constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
        activeTab: '1',
        disabledTab1: false,
        disabledTab2: true,
        disabledTab3: true
    };
    }
    
    toggle(tab) {
        if (this.state.activeTab !== tab) {
        this.setState({
        activeTab: tab
        });
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

    render () {
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
                                <p style={{textAlign:"center"}}>Good to Go</p>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent id="curtain" activeTab={this.state.activeTab}>
                        <TabPane style={{width:"500px"}} tabId="1">
                            <Input autoFocus placeholder="Store name" className="my-3"/>
                            <Input placeholder="City" className="my-3"/>
                            <Input placeholder="Postal code" className="my-3"/>
                            <FormGroup check>
                                <Label check>
                                    <Input type="checkbox"/>
                                    I acknowledge that I have read and agree to the <a href="/">Terms and Privacy policy</a> of SimpleStore
                                </Label>
                            </FormGroup>
                            <Button className="btn-block my-3" onClick={() => { this.setState({disabledTab1:true, disabledTab2:false}); this.toggle('2');}}>
                                Open Store
                            </Button>
                            <div className="row justify-content-center my-3">
                                Already have account?&nbsp;<a href="/Login">Login</a>&nbsp;here.
                            </div>
                        </TabPane>
                        <TabPane style={{width:"500px"}} tabId="2">
                            <Card className="my-3" body>
                                <CardTitle className="h3" style={{textAlign:"center"}}>Insert Verification Code</CardTitle>
                                <CardText style={{textAlign:"center"}}>
                                    Verification code has been sent via text message to <br></br> <b>xxxx-xxxx-xx57</b>
                                    <br></br> <br></br>
                                    Verification code :
                                </CardText>
                                <InputGroup className="code">
                                    <Input onChange={()=>{this.z()}} maxLength="1" className="mx-2 pl-4" id="verCod" type="text"/>
                                    <Input maxLength="1" className="mx-2 pl-4" id="verCod" type="text"/>
                                    <Input maxLength="1" className="mx-2 pl-4" id="verCod" type="text"/>
                                    <Input maxLength="1" className="mx-2 pl-4" id="verCod" type="text"/>
                                    <Input maxLength="1" className="mx-2 pl-4" id="verCod" type="text"/>
                                    <Input maxLength="1" className="mx-2 pl-4" id="verCod" type="text"/> 
                                </InputGroup>
                                <CardText style={{textAlign:"center"}} className="my-3">
                                    Re-send <a href="/">verification code</a>
                                </CardText>
                                <Button className="my-3" onClick={() => { this.setState({disabledTab2:true, disabledTab3:false}); this.toggle('3'); }}>
                                    Verify
                                </Button>
                            </Card>
                        </TabPane>
                        <TabPane tabId="3">
                            <Row>
                                <Col sm="6">
                                    <Input placeholder="Full name"/>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
            </div>
        )
    }
}

export default connect(null,{headerChange})(Startsell)