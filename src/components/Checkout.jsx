import React, { Component } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";
import {
    Row, Col, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    TabContent, TabPane, Nav, NavItem, NavLink, CardHeader, Input, FormGroup, FormFeedback, Badge,
    Modal, ModalHeader, ModalBody, ModalFooter, Label
} from 'reactstrap';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { emptyCart } from "../action/tran"

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            grandTotal: 0,
            totalWeight: 0,
            cost: [],
            postalCode: "a",
            totalDeliveryCost: 0,
            userAdress: [],
            address: "",
            dataAddress: [],
            userCitySelect: "",
            userAddressSelect: {},
            bank: "",
            dataPayment: [],
            userPayment: "",
            userPaymentSelect: {},
            paymentType: "",
            nameOncard: "",
            cardNumber: "",
            cardExp: "",
            securityCode: "",
            backToCart: false,
            email: "a",
            recipientName: "",
            cellphone: "a"
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    componentDidMount() {
        this.getTotalPrice(this.props.cartRedux)
        this.getTotalWeight(this.props.cartRedux)
        if (this.props.loginRedux.length > 0) {
            this.getAddress()
            this.getPayment()
        }
        for (let i = 0; i < this.props.cartRedux.length; i++) {
            if (this.props.cartRedux[i].inventory - this.props.cartRedux[i].checkoutqty < this.props.cartRedux[i].qty) {
                alert("can not continue to checkout, there are items in your cart that exceed the seller's inventory.")
                this.setState({ backToCart: true })
            }
        }
        this.modifyCheckout("add")
        this.countdown = setTimeout(
            () => {
                this.modifyCheckout("minus")
                this.setState({ backToCart: true })
            },
            60000
        )
    }

    modifyCheckout = (val) => {
        let y = this.props.cartRedux
        for (let i = 0; i < y.length; i++) {
            axios.get("http://localhost:5555/tran/getcheckoutqty", {
                params: {
                    productId: y[i].productId
                }
            })
                .then(res => {
                    let z
                    if (val === "add") {
                        z = res.data[0].checkoutqty + y[i].qty
                        localStorage.setItem("checkout", "been checkout");
                    } else {
                        z = res.data[0].checkoutqty - y[i].qty
                        localStorage.removeItem("checkout");
                    }
                    axios.put("http://localhost:5555/tran/changecheckoutqty", {
                        productId: y[i].productId,
                        checkoutqty: z
                    })
                        .then()
                        .catch()
                })
                .catch()
        }
    }

    getTotalPrice = (array) => {
        let z = 0
        for (let i = 0; i < array.length; i++) {
            switch (true) {
                case array[i].discpercent !== null:
                    z += (array[i].price * (100 - array[i].discpercent) / 100) * array[i].qty
                    break;
                case array[i].discvalue !== null:
                    z += (array[i].price - array[i].discvalue) * array[i].qty
                    break;
                default:
                    z += array[i].qty * array[i].price
                    break;
            }
        }
        this.setState({ grandTotal: z })
    }

    getTotalWeight = (array) => {
        let z = 0
        for (let i = 0; i < array.length; i++) {
            z += array[i].qty * array[i].weight
        }
        this.setState({ totalWeight: z })
    }

    getDeliveryCost = (cityregency, type, index) => {
        let z = []
        let y = this.props.cartRedux
        for (let i = 0; i < y.length; i++) {
            let a = z.filter(val => val.storename === y[i].storename)
            let b = z.filter(val => val.storename !== y[i].storename)
            if (a.length > 0) {
                let c = a[0].weight
                let x = {
                    storename: y[i].storename,
                    store_cityregency: y[i].store_cityregency,
                    weight: c + (y[i].weight * y[i].qty)
                }
                b.push(x)
                z = b
            } else {
                let x = {
                    storename: y[i].storename,
                    store_cityregency: y[i].store_cityregency,
                    weight: y[i].weight * y[i].qty
                }
                z.push(x)
            }
        }
        let d = 0
        let e = []
        if (type === "input") {
            for (let i = 0; i < z.length; i++) {
                switch (true) {
                    case cityregency === z[i].store_cityregency:
                        e.push(5000)
                        d += z[i].weight * 5000
                        break;
                    case cityregency.indexOf("Jakarta") === 0 && z[i].store_cityregency.indexOf("Jakarta") === 0:
                        e.push(5000)
                        d += z[i].weight * 5000
                        break;
                    case cityregency === "":
                        this.setState({ cost: [], totalDeliveryCost: 0 })
                        break;
                    default:
                        e.push(6000)
                        d += z[i].weight * 6000
                        break;
                }

            }
        } else {
            if (this.state.dataAddress[index]) {
                for (let i = 0; i < z.length; i++) {
                    switch (true) {
                        case this.state.dataAddress[index].user_cityregency === z[i].store_cityregency:
                            e.push(5000)
                            d += z[i].weight * 5000
                            break;
                        case this.state.dataAddress[index].user_cityregency.indexOf("Jakarta") === 0 && z[i].store_cityregency.indexOf("Jakarta") === 0:
                            e.push(5000)
                            d += z[i].weight * 5000
                            break;
                        default:
                            e.push(6000)
                            d += z[i].weight * 6000
                            break;
                    }
                }
                this.setState({ userAddressSelect: this.state.dataAddress[index], userCitySelect: index, postalCode: "a", userAdress: [] })
            }
            document.getElementById("postalcode").value = '';
            document.getElementById("address").value = '';
        }
        this.setState({ totalDeliveryCost: d, cost: e })
    }

    handleBlurPostalCode = (val) => {
        this.setState({ userCitySelect: "", userAddressSelect: {} })
        if (val === "") { this.setState({ postalCode: "a", cost: [], totalDeliveryCost: 0, userAdress: [] }) }
        else if (isNaN(val) === true || val.length < 5) { this.setState({ postalCode: false, cost: [], totalDeliveryCost: 0, userAdress: [] }) }
        else {
            this.setState({ postalCode: val })
            axios.get("http://localhost:5555/store/getlocation", {
                params: {
                    postalcode: val
                }
            })
                .then(res => {
                    if (res.data.length === 0) {
                        alert("Postal code not found")
                    } else {
                        this.setState({ userAdress: res.data })
                        this.getDeliveryCost(res.data[0].cityregency, "input", 0)
                    }
                })
                .catch()
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

    handleBlurEmail = (val) => {
        if (val === "") { this.setState({ email: "a" }) }
        else if (val.indexOf("@") === -1 || val.indexOf(".") === -1) { this.setState({ email: false }) }
        else { this.setState({ email: val }) }
    }

    handleBlurCellphone = (val) => {
        if (val === "") { this.setState({ cellphone: "a" }) }
        else if (isNaN(val) === true || val.length < 11 || val.substr(0, 1) !== "0") { this.setState({ cellphone: false }) }
        else { this.setState({ cellphone: val }) }
    }

    handleCard = (val) => {
        this.setState({ paymentType: "card", bank: val, userPayment: "" })

        var elle = document.getElementsByName("radio5")
        for (var i = 0; i < elle.length; i++) {
            elle[i].checked = false
        }
    }

    handleBank = (val) => {
        this.setState({ paymentType: "transfer", bank: val, userPayment: "", nameOncard: "", cardNumber: "", cardExp: "", securityCode: "" })

        var ele = document.getElementsByName("radio4")
        for (var i = 0; i < ele.length; i++) {
            ele[i].checked = false
        }
        document.getElementById("name").value = '';
        document.getElementById("number").value = '';
        document.getElementById("exp").value = '';
        document.getElementById("sec").value = '';
    }

    handlePayment = (index) => {
        if (this.state.dataPayment[index]) {
            this.setState({ userPaymentSelect: this.state.dataPayment[index], userPayment: index, paymentType: "", nameOncard: "", cardNumber: "", cardExp: "", securityCode: "", bank: "" })
        }

        var ele = document.getElementsByName("radio4")
        for (var i = 0; i < ele.length; i++) {
            ele[i].checked = false
        }
        document.getElementById("name").value = '';
        document.getElementById("number").value = '';
        document.getElementById("exp").value = '';
        document.getElementById("sec").value = '';

        var elle = document.getElementsByName("radio5")
        for (var i = 0; i < elle.length; i++) {
            elle[i].checked = false
        }
    }

    resetCountdown = () => {
        clearTimeout(this.countdown)
        this.countdown = setTimeout(
            () => {
                this.modifyCheckout("minus")
                this.setState({ backToCart: true })
            },
            60000
        )
    }

    placeOrder = () => {
        try {
            let entry = {}
            let recipientname, dest_address, dest_district, dest_cityregency, dest_province, dest_postalcode
            if (this.state.userAdress.length > 0) {
                dest_address = this.state.address
                dest_district = this.state.userAdress[0].district
                dest_cityregency = this.state.userAdress[0].cityregency
                dest_province = this.state.userAdress[0].province
                dest_postalcode = this.state.postalCode
            } else {
                dest_address = this.state.userAddressSelect.user_address
                dest_district = this.state.userAddressSelect.user_district
                dest_cityregency = this.state.userAddressSelect.user_cityregency
                dest_province = this.state.userAddressSelect.user_province
                dest_postalcode = this.state.userAddressSelect.user_postalcode
            }
            if (this.props.loginRedux.length > 0) {
                recipientname = this.props.loginRedux[0].fullname
            } else {
                recipientname = this.state.recipientName
            }
            if (!dest_address || dest_address === "") throw "insert delivery address"
            if (this.props.loginRedux.length === 0 && this.state.recipientName === "") throw "insert recipient name"
            if ((this.props.loginRedux.length === 0 && this.state.cellphone === "a") || (this.props.loginRedux.length === 0 && this.state.cellphone === false)) throw "insert recipient cellphone"
            if ((this.props.loginRedux.length === 0 && this.state.email === "a") || (this.props.loginRedux.length === 0 && this.state.email === false)) throw "insert your email"
            if (!this.state.userPaymentSelect.type && this.state.paymentType === "") throw "insert payment"
            if ((this.state.paymentType === "card" && this.state.nameOncard === "") || (this.state.paymentType === "card" && this.state.cardNumber === "") || (this.state.paymentType === "card" && this.state.cardExp === "") || (this.state.paymentType === "card" && this.state.securityCode === "")) throw "complete card data"
            entry = { ...entry, recipientname, dest_address, dest_district, dest_cityregency, dest_province, dest_postalcode }
            axios.post("http://localhost:5555/tran/addtrandelivery", entry)
                .then(pos => {
                    let data = {}
                    let localUser = localStorage.getItem("localUser")
                    let userId, email, cellphone, type, bankori, bankdest, name, number, expiry, securitycode, status
                    let trandate = []
                    let d = new Date()
                    let a = (d.getFullYear()).toString()
                    let b = d.getMonth() + 1
                    let c = d.getDate()
                    if (b < 10) { b = "0" + b }
                    if (c < 10) { c = "0" + c }
                    trandate.push(a)
                    trandate.push(b)
                    trandate.push(c)
                    trandate = trandate.join("")
                    let productcost = this.state.grandTotal
                    let deliverycost = this.state.totalDeliveryCost
                    let totalcost = this.state.totalDeliveryCost + this.state.grandTotal
                    if (this.props.loginRedux.length > 0) {
                        userId = this.props.loginRedux[0].userId
                        email = this.props.loginRedux[0].email
                        cellphone = this.props.loginRedux[0].cellphone
                    } else {
                        userId = localUser
                        email = this.state.email
                        cellphone = this.state.cellphone
                    }
                    switch (true) {
                        case this.state.paymentType === "card":
                            type = "card"
                            bankori = this.state.bank
                            name = this.state.nameOncard
                            number = this.state.cardNumber
                            expiry = this.state.cardExp
                            securitycode = this.state.securityCode
                            status = "payment done, waiting for the product(s) to be delivered"
                            data = { ...data, trandate, userId, email, cellphone, type, bankori, name, number, expiry, securitycode, productcost, deliverycost, totalcost, status }
                            break;
                        case this.state.paymentType === "transfer":
                            type = "transfer"
                            bankdest = this.state.bank
                            status = "waiting for payment"
                            data = { ...data, trandate, userId, email, cellphone, type, bankdest, productcost, deliverycost, totalcost, status }
                            break;
                        default:
                            type = this.state.userPaymentSelect.type
                            bankori = this.state.userPaymentSelect.bank
                            name = this.state.userPaymentSelect.name
                            number = this.state.userPaymentSelect.number
                            expiry = this.state.userPaymentSelect.expiry
                            securitycode = this.state.userPaymentSelect.securitycode
                            status = "payment done, waiting for the product(s) to be delivered"
                            data = { ...data, trandate, userId, email, cellphone, type, bankori, name, number, expiry, securitycode, productcost, deliverycost, totalcost, status }
                            break;
                    }
                    axios.post("http://localhost:5555/tran/addtranpayment", data)
                        .then(res => {
                            let y = this.props.cartRedux
                            let checkLoop = []
                            for (let i = 0; i < y.length; i++) {
                                checkLoop.push("go")
                                let input = {}
                                let tranpaymentId = res.data.insertId
                                let trandeliveryId = pos.data.insertId
                                let productId = y[i].productId
                                let qty = y[i].qty
                                let price = y[i].price
                                let note = y[i].note
                                let priceafterdisc
                                let totalprice
                                switch (true) {
                                    case y[i].discpercent === null && y[i].discvalue === null:
                                        priceafterdisc = price
                                        totalprice = priceafterdisc * qty
                                        input = { ...input, tranpaymentId, trandeliveryId, productId, qty, price, priceafterdisc, totalprice, note }
                                        break;
                                    case y[i].discpercent !== null && y[i].discvalue === null:
                                        let discpercent = y[i].discpercent
                                        priceafterdisc = price * (100 - discpercent) / 100
                                        totalprice = priceafterdisc * qty
                                        input = { ...input, tranpaymentId, trandeliveryId, productId, qty, price, discpercent, priceafterdisc, totalprice, note }
                                        break;
                                    case y[i].discpercent === null && y[i].discvalue !== null:
                                        let discvalue = y[i].discvalue
                                        priceafterdisc = price - discvalue
                                        totalprice = priceafterdisc * qty
                                        input = { ...input, tranpaymentId, trandeliveryId, productId, qty, price, discvalue, priceafterdisc, totalprice, note }
                                        break;
                                    default:
                                        break;
                                }
                                axios.post("http://localhost:5555/tran/addtrandetail", input)
                                    .then()
                                    .catch()

                                axios.get("http://localhost:5555/prod/getproductdetail", {
                                    params: {
                                        productId: productId
                                    }
                                })
                                    .then(res => {
                                        axios.put("http://localhost:5555/prod/changeproductinventory", {
                                            productId: productId,
                                            inventory: res.data[0].inventory - qty,
                                            sales: res.data[0].sales + qty
                                        })
                                            .then()
                                            .catch()
                                    })
                                    .catch()

                                if (checkLoop.length === y.length) {
                                    // hapus dari cart
                                    this.modifyCheckout("minus")
                                    this.setState({ modal: true })
                                    let cart = JSON.parse(localStorage.getItem("cart"))
                                    let cartLogin = JSON.parse(localStorage.getItem("cartLogin"))
                                    switch (true) {
                                        case cartLogin !== null:
                                            for (let i = 0; i < this.props.cartRedux.length; i++) {
                                                axios.delete("http://localhost:5555/tran/deletecart/" + this.props.cartRedux[i].cartId)
                                                    .then()
                                                    .catch()
                                            }
                                            this.props.emptyCart("cartLogin")
                                            break;
                                        case cart !== null:
                                            for (let i = 0; i < this.props.cartRedux.length; i++) {
                                                axios.delete("http://localhost:5555/tran/deletecartnonlogin/" + this.props.cartRedux[i].cartId)
                                                    .then()
                                                    .catch()
                                            }
                                            this.props.emptyCart("cart")
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        })
                        .catch()
                })
                .catch()
        } catch (error) {
            alert(error)
            this.resetCountdown()
        }
    }

    renderCart = () => {
        let map = this.props.cartRedux.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/" + val.productpic1} style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.storename}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.weight}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.qty}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.weight * val.qty}
                    </td>
                    {
                        val.discvalue === null && val.discpercent === null
                            ?
                            <td className="p-2 text-center align-text-top" >
                                <NumberFormat value={val.price * val.qty} displayType={'text'} thousandSeparator={true} />
                            </td>
                            :
                            null
                    }
                    {
                        val.discpercent !== null
                            ?
                            <td className="p-2 text-center align-text-top" >
                                <NumberFormat displayType={'text'} value={(val.price * (100 - val.discpercent) / 100) * val.qty} thousandSeparator={true} />
                            </td>
                            :
                            null
                    }
                    {
                        val.discvalue !== null
                            ?
                            <td className="p-2 text-center align-text-top" >
                                <NumberFormat displayType={'text'} value={(val.price - val.discvalue) * val.qty} thousandSeparator={true} />
                            </td>
                            :
                            null
                    }
                </tr>
            )
        })
        return map
    }

    renderDeliveryCost = () => {
        let z = []
        let y = this.props.cartRedux
        for (let i = 0; i < y.length; i++) {
            let a = z.filter(val => val.storename === y[i].storename)
            let b = z.filter(val => val.storename !== y[i].storename)
            if (a.length > 0) {
                let c = a[0].weight
                let d = a[0].qty
                let x = {
                    storename: y[i].storename,
                    store_cityregency: y[i].store_cityregency,
                    weight: c + (y[i].weight * y[i].qty),
                    qty: d + y[i].qty
                }
                b.push(x)
                z = b
            } else {
                let x = {
                    storename: y[i].storename,
                    store_cityregency: y[i].store_cityregency,
                    weight: y[i].weight * y[i].qty,
                    qty: y[i].qty
                }
                z.push(x)
            }
        }
        let map = z.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" >
                        {val.storename}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.store_cityregency}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.qty}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={this.state.cost[index] ? this.state.cost[index] : null} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        {val.weight}
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={this.state.cost[index] * val.weight} displayType={'text'} thousandSeparator={true} />
                    </td>
                </tr>
            )
        })
        return map
    }

    renderAddress = () => {
        let map = this.state.dataAddress.map((val, index) => {
            return (
                <option value={index} >{val.addressname} : {val.user_cityregency}</option>
            )
        })
        return map
    }

    renderPayment = () => {
        let map = this.state.dataPayment.map((val, index) => {
            return (
                <option value={index} >{val.bank} : {val.number}</option>
            )
        })
        return map
    }

    renderModal = () => {
        if (this.props.loginRedux.length > 0) {
            return (
                <Modal isOpen={this.state.modal}>
                    {
                        this.state.paymentType === "transfer"
                            ?
                            <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Upload Bank Transfer Receipt Required</ModalHeader>
                            :
                            <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Transaction Success</ModalHeader>
                    }
                    <ModalBody>
                        {
                            this.state.paymentType === "transfer"
                                ?
                                <p className="text-justify">
                                    Please upload your <b >Bank Transfer Receipt</b> within 24 hours using this menu on the header :
                                    <br></br>
                                    <img src={require('./historylogin.png')} style={{ width: "300px", height: "300px", objectFit: "contain" }} alt="No pic" />
                                    <br></br>
                                    Thank you for shopping @SimpleStore.
                                </p>
                                :
                                <p className="text-justify">
                                    You can check your transaction status in this menu on the header :
                                    <br></br>
                                    <img src={require('./historylogin.png')} style={{ width: "300px", height: "300px", objectFit: "contain" }} alt="No pic" />
                                    <br></br>
                                    Thank you for shopping @SimpleStore.
                                </p>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" href="/" >Close</Button>
                    </ModalFooter>
                </Modal>
            )
        } else {
            return (
                <Modal isOpen={this.state.modal}>
                    {
                        this.state.paymentType === "card"
                            ?
                            <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Transaction Success</ModalHeader>
                            :
                            <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Upload Bank Transfer Receipt Required</ModalHeader>
                    }
                    <ModalBody>
                        {
                            this.state.paymentType === "card"
                                ?
                                <p className="text-justify">
                                    You can check your transaction status in this menu on the header :
                                    <br></br>
                                    <img src={require('./transtat.png')} style={{ width: "300px", height: "300px", objectFit: "contain" }} alt="No pic" />
                                    <br></br>
                                    Thank you for shopping @SimpleStore.
                                 </p>
                                :
                                <p className="text-justify">
                                    Please upload your <b >Bank Transfer Receipt</b> within 24 hours using this menu on the header :
                                    <br></br>
                                    <img src={require('./transtat.png')} style={{ width: "300px", height: "300px", objectFit: "contain" }} alt="No pic" />
                                    <br></br>
                                    Thank you for shopping @SimpleStore.
                                </p>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" href="/" >Close</Button>
                    </ModalFooter>
                </Modal>
            )
        }

    }

    render() {
        switch (true) {
            case this.state.backToCart:
                return <Redirect to="/Cart" />
            case this.props.cartRedux.length > 0 && !this.props.homeRedux:
                return (
                    <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                        {this.renderModal()}
                        <h1 >Checkout</h1>
                        <p className="mb-1 mt-3" style={{ backgroundColor: "#ffc61a" }} >Product Cost</p>
                        <table className="table-bordered mb-2" >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" >Brand</td>
                                <td className="p-2 text-center align-text-top" >Name</td>
                                <td className="p-2 text-center align-text-top" >Pic</td>
                                <td className="p-2 text-center align-text-top" >Seller</td>
                                <td className="p-2 text-center align-text-top" >Weight</td>
                                <td className="p-2 text-center align-text-top" >Purchase qty</td>
                                <td className="p-2 text-center align-text-top" >Total Weight</td>
                                <td className="p-2 text-center align-text-top" >Total Price</td>
                            </thead>
                            <tbody>
                                {this.renderCart()}
                                <tr >
                                    <td colSpan="6" className="text-right font-weight-bold p-2" >
                                        Grand Total
                                            </td>
                                    <td className="font-weight-bold p-2 text-center" >
                                        <NumberFormat suffix="pcs" displayType={'text'} value={this.props.cartQtyRedux} thousandSeparator={true} />
                                    </td>
                                    <td className="font-weight-bold p-2 text-center" >
                                        <NumberFormat suffix="kg" displayType={'text'} value={this.state.totalWeight} thousandSeparator={true} />
                                    </td>
                                    <td className="font-weight-bold p-2 text-center" >
                                        <NumberFormat prefix="IDR " displayType={'text'} value={this.state.grandTotal} thousandSeparator={true} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mb-1 mt-5" style={{ backgroundColor: "#ffc61a" }} >Delivery Cost</p>
                        <Row style={{ width: "1100px" }} >
                            <div className="ml-3 mr-4" >
                                <p className="mb-0" >Insert destination postal code :</p>
                                <FormGroup className="my-1" >
                                    <Input id="postalcode" style={{ width: "400px" }} maxLength="5" invalid={!this.state.postalCode} placeholder="Postal code" onChange={e => { this.handleBlurPostalCode(e.target.value); this.resetCountdown() }} />
                                    <FormFeedback onInvalid>Please type a correct postal code</FormFeedback>
                                </FormGroup>
                                {
                                    this.state.userAdress.length > 0
                                        ?
                                        <p className="my-0 mb-1" >Province : {this.state.userAdress[0].province} <br></br>
                                            City/Regency : {this.state.userAdress[0].cityregency} <br></br>
                                            District : {this.state.userAdress[0].district}
                                        </p>
                                        :
                                        null
                                }
                                <Input id="address" style={{ width: "400px" }} disabled={!this.state.postalCode || this.state.postalCode === "a"} placeholder="Address (exp : JL.Roda No.3)" className="mb-3" onChange={e => { this.setState({ address: e.target.value }); this.resetCountdown() }} />
                                {
                                    this.props.loginRedux.length === 0
                                        ?
                                        <Input style={{ width: "400px" }} disabled={!this.state.postalCode || this.state.postalCode === "a"} placeholder="Name (exp : Ms Liza)" className="mb-3" onChange={e => { this.setState({ recipientName: e.target.value }); this.resetCountdown() }} />
                                        :
                                        null
                                }
                                {
                                    this.props.loginRedux.length === 0
                                        ?
                                        <FormGroup>
                                            <Input style={{ width: "400px" }} disabled={!this.state.postalCode || this.state.postalCode === "a"} invalid={!this.state.cellphone} placeholder="Cellphone"  onChange={e => { this.handleBlurCellphone(e.target.value); this.resetCountdown() }} />
                                            <FormFeedback onInvalid>Please type a correct cellphone number</FormFeedback>      
                                        </FormGroup>
                                        :
                                        null
                                }
                                {
                                    this.state.dataAddress.length > 0
                                        ?
                                        <p className="mb-0" >or choose from your registered address(es) :</p>
                                        :
                                        null
                                }
                                {
                                    this.state.dataAddress.length > 0
                                        ?
                                        <select value={this.state.userCitySelect} onClick={e => { this.getDeliveryCost(this.state.dataAddress[0].user_cityregency, "select", e.target.value); this.resetCountdown() }} >
                                            <option value="" >Address</option>
                                            {this.renderAddress()}
                                        </select>
                                        :
                                        null
                                }
                            </div>
                            <div className="mx-0" >
                                <table className="table-bordered mb-1" >
                                    <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold" >
                                        <td></td>
                                        <td className="p-2 text-center align-text-top" >Seller</td>
                                        <td className="p-2 text-center align-text-top" >Seller Address</td>
                                        <td className="p-2 text-center align-text-top" >Qty</td>
                                        <td className="p-2 text-center align-text-top" >Cost/kg</td>
                                        <td className="p-2 text-center align-text-top" >Weight</td>
                                        <td className="p-2 text-center align-text-top" >Total Cost</td>
                                    </thead>
                                    <tbody >
                                        {this.renderDeliveryCost()}
                                        <tr >
                                            <td colSpan="3" className="text-right font-weight-bold p-2" >
                                                Grand Total
                                            </td>
                                            <td className="font-weight-bold p-2 text-center" >
                                                <NumberFormat suffix="pcs" displayType={'text'} value={this.props.cartQtyRedux} thousandSeparator={true} />
                                            </td>
                                            <td className="font-weight-bold p-2 text-center" >

                                            </td>
                                            <td className="font-weight-bold p-2 text-center" >
                                                <NumberFormat suffix="kg" displayType={'text'} value={this.state.totalWeight} thousandSeparator={true} />
                                            </td>
                                            <td className="font-weight-bold p-2 text-center" >
                                                <NumberFormat prefix="IDR " displayType={'text'} value={this.state.totalDeliveryCost} thousandSeparator={true} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div >
                                    <small>we are using <b >JNE regular service</b>, your product(s) will be arrive to your address within 3 working days</small>
                                </div>
                            </div>
                        </Row>
                        <div >
                            <p className="mb-1 mt-5" style={{ backgroundColor: "#ffc61a" }} >TOTAL COST</p>
                            <Row >
                                <table style={{ backgroundColor: "#ffc61a" }} className="ml-3 mr-4" >
                                    <thead >
                                        <td className="font-italic p-2 text-right" >
                                            PRODUCT COST
                                        </td>
                                        <td className="font-italic p-2 text-left" >
                                            +
                                        </td>
                                        <td className="font-italic p-2 text-right" >
                                            DELIVERY COST
                                        </td>
                                        <td className="font-italic p-2 text-left" >
                                            =
                                        </td>
                                        <td className="font-italic p-2 text-left" >
                                            TOTAL COST
                                        </td>
                                    </thead>
                                    <tbody >
                                        <tr >
                                            <td className="font-italic font-weight-bold p-2 text-left" >
                                                <NumberFormat prefix="IDR " displayType={'text'} value={this.state.grandTotal} thousandSeparator={true} />
                                            </td>
                                            <td className="font-italic font-weight-bold p-2 text-left" >
                                                +
                                            </td>
                                            <td className="font-italic font-weight-bold p-2 text-left" >
                                                <NumberFormat prefix="IDR " displayType={'text'} value={this.state.totalDeliveryCost} thousandSeparator={true} />
                                            </td>
                                            <td className="font-italic font-weight-bold p-2 text-left" >
                                                =
                                            </td>
                                            <td className="font-italic font-weight-bold p-2 text-left" >
                                                <NumberFormat prefix="IDR " displayType={'text'} value={this.state.totalDeliveryCost + this.state.grandTotal} thousandSeparator={true} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {
                                    this.props.loginRedux.length === 0
                                        ?
                                        <FormGroup>
                                            <Label for="exampleText">Insert your email :</Label>
                                            <Input id="exampleText" invalid={!this.state.email} style={{ width: "300px" }} placeholder="E-mail" type="text" onChange={e => { this.handleBlurEmail(e.target.value); this.resetCountdown() }} />
                                            <FormFeedback onInvalid>Not a correct email format</FormFeedback>
                                        </FormGroup>
                                        :
                                        null
                                }
                            </Row>
                            <div >
                                <p className="mb-1 mt-3" style={{ backgroundColor: "#ffc61a" }} >PAYMENT METHOD</p>
                                <Row className="ml-1" >
                                    <Card className="mr-5 mb-2" >
                                        <CardHeader >
                                            Credit/Debit Card
                                            </CardHeader>
                                        <CardBody >
                                            <p >
                                                <input value="visa" name="radio4" type="radio" onClick={e => { this.handleCard(e.target.value); this.resetCountdown() }} /> <img src={require('./visa.png')} id="imgCard" alt="No pic" />
                                                <input className="ml-3" value="mastercard" name="radio4" type="radio" onClick={e => { this.handleCard(e.target.value); this.resetCountdown() }} /> <img src={require('./mastercard.jpg')} id="imgCard" alt="No pic" />
                                            </p>
                                            <table >
                                                <tr >
                                                    <td >
                                                        Name on card
                                                        </td>
                                                    <td >
                                                        : <input disabled={this.state.paymentType !== "card"} id="name" style={{ borderRadius: "5px" }} onChange={e => { this.setState({ nameOncard: e.target.value }); this.resetCountdown() }} />
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td >
                                                        Card Number
                                                        </td>
                                                    <td >
                                                        : <NumberFormat disabled={this.state.paymentType !== "card"} id="number" format="#### #### #### ####" placeholder="#### #### #### ####" mask="_" decimalScale="0" allowNegative={false} style={{ borderRadius: "5px" }} value={this.state.cardNumber} onChange={e => { this.setState({ cardNumber: e.target.value }); this.resetCountdown() }} />
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td >
                                                        Card Expiry
                                                        </td>
                                                    <td >
                                                        : <NumberFormat disabled={this.state.paymentType !== "card"} id="exp" format="##/##" placeholder="MM/YY" mask={['M', 'M', 'Y', 'Y']} decimalScale="0" allowNegative={false} style={{ width: "70px", borderRadius: "5px" }} value={this.state.cardExp} onChange={e => { this.setState({ cardExp: e.target.value }); this.resetCountdown() }} />
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td >
                                                        Security Code
                                                        </td>
                                                    <td >
                                                        : <NumberFormat disabled={this.state.paymentType !== "card"} id="sec" placeholder="###" maxLength="3" decimalScale="0" allowNegative={false} style={{ width: "70px", borderRadius: "5px" }} value={this.state.securityCode} onChange={e => { this.setState({ securityCode: e.target.value }); this.resetCountdown() }} />
                                                    </td>
                                                </tr>
                                            </table>
                                        </CardBody>
                                    </Card>
                                    <Card className="mb-2" >
                                        <CardHeader >
                                            Bank Transfer
                                            </CardHeader>
                                        <CardBody >
                                            <p className="mb-0" >
                                                <input value="bca" name="radio5" type="radio" onClick={e => { this.handleBank(e.target.value); this.resetCountdown() }} /> <img src={require('./bca.png')} id="imgCard" alt="No pic" />
                                                <input className="ml-3" value="mandiri" name="radio5" type="radio" onClick={e => { this.handleBank(e.target.value); this.resetCountdown() }} /> <img src={require('./mandiri.jpg')} id="imgCard" alt="No pic" />
                                                <br></br>
                                                <input value="bni" name="radio5" type="radio" onClick={e => { this.handleBank(e.target.value); this.resetCountdown() }} /> <img src={require('./bni.jpg')} id="imgCard" alt="No pic" />
                                                <input className="ml-3" value="cimb" name="radio5" type="radio" onClick={e => { this.handleBank(e.target.value); this.resetCountdown() }} /> <img src={require('./cimb.jpg')} id="imgCard" alt="No pic" />
                                            </p>
                                            <table >
                                                <tr >
                                                    <td >
                                                        Account Name
                                                        </td>
                                                    <td >
                                                        : PT. Sindu Artha
                                                    </td>
                                                </tr>
                                                <tr >
                                                    <td >
                                                        Account Number
                                                        </td>
                                                    {
                                                        this.state.bank === "bca"
                                                            ?
                                                            <td >
                                                                : 226 01 09662 17 0
                                                        </td>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        this.state.bank === "mandiri"
                                                            ?
                                                            <td >
                                                                : 122 00 0973278 5
                                                        </td>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        this.state.bank === "bni"
                                                            ?
                                                            <td >
                                                                : 5463 78340 9
                                                        </td>
                                                            :
                                                            null
                                                    }
                                                    {
                                                        this.state.bank === "cimb"
                                                            ?
                                                            <td >
                                                                : 70 123100 6300
                                                        </td>
                                                            :
                                                            null
                                                    }
                                                </tr>
                                            </table>
                                        </CardBody>
                                    </Card>
                                </Row>
                                <Row className="ml-1" >
                                    <div style={{ marginRight: "235px" }} >
                                        {
                                            this.state.dataPayment.length > 0
                                                ?
                                                <p className="mb-0" >or choose from your registered payment(s) :</p>
                                                :
                                                null
                                        }
                                        {
                                            this.state.dataPayment.length > 0
                                                ?
                                                <select value={this.state.userPayment} onClick={e => { this.handlePayment(e.target.value); this.resetCountdown() }} >
                                                    <option value="" >Payment</option>
                                                    {this.renderPayment()}
                                                </select>
                                                :
                                                null
                                        }
                                    </div>
                                    <div >
                                        <Button style={{ width: "200px" }} onClick={() => this.placeOrder()} >
                                            Place Your Order
                                        </Button>
                                    </div>
                                </Row>
                            </div>
                            <div style={{ height: "50px" }} >

                            </div>
                        </div>
                    </div>
                )
            case this.props.cartRedux.length > 0 && this.props.homeRedux:
                return <Redirect to="/" />
            case this.state.modal:
                return (
                    <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                        {this.renderModal()}
                    </div>
                )
            default:
                alert("your cart is empty")
                return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        loginRedux: state.login.user,
        cartRedux: state.cart.cart,
        cartQtyRedux: state.cart.cartQty,
        locationRedux: state.location.location,
        homeRedux: state.home.home
    }
}


export default connect(mapStateToProps, { emptyCart })(Checkout)