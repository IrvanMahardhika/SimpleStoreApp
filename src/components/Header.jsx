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
    InputGroup, InputGroupAddon, Input, Button, FormGroup, Label, ListGroup, ListGroupItem, Badge } from 'reactstrap';
import {connect} from "react-redux";
import {login,logout} from "../action/index"

class Header extends Component {
    
    state = {
        keyword : "",
        password : "",
        rememberMe : false,
        username : ""
    }

    componentDidMount () {
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

    logoutClick = ()=>{
        let username = JSON.parse(localStorage.getItem("rememberMe"))
        if (username) {
            this.setState({username:username})
        } else {
            this.setState({username:""})
        }
        this.setState({rememberMe:false})
        this.props.logout()
    }

    render () {
        switch (true) {
            case this.props.check === true:
                return (
                    <Navbar style={{backgroundColor:"#ffc61a"}} light expand id="curtain">
                            <Nav style={{width:"100%",height:"50px"}} className="justify-content-center" navbar>
                                <NavLink href="/">
                                    <img src={require("./Logo.png")} style={{width:"150px"}}/>
                                </NavLink>
                            </Nav>
                    </Navbar>
                )
            case this.props.loginRedux.length>0 && this.props.loginRedux[0].storename===null:
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
                            <NavItem style={{width:"250px"}} className="text-center mr-2">
                                <NavLink href="/Startselling"className="px-0">
                                    <span className="small">Start Selling</span>
                                </NavLink>
                            </NavItem>
                            <NavItem className="mx-1">
                                <Button id="buttonImg">
                                    <img src={require('./cart.png')} id="imgNav"/>
                                </Button>
                            </NavItem>
                            <UncontrolledDropdown  nav>
                                <DropdownToggle id="User" nav caret>
                                    {this.props.loginRedux[0].username}
                                </DropdownToggle>
                            </UncontrolledDropdown>
                            <UncontrolledPopover placement="bottom" className="mx-auto" trigger="legacy" target="User">
                                <PopoverHeader >
                                    <div className="row">
                                        <div className="col-3">
                                            <img className="rounded-circle" src={require("./irvan.jpg")} alt="no picture uploaded" style={{style:"3em",width:"3em",objectFit:"cover"}} />  
                                        </div>
                                        <div className="col-8 mt-2">
                                            <div className="row">
                                                <div className="col" >
                                                    <small>{this.props.loginRedux[0].fullname}</small>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <a href="/"><small>Edit profile</small></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                </PopoverHeader>
                                <PopoverBody>
                                    <div>
                                        Balance :
                                    </div>
                                    <div>
                                        Points :
                                    </div>
                                    <hr></hr>
                                    <div className="row">
                                        <div className="col-6 text-center border-right ">
                                            <a href="/">History</a>
                                        </div>
                                        <div className="col-6 text-center">
                                            <a href="/">Wishlist</a>
                                        </div>
                                    </div>
                                    <Button className="btn-block mt-3" onClick={()=>{this.logoutClick()}} >
                                        Logout
                                    </Button>
                                </PopoverBody>
                            </UncontrolledPopover>
                        </Nav>
                    </Navbar>
                )
            case this.props.loginRedux.length>0:
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
                            <NavItem className="mx-1">
                                <Button id="buttonImg">
                                    <img src={require('./cart.png')} id="imgNav"/>
                                </Button>
                            </NavItem>
                            <UncontrolledDropdown  nav>
                                <DropdownToggle id="Store" nav caret>
                                    {this.props.loginRedux[0].storename}
                                </DropdownToggle>
                            </UncontrolledDropdown>
                            <UncontrolledPopover disabled={this.props.loginRedux[0].storeapproval===0} placement="bottom" trigger="legacy" target="Store">
                                <PopoverHeader>
                                    <Button className="">
                                        User Order <Badge style={{backgroundColor:"#ffc61a"}}>0</Badge>
                                    </Button>
                                </PopoverHeader>
                                <PopoverBody>
                                    <ListGroup flush>
                                        <ListGroupItem tag="button" action>Check Store</ListGroupItem>
                                        <ListGroupItem tag="button" action>Statistic</ListGroupItem>
                                    </ListGroup>
                                    <div className="row mt-2">
                                        <div className="col-8 pr-0">
                                            <a href="#">List Product</a>
                                        </div>
                                        <div className="col-4 pl-0">
                                            <Button size="sm">add</Button>
                                        </div>
                                    </div>
                                </PopoverBody>
                            </UncontrolledPopover>
                            <UncontrolledDropdown  nav>
                                <DropdownToggle id="User" nav caret>
                                    {this.props.loginRedux[0].username}
                                </DropdownToggle>
                            </UncontrolledDropdown>
                            <UncontrolledPopover placement="bottom" className="mx-auto" trigger="legacy" target="User">
                                <PopoverHeader >
                                    <div className="row">
                                        <div className="col-3">
                                            <img className="rounded-circle" src={require("./irvan.jpg")} alt="no picture uploaded" style={{style:"3em",width:"3em",objectFit:"cover"}} />  
                                        </div>
                                        <div className="col-8 mt-2">
                                            <div className="row">
                                                <div className="col" >
                                                    <small>{this.props.loginRedux[0].fullname}</small>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <a href="#"><small>Edit profile</small></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                </PopoverHeader>
                                <PopoverBody>
                                    <div>
                                        Balance :
                                    </div>
                                    <div>
                                        Points :
                                    </div>
                                    <hr></hr>
                                    <div className="row">
                                        <div className="col-6 text-center border-right ">
                                            <a href="#">History</a>
                                        </div>
                                        <div className="col-6 text-center">
                                            <a href="#">Wishlist</a>
                                        </div>
                                    </div>
                                    <Button className="btn-block mt-3" onClick={()=>{this.logoutClick()}} >
                                        Logout
                                    </Button>
                                </PopoverBody>
                            </UncontrolledPopover>
                        </Nav>
                    </Navbar>
                )
            default:
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
                                    <Input placeholder="Password" type="password" className="" onChange={(e)=>{this.setState({password:e.target.value})}} />
                                    <div className="row">
                                        <div className="col-6 text-muted">
                                            <FormGroup check>
                                                <Label check>
                                                    <Input type="checkbox" onClick={()=>{this.handleClickRememberMe()}} />
                                                    Remember me
                                                </Label>
                                            </FormGroup>
                                        </div>
                                        <div className="col-6">
                                            <span>
                                                <a href="/Forgotpasswordstart"><small>Forgot Password ?</small></a>
                                            </span>
                                        </div>
                                    </div>
                                    <Button className="btn-block mt-3" onClick={()=>{this.loginClick()}} >
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
        check : state.check.check,
        loginRedux : state.login.user
    }
}


export default connect(mapStateToProps,{login,logout})(Header)
