import React,{Component} from "react";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu, 
    DropdownItem, UncontrolledPopover, PopoverHeader, PopoverBody,
    InputGroup, InputGroupAddon, Input, Button, FormGroup, Label } from 'reactstrap';
import {connect} from "react-redux";

class Header extends Component {
    
    render () {
        if (this.props.checkRedux) {
            return (
                <Navbar style={{backgroundColor:"#ffc61a"}} light expand id="curtain">
                        <Nav style={{width:"100%",height:"50px"}} className="justify-content-center" navbar>
                            <NavLink href="/">
                                <img src={require("./Logo.png")} style={{width:"150px"}}/>
                            </NavLink>
                        </Nav>
                </Navbar>
            )
        } else {
            return (
                <Navbar style={{backgroundColor:"#ffc61a"}} light expand id="curtain">
                    <Nav style={{width:"100%", height:"50px"}} navbar>
                        <NavbarBrand href="/">
                                <img src={require("./Logo.png")} style={{width:"150px"}}/>
                        </NavbarBrand>
                        <UncontrolledDropdown nav>
                            <DropdownToggle nav caret>
                                Category
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Fashion</DropdownItem>
                                <DropdownItem>Furniture</DropdownItem>
                                <DropdownItem>Electronic</DropdownItem>
                                <DropdownItem>Cell Phone</DropdownItem>
                                <DropdownItem>Laptop</DropdownItem>
                                <DropdownItem>Sport</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <InputGroup>
                            <Input placeholder="search product" className="border-dark" style={{height:"40px"}}/>
                            <InputGroupAddon addonType="append" style={{height:"40px"}}>
                                <Button id="buttonImg" className="">
                                    <img src={require('./magnifier.png')} id="imgNav"/>
                                </Button>
                            </InputGroupAddon>
                        </InputGroup>
                        <UncontrolledDropdown  nav>
                            <DropdownToggle id="TransactionStatus" nav caret>
                                <span className="small">Transaction Status</span>
                            </DropdownToggle>
                        </UncontrolledDropdown>
                        <UncontrolledPopover placement="bottom" trigger="legacy" target="TransactionStatus">
                            <PopoverBody>
                                <Input placeholder="Buyer code" className="my-3"/>
                                <Input placeholder="Transaction code" className="my-3"/>
                                <Button href="/transactionstatus" className="btn-block my-3">
                                    Status
                                </Button>
                                <hr></hr>
                                <p>Only for purchasing without login</p>
                            </PopoverBody>
                        </UncontrolledPopover>
                        <NavItem style={{width:"250px"}} className="text-center mr-2">
                            <NavLink href="/Startselling"className="px-0">
                                <span className="small">Start Selling</span>
                            </NavLink>
                        </NavItem>
                        <NavItem className="">
                            <Button id="buttonImg">
                                <img src={require('./cart.png')} id="imgNav"/>
                            </Button>
                        </NavItem>
                        <UncontrolledDropdown  nav>
                            <DropdownToggle id="Login" nav caret>
                                Login
                            </DropdownToggle>
                        </UncontrolledDropdown>
                        <UncontrolledPopover placement="bottom" trigger="legacy" target="Login">
                            <PopoverHeader>
                                <div className="row">
                                    <div className="col-8">
                                        Login
                                    </div>
                                    <div className="col-4">
                                        <a href="/Register"><small>Register</small></a>
                                    </div>
                                </div>
                            </PopoverHeader>
                            <PopoverBody>
                                <Input placeholder="Username/e-mail/cellphone" className="my-3"/>
                                <Input placeholder="Password" type="password" className=""/>
                                <div className="row">
                                    <div className="col-6 text-muted">
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox"/>
                                                Remember me
                                            </Label>
                                        </FormGroup>
                                    </div>
                                    <div className="col-6">
                                        <span>
                                            <a href=""><small>Forgot Password ?</small></a>
                                        </span>
                                    </div>
                                </div>
                                <Button className="btn-block mt-3">
                                    Login
                                </Button>
                                <hr></hr>
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
                            </PopoverBody>
                        </UncontrolledPopover>
                        <NavItem className="">
                            <NavLink href="/Register">Register</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        checkRedux : state.check.check
    }
}


export default connect(mapStateToProps)(Header)
