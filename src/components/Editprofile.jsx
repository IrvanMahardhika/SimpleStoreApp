import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Row, Col, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    TabContent, TabPane, Nav, NavItem, NavLink, CardHeader, Input, FormGroup, FormFeedback, Badge
} from 'reactstrap';
import classnames from 'classnames';
import { Redirect } from "react-router-dom";
import axios from "axios";
import NumberFormat from "react-number-format";

import { showLocation } from "../action/store";
import { getData, sendVerifyEmail } from "../action/index";
import Modaleditprofile from "./Modaleditprofile";


class Editprofile extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            userpic: "",
            editPic: false,
            editFullName: false,
            editBirthDate: false,
            editGender: false,
            fullname: "",
            birthdateYear: "",
            birthdateMonth: "",
            birthdateDate: "",
            sex: "",
            renderpic: "images/userpics/nopic.png",
            postalCode: "a",
            address: "",
            addressname: "",
            dataAddress: [],
            modalOpen: false,
            paymentType: "",
            nameOncard: "",
            cardNumber: "",
            cardExp: "",
            securityCode: "",
            bankInput: false,
            bank: "",
            accountName: "",
            accountNumber: "",
            dataPayment: []
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }

    componentDidMount() {
        this.renderPic()
        this.getAddress()
        this.getPayment()
    }

    updateProfile = () => {
        let updateData = {}
        let storage = JSON.parse(localStorage.getItem("userData"))
        updateData = { ...updateData, userId: storage[0].userId }
        if (this.state.fullname) {
            updateData = { ...updateData, fullname: this.state.fullname }
        }
        let birthdate = []
        if (this.state.birthdateYear) {
            birthdate.push(this.state.birthdateYear)
        }
        if (this.state.birthdateMonth) {
            birthdate.push(this.state.birthdateMonth)
        }
        if (this.state.birthdateDate) {
            birthdate.push(this.state.birthdateDate)
        }
        if (birthdate.length > 2) {
            birthdate = birthdate.join("")
            updateData = { ...updateData, birthdate }
        }
        if (this.state.sex) {
            updateData = { ...updateData, sex: this.state.sex }
        }
        if (updateData.fullname || updateData.birthdate || updateData.sex) {
            axios.put("http://localhost:5555/auth/updateProfile", updateData)
                .then(res => {
                    alert("Your profile has been changed")
                    this.props.getData()
                    this.setState({ editFullName: false, editBirthDate: false, editGender: false, fullname: "", birthdateYear: "", birthdateMonth: "", birthdateDate: "", sex: "" })
                    birthdate = []
                    updateData = {}
                })
                .catch()
        } else {
            alert("There is no data to be edited")
        }
    }

    getUserPic = (val) => {
        switch (false) {
            case val.type.split("/")[1] === "png" || val.type.split("/")[1] === "jpeg":
                alert("File must be an image")
                break;
            case val.size < 200000:
                alert("File size must be smaller than 200Kb")
                break;
            default:
                this.setState({ userpic: val })
        }
    }

    renderYear = () => {
        let d = new Date()
        let x = d.getFullYear() - 12
        let y = []
        for (let i = 0; i < 60; i++) { y.push(x - i) }
        let z = y.map(val => {
            return (
                <option value={val} >{val}</option>
            )
        })
        return z
    }

    renderDate = () => {
        let y = []
        switch (true) {
            case parseInt(this.state.birthdateMonth) === 1 || parseInt(this.state.birthdateMonth) === 3 || parseInt(this.state.birthdateMonth) === 5 || parseInt(this.state.birthdateMonth) === 7 || parseInt(this.state.birthdateMonth) === 8 || parseInt(this.state.birthdateMonth) === 10 || parseInt(this.state.birthdateMonth) === 12:
                for (let i = 1; i < 32; i++) {
                    if (i < 10) { y.push("0" + i) }
                    else { y.push(i) }
                }
                break;
            case parseInt(this.state.birthdateMonth) === 4 || parseInt(this.state.birthdateMonth) === 6 || parseInt(this.state.birthdateMonth) === 9 || parseInt(this.state.birthdateMonth) === 11:
                for (let i = 1; i < 31; i++) {
                    if (i < 10) { y.push("0" + i) }
                    else { y.push(i) }
                }
                break;
            case parseInt(this.state.birthdateMonth) === 2 && parseInt(this.state.birthdateYear) % 4 === 0:
                for (let i = 1; i < 30; i++) {
                    if (i < 10) { y.push("0" + i) }
                    else { y.push(i) }
                }
                break;
            case parseInt(this.state.birthdateMonth) === 2 && parseInt(this.state.birthdateYear) % 4 !== 0:
                for (let i = 1; i < 29; i++) {
                    if (i < 10) { y.push("0" + i) }
                    else { y.push(i) }
                }
                break;
            default:
                break;
        }
        let z = y.map(val => {
            return (
                <option value={val} >{val}</option>
            )
        })
        return z
    }

    saveClick = () => {
        let fd = new FormData()
        let data = {
            username: this.props.loginRedux[0].username
        }
        fd.append("userPic", this.state.userpic)
        fd.append("data", JSON.stringify(data))
        axios.put("http://localhost:5555/upload/uploaduserpic", fd)
            .then(res => {
                this.renderPic()
                this.setState({ editPic: false, userpic: "" })
            })
            .catch()
    }

    deleteClick = () => {
        axios.put("http://localhost:5555/upload/deleteuserpic",
            {
                username: this.props.loginRedux[0].username
            }
        )
            .then(res => {
                this.setState({ renderpic: "images/userpics/nopic.png", editPic: false, userpic: "" })
            })
            .catch()
    }

    renderPic = () => {
        let storage = JSON.parse(localStorage.getItem("userData"))
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/auth/getdata", {
            params: {
                userId: storage[0].userId
            },
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data[0].userpic !== null) {
                    this.setState({ renderpic: res.data[0].userpic })
                }
            })
            .catch()
    }

    handleBlurPostalCode = (val) => {
        if (val === "") { this.setState({ postalCode: "a" }) }
        else if (isNaN(val) === true || val.length < 5) { this.setState({ postalCode: false }) }
        else {
            this.setState({ postalCode: val });
            this.props.showLocation(val)
        }
    }

    saveAddressClick = () => {
        switch (true) {
            case this.state.dataAddress.length >= 6:
                alert("You already save 6 addresses")
                document.getElementById("addressname").value = '';
                document.getElementById("postalcode").value = '';
                document.getElementById("address").value = '';
                this.setState({ postalCode: "a", address: "", addressname: "" })
                break;
            case this.state.dataAddress.filter(val => val.addressname === this.state.addressname).length > 0:
                alert("You already use that address name")
                break;
            default:
                axios.post("http://localhost:5555/auth/adduseraddress",
                    {
                        userId: this.props.loginRedux[0].userId,
                        username: this.props.loginRedux[0].username,
                        addressname: this.state.addressname,
                        address: this.state.address,
                        district: this.props.locationRedux[0].district,
                        cityregency: this.props.locationRedux[0].cityregency,
                        province: this.props.locationRedux[0].province,
                        postalcode: this.state.postalCode
                    }
                )
                    .then(res => {
                        this.getAddress()
                        document.getElementById("addressname").value = '';
                        document.getElementById("postalcode").value = '';
                        document.getElementById("address").value = '';
                        this.setState({ postalCode: "a", address: "", addressname: "" })
                    }).catch()
                break;
        }
    }

    getAddress = () => {
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/auth/getaddress", {
            params: {
                username: this.props.loginRedux[0].username
            },
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({ dataAddress: res.data })
                } else {
                    this.setState({ dataAddress: [] })
                }
            })
            .catch()
    }

    renderAddress = () => {
        let z = this.state.dataAddress.map(val => {
            return (
                <Card style={{ width: "350px" }} className="m-1 mb-2" >
                    <CardHeader>{val.addressname}</CardHeader>
                    <CardBody>
                        <CardText>
                            {val.user_address},&nbsp;{val.user_district}.
                            <br></br>
                            {val.user_cityregency},&nbsp;{val.user_province},
                            &nbsp;{val.user_postalcode}.
                        </CardText>
                    </CardBody>
                    <CardFooter>
                        <Button size="sm" onClick={() => { this.deleteAddress(val.addressId) }} >Delete</Button>
                    </CardFooter>
                </Card>
            )
        })
        return z
    }

    deleteAddress = (val) => {
        axios.delete("http://localhost:5555/auth/deleteaddress/" + val)
            .then(res => {
                this.getAddress()
            })
            .catch()
    }

    resendClick = () => {
        this.props.sendVerifyEmail(this.props.loginRedux[0])
    }

    addPayment = (val) => {
        if (val === "card") {
            switch (true) {
                case this.state.paymentType === "":
                    alert("select card type : visa or mastercard")
                    break;
                case this.state.nameOncard === "" || this.state.cardNumber === "" || this.state.cardExp === "" || this.state.securityCode === "":
                    alert("complete all empty field")
                    break;
                default:
                    axios.post("http://localhost:5555/auth/adduserpayment",
                        {
                            userId: this.props.loginRedux[0].userId,
                            type: val,
                            bank: this.state.paymentType,
                            name: this.state.nameOncard,
                            number: this.state.cardNumber,
                            expiry: this.state.cardExp,
                            securitycode: this.state.securityCode
                        }
                    )
                        .then(res => {
                            this.getPayment()
                            // document.getElementById("addressname").value = '';
                            // document.getElementById("postalcode").value = '';
                            // document.getElementById("address").value = '';
                            this.setState({ paymentType: "", nameOncard: "", cardNumber: "", cardExp: "", securitycode: "" })
                        }).catch()
                    break;
            }
        } else {
            switch (true) {
                case this.state.bank === "":
                    alert("select your bank")
                    break;
                case this.state.accountName === "" || this.state.accountNumber === "":
                    alert("complete all empty field")
                    break;
                default:
                    axios.post("http://localhost:5555/auth/adduserpayment",
                        {
                            userId: this.props.loginRedux[0].userId,
                            type: val,
                            bank: this.state.bank,
                            name: this.state.accountName,
                            number: this.state.accountNumber
                        }
                    )
                        .then(res => {
                            this.getPayment()
                            document.getElementById("accountName").value = '';
                            this.setState({ bank: "", accountName: "", accountNumber: "", bankInput: false })
                        }).catch()
                    break;
            }
        }
    }

    getPayment = () => {
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/auth/getpayment", {
            params: {
                userId: this.props.loginRedux[0].userId
            },
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({ dataPayment: res.data })
                } else {
                    this.setState({ dataPayment: [] })
                }
            })
            .catch()
    }

    deletePayment = (val) => {
        axios.delete("http://localhost:5555/auth/deletepayment/" + val)
            .then(res => {
                this.getPayment()
            })
            .catch()
    }

    renderPayment = () => {
        let map = this.state.dataPayment.map(val => {
            return (
                <Card style={{ width: "700px" }} className="ml-5 m-1 mb-2" >
                    {
                        val.type === "card"
                            ?
                            <CardHeader className="py-1" >Card</CardHeader>
                            :
                            <CardHeader className="py-1" >Bank Transfer</CardHeader>
                    }
                    <CardBody className="py-auto" >
                        <Row >
                            <Col sm="3" >
                            {
                                val.bank === "visa"
                                ?
                                <img src={require('./visa.png')} id="imgCard" alt="No pic" />
                                :
                                null
                            }
                            {
                                val.bank === "mastercard"
                                ?
                                <img src={require('./mastercard.jpg')} id="imgCard" alt="No pic" />
                                :
                                null
                            }
                            {
                                val.bank === "bca"
                                ?
                                <img src={require('./bca.png')} id="imgCard" alt="No pic" />
                                :
                                null
                            }
                            {
                                val.bank === "mandiri"
                                ?
                                <img src={require('./mandiri.jpg')} id="imgCard" alt="No pic" />
                                :
                                null
                            }
                            {
                                val.bank === "bni"
                                ?
                                <img src={require('./bni.png')} id="imgCard" alt="No pic" />
                                :
                                null
                            }
                            {
                                val.bank === "cimb"
                                ?
                                <img src={require('./cimb.jpg')} id="imgCard" alt="No pic" />
                                :
                                null
                            }
                            {
                                val.bank !== "cimb" && val.bank !== "bni" && val.bank !== "mandiri" && val.bank !== "bca" && val.bank !== "visa" && val.bank !== "mastercard"
                                ?
                                <div className="font-weight-bold" >
                                    {val.bank} Bank
                                </div>
                                :
                                null
                            }
                            </Col>
                            <Col sm="7" >
                                <table >
                                    <tr >
                                        <td >
                                            Name
                                        </td>
                                        <td >
                                            : {val.name}
                                        </td>
                                    </tr>
                                    <tr >
                                        {
                                            val.type === "card"
                                                ?
                                                <td >
                                                    Card Number
                                                </td>
                                                :
                                                <td >
                                                    Acc Number
                                                </td>
                                        }
                                        <td >
                                            : {val.number}
                                        </td>
                                    </tr>
                                </table>
                            </Col>
                            <Col sm="2" >
                                <Button size="sm" onClick={() => this.deletePayment(val.paymentId)} >
                                    Delete
                                </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            )
        })
        return map
    }

    render() {
        switch (true) {
            case this.props.loginRedux.length > 0:
                return (
                    <div className="mt-3 mx-5" id="curtain2">
                        {
                            this.state.modalOpen === true
                                ?
                                <Modaleditprofile />
                                :
                                null
                        }
                        <h1>{this.props.loginRedux[0].fullname}</h1>
                        <Nav className="mt-3" tabs>
                            <NavItem>
                                <NavLink id="point" className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }} >
                                    <p style={{ textAlign: "center" }} className="h5">Profile</p>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink id="point" className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }} >
                                    <p style={{ textAlign: "center" }} className="h5">Address</p>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink id="point" className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>
                                    <p style={{ textAlign: "center" }} className="h5">Payment</p>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent id="curtain2" style={{ backgroundColor: "#ffc61a" }} className="mt-3" activeTab={this.state.activeTab} >
                            <TabPane style={{ width: "1000px" }} tabId="1" >
                                <Row>
                                    <Card style={{ width: "300px" }} className="mr-3">
                                        <CardImg className="mx-auto my-3" src={"http://localhost:5555/" + this.state.renderpic} style={{ height: "250px", width: "250px", objectFit: "cover" }} alt="Card image cap" />
                                        {
                                            this.state.editPic === true
                                                ?
                                                <CardBody>
                                                    <CardText className="mb-0">Upload picture</CardText>
                                                    <CardText>
                                                        <small>pic size max 200kb</small>
                                                    </CardText>
                                                    <CustomInput type="file" label={this.state.userpic.name} onChange={e => this.getUserPic(e.target.files[0])} />
                                                </CardBody>
                                                :
                                                null
                                        }
                                        {
                                            this.state.editPic === false
                                                ?
                                                <CardFooter>
                                                    <Button onClick={() => this.setState({ editPic: true })} >Edit</Button>
                                                </CardFooter>
                                                :
                                                <CardFooter>
                                                    <Button onClick={() => this.setState({ editPic: false, userpic: "" })} >Cancel</Button>
                                                    <Button className="ml-2" onClick={() => { this.deleteClick() }}>Delete</Button>
                                                    <Button disabled={!this.state.userpic} className="ml-2" onClick={() => { this.saveClick() }}>Upload</Button>
                                                </CardFooter>
                                        }
                                    </Card>
                                    <p className="mt-3">
                                        {
                                            this.state.editFullName === false
                                                ?
                                                <span className="mr-3">Fullname : {this.props.loginRedux[0].fullname}</span>
                                                :
                                                <span className="mr-3">Fullname : <input autoFocus type="text" placeholder={this.props.loginRedux[0].fullname} onChange={e => this.setState({ fullname: e.target.value })} /></span>
                                        }
                                        {
                                            this.state.editFullName === false
                                                ?
                                                <Button size="sm" onClick={e => this.setState({ editFullName: true })} >Edit</Button>
                                                :
                                                <Button size="sm" onClick={e => this.setState({ editFullName: false, fullname: "" })} >Cancel</Button>
                                        }
                                        <br></br>
                                        <br></br>
                                        {
                                            this.state.editBirthDate === false
                                                ?
                                                <span className="mr-3">Birthdate : {new Date(this.props.loginRedux[0].birthdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                :
                                                <span className="mr-3">Birthdate :
                                                <select disabled={!this.state.birthdateMonth || !this.state.birthdateYear} onClick={e => this.setState({ birthdateDate: e.target.value })} >
                                                        <option value="" >Date</option>
                                                        {this.renderDate()}
                                                    </select>
                                                    &nbsp;
                                                <select onClick={e => this.setState({ birthdateMonth: e.target.value, birthdateDate: "" })} >
                                                        <option value="" >Month</option>
                                                        <option value="01" >Jan</option>
                                                        <option value="02" >Feb</option>
                                                        <option value="03" >Mar</option>
                                                        <option value="04" >Apr</option>
                                                        <option value="05" >May</option>
                                                        <option value="06" >Jun</option>
                                                        <option value="07" >Jul</option>
                                                        <option value="08" >Agt</option>
                                                        <option value="09" >Sep</option>
                                                        <option value="10" >Oct</option>
                                                        <option value="11" >Nov</option>
                                                        <option value="12" >Dec</option>
                                                    </select>
                                                    &nbsp;
                                                <select onClick={e => this.setState({ birthdateYear: e.target.value, birthdateDate: "" })} >
                                                        <option value="" >Year</option>
                                                        {this.renderYear()}
                                                    </select>
                                                </span>
                                        }
                                        {
                                            this.state.editBirthDate === false
                                                ?
                                                <Button size="sm" onClick={e => this.setState({ editBirthDate: true })} >Edit</Button>
                                                :
                                                <Button size="sm" onClick={e => this.setState({ editBirthDate: false, birthdateYear: "", birthdateMonth: "", birthdateDate: "" })} >Cancel</Button>
                                        }
                                        <br></br>
                                        {
                                            this.state.editBirthDate === true
                                                ?
                                                <div>
                                                    <small className="ml-3">start by choosing <b>year</b>, then <b>month</b>, then <b>date</b></small>
                                                    <br></br>
                                                </div>
                                                :
                                                null
                                        }
                                        <br></br>
                                        {
                                            this.state.editGender === false
                                                ?
                                                <span className="mr-3">Gender : {this.props.loginRedux[0].gender}</span>
                                                :
                                                <span className="mr-3">Gender : <input value="male" name="radio2" type="radio" onClick={e => this.setState({ sex: e.target.value })} /> male <input value="female" name="radio2" type="radio" onClick={e => this.setState({ sex: e.target.value })} /> female </span>
                                        }
                                        {
                                            this.state.editGender === false
                                                ?
                                                <Button size="sm" onClick={e => this.setState({ editGender: true })} >Edit</Button>
                                                :
                                                <Button size="sm" onClick={e => this.setState({ editGender: false, sex: "" })} >Cancel</Button>
                                        }
                                        <br></br>
                                        <br></br>
                                        <span className="mr-3">Cellphone : {this.props.loginRedux[0].cellphone}</span>
                                        {
                                            this.props.loginRedux[0].cellphoneverified === 1
                                                ?
                                                <Badge color="success">Verified</Badge>
                                                :
                                                <Button size="sm" onClick={() => this.setState({ modalOpen: true })} >Verify</Button>
                                        }
                                        <br></br>
                                        <br></br>
                                        <span className="mr-3">E-mail : {this.props.loginRedux[0].email}</span>
                                        {
                                            this.props.loginRedux[0].emailverified === 1
                                                ?
                                                <Badge color="success">Verified</Badge>
                                                :
                                                <Button size="sm" onClick={() => { this.resendClick() }} >Verify</Button>
                                        }
                                        <br></br>
                                        <br></br>
                                        <Button onClick={() => { this.updateProfile() }} >Save Changes</Button>
                                    </p>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2" >
                                <p>
                                    Add Address :
                                    <br></br>
                                    <small>(You can save up to 4 addresses)</small>
                                </p>
                                <Input id="addressname" style={{ width: "400px" }} className="my-3" placeholder="Address name (exp : Home or Office)" onChange={e => this.setState({ addressname: e.target.value })} />
                                <FormGroup>
                                    <Input id="postalcode" style={{ width: "400px" }} maxLength="5" invalid={!this.state.postalCode} placeholder="Postal code" onChange={e => this.handleBlurPostalCode(e.target.value)} />
                                    <FormFeedback onInvalid>Please type a correct postal code</FormFeedback>
                                </FormGroup>
                                {
                                    this.props.locationRedux.length > 0
                                        ?
                                        <p>Province : {this.props.locationRedux[0].province} <br></br>
                                            City/Regency : {this.props.locationRedux[0].cityregency} <br></br>
                                            District : {this.props.locationRedux[0].district}
                                        </p>
                                        :
                                        null
                                }
                                <Input id="address" style={{ width: "400px" }} disabled={!this.state.postalCode || this.state.postalCode === "a"} placeholder="Address (exp : JL.Roda No.3)" className="mb-3" onChange={e => this.setState({ address: e.target.value })} />
                                <Button disabled={!this.state.address} className="mb-5" onClick={() => { this.saveAddressClick() }}  >Add Address</Button>
                                <hr></hr>
                                <p>Your Address(es) :</p>
                                <div id="curtain2" style={{ display: "flex", flexWrap: "wrap" }} >
                                    {this.renderAddress()}
                                </div>
                            </TabPane>
                            <TabPane tabId="3" >
                                <p >
                                    Add Payment(s) method :
                                    <br></br>
                                    <br></br>
                                    <Row className="ml-5" >
                                        <Card className="mr-5 mb-2" >
                                            <CardHeader >
                                                Credit/Debit Card
                                            </CardHeader>
                                            <CardBody >
                                                <p >
                                                    <input value="visa" name="radio4" type="radio" onClick={e => this.setState({ paymentType: e.target.value })} /> <img src={require('./visa.png')} id="imgCard" alt="No pic" />
                                                    <input className="ml-3" value="mastercard" name="radio4" type="radio" onClick={e => this.setState({ paymentType: e.target.value })} /> <img src={require('./mastercard.jpg')} id="imgCard" alt="No pic" />
                                                </p>
                                                <table >
                                                    <tr >
                                                        <td >
                                                            Name on card
                                                        </td>
                                                        <td >
                                                            : <input style={{ borderRadius: "5px" }} onChange={e => this.setState({ nameOncard: e.target.value })} />
                                                        </td>
                                                    </tr>
                                                    <tr >
                                                        <td >
                                                            Card Number
                                                        </td>
                                                        <td >
                                                            : <NumberFormat format="#### #### #### ####" placeholder="#### #### #### ####" mask="_" decimalScale="0" allowNegative={false} style={{ borderRadius: "5px" }} value={this.state.cardNumber} onChange={e => this.setState({ cardNumber: e.target.value })} />
                                                        </td>
                                                    </tr>
                                                    <tr >
                                                        <td >
                                                            Card Expiry
                                                        </td>
                                                        <td >
                                                            : <NumberFormat format="##/##" placeholder="MM/YY" mask={['M', 'M', 'Y', 'Y']} decimalScale="0" allowNegative={false} style={{ width: "70px", borderRadius: "5px" }} value={this.state.cardExp} onChange={e => this.setState({ cardExp: e.target.value })} />
                                                        </td>
                                                    </tr>
                                                    <tr >
                                                        <td >
                                                            Security Code
                                                        </td>
                                                        <td >
                                                            : <NumberFormat placeholder="###" maxLength="3" decimalScale="0" allowNegative={false} style={{ width: "70px", borderRadius: "5px" }} value={this.state.securityCode} onChange={e => this.setState({ securityCode: e.target.value })} />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </CardBody>
                                            <CardFooter >
                                                <Button onClick={() => this.addPayment("card")} >
                                                    Add
                                                    </Button>
                                            </CardFooter>
                                        </Card>
                                        <Card className="mb-2" >
                                            <CardHeader >
                                                Bank Transfer
                                            </CardHeader>
                                            <CardBody >
                                                <p className="mb-0" >
                                                    <input value="bca" name="radio5" type="radio" onClick={e => this.setState({ bank: e.target.value, bankInput: false })} /> <img src={require('./bca.png')} id="imgCard" alt="No pic" />
                                                    <input className="ml-3" value="mandiri" name="radio5" type="radio" onClick={e => this.setState({ bank: e.target.value, bankInput: false })} /> <img src={require('./mandiri.jpg')} id="imgCard" alt="No pic" />
                                                    <input className="ml-3" value="bni" name="radio5" type="radio" onClick={e => this.setState({ bank: e.target.value, bankInput: false })} /> <img src={require('./bni.jpg')} id="imgCard" alt="No pic" />
                                                    <br></br>
                                                    <input value="cimb" name="radio5" type="radio" onClick={e => this.setState({ bank: e.target.value, bankInput: false })} /> <img src={require('./cimb.jpg')} id="imgCard" alt="No pic" />
                                                    <input className="ml-3" name="radio5" type="radio" onClick={e => this.setState({ bank: "", bankInput: true })} /> Other Bank
                                                    {
                                                        this.state.bankInput
                                                            ?
                                                            <input autoFocus className="ml-1" placeholder="bank name" style={{ borderRadius: "5px" }} onChange={e => this.setState({ bank: e.target.value })} />
                                                            :
                                                            null
                                                    }
                                                </p>
                                                <table >
                                                    <tr >
                                                        <td >
                                                            Account Name
                                                        </td>
                                                        <td >
                                                            : <input id="accountName" style={{ borderRadius: "5px" }} onChange={e => this.setState({ accountName: e.target.value })} />
                                                        </td>
                                                    </tr>
                                                    <tr >
                                                        <td >
                                                            Account Number
                                                        </td>
                                                        <td >
                                                            : <NumberFormat format="#### #### #### ####" placeholder="#### #### #### ####" mask="_" decimalScale="0" allowNegative={false} style={{ borderRadius: "5px" }} value={this.state.accountNumber} onChange={e => this.setState({ accountNumber: e.target.value })} />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </CardBody>
                                            <CardFooter >
                                                <Button onClick={() => this.addPayment("transfer")} >
                                                    Add
                                                    </Button>
                                            </CardFooter>
                                        </Card>
                                    </Row>
                                </p>
                                <hr></hr>
                                <p>Your Payment(s) :</p>
                                <div id="curtain2" style={{ display: "flex", flexWrap: "wrap" }} >
                                    {this.renderPayment()}
                                </div>
                                <div className="my-5" ></div>
                            </TabPane>
                        </TabContent>
                    </div>
                )
            default:
                return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        loginRedux: state.login.user,
        locationRedux: state.location.location
    }
}

export default connect(mapStateToProps, { showLocation, getData, sendVerifyEmail })(Editprofile)