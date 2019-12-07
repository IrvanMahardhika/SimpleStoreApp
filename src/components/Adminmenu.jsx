import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Row, Col, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    TabContent, TabPane, Nav, NavItem, NavLink, CardHeader, Input, FormGroup, FormFeedback, Badge,
    Modal, ModalHeader, ModalBody, ModalFooter, Label
} from 'reactstrap';
import axios from "axios";
import NumberFormat from "react-number-format";
import { Redirect } from "react-router-dom";

class Adminmenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalTransfer: false,
            modalReceiving: false,
            unpaidTransaction: [],
            paidTransaction: [],
            claimCompleteTransaction: [],
            transferpic: "",
            trandeliveryId: "",
            tranpaymentId: "",
            totalcost: "",
            deliveredpic: "",
            listUnapprovedStores: [],
            listUnapprovedProducts: [],
            modalProduct: false,
            productId: "",
            brand: "",
            name: "",
            color: "",
            weight: "",
            dimension: "",
            description: "",
            productpic1: "",
            productpic2: "",
            productpic3: "",
            mainPic: ""
        };
        this.toggleTransfer = this.toggleTransfer.bind(this);
    }

    toggleTransfer() {
        this.setState(prevState => ({
            modalTransfer: !prevState.modalTransfer
        }));
    }

    toggleReceiving() {
        this.setState(prevState => ({
            modalReceiving: !prevState.modalReceiving
        }));
    }

    toggleProduct() {
        this.setState(prevState => ({
            modalProduct: !prevState.modalProduct
        }));
    }

    componentDidMount() {
        this.getTransaction()
        this.getUnapprovedStores()
        this.getUnapprovedProducts()
    }

    getUnapprovedProducts = () => {
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getunapprovedproductforapproval", {
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({ listUnapprovedProducts: res.data })
                }
            })
            .catch()
    }

    getUnapprovedStores = () => {
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/store/getunapprovedstores", {
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({ listUnapprovedStores: res.data })
                }
            })
            .catch()
    }

    getTransaction = () => {
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/tran/getadmintransaction", {
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    let unpaidTransaction = res.data.filter(val => val.status === "payment done claim, waiting for admin approval")
                    let paidTransaction = res.data.filter(val => val.status === "payment done, waiting for the product(s) to be delivered")
                    let claimCompleteTransaction = res.data.filter(val => val.status === "received claim, waiting for admin approval")
                    this.setState({ unpaidTransaction: unpaidTransaction, claimCompleteTransaction: claimCompleteTransaction, paidTransaction: paidTransaction })
                }
            })
            .catch()
    }

    showTransfer = (transferpic, trandeliveryId, tranpaymentId, totalcost) => {
        this.setState({ modalTransfer: true, transferpic: transferpic, trandeliveryId: trandeliveryId, tranpaymentId: tranpaymentId, totalcost: totalcost })
    }

    showReceiving = (deliveredpic, trandeliveryId, tranpaymentId) => {
        this.setState({ modalReceiving: true, deliveredpic: deliveredpic, trandeliveryId: trandeliveryId, tranpaymentId: tranpaymentId })
    }

    showProducts = (productId, brand, name, color, weight, dimension, description, productpic1, productpic2, productpic3) => {
        this.setState({ modalProduct: true, productId: productId, brand: brand, name: name, color: color, weight: weight, dimension: dimension, description: description, productpic1: productpic1, productpic2: productpic2, productpic3: productpic3, mainPic: productpic1 })
    }

    approveTransfer = () => {
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
        axios.put("http://localhost:5555/tran/updatepaymentstatus", {
            status: "payment done, waiting for the product(s) to be delivered",
            tranpaymentId: this.state.tranpaymentId,
            tranconfirmdate: trandate
        })
            .then(res => {
                this.setState({ modalTransfer: false })
                alert("approval success")
                this.getTransaction()
            })
            .catch()
    }

    approveReceiving = () => {
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
        axios.put("http://localhost:5555/tran/updatecompleteddate", {
            completeddate: trandate,
            trandeliveryId: this.state.trandeliveryId
        })
            .then(res => {
                axios.put("http://localhost:5555/tran/updatetranstatus", {
                    status: "received by customer (transaction complete)",
                    tranpaymentId: this.state.tranpaymentId
                })
                    .then(pos => {
                        this.setState({ modalReceiving: false })
                        alert("approval success")
                        this.getTransaction()
                    })
                    .catch()
            })
            .catch()
    }

    approveStore = (storeId, userId) => {
        axios.put("http://localhost:5555/store/approvestoreinstores", {
            storeId: storeId,
        })
            .then(res => {
                alert("approval success")
                this.getUnapprovedStores()
            })
            .catch()
        axios.put("http://localhost:5555/store/approvestoreinusers", {
            userId: userId,
        })
            .then()
            .catch()
    }

    approveProduct = () => {
        axios.post("http://localhost:5555/prod/addproductintocheckout", {
            productId: this.state.productId
        })
            .then()
            .catch()
        axios.put("http://localhost:5555/prod/approveproduct", {
            productId: this.state.productId,
        })
            .then(res => {
                alert("approval success")
                this.setState({ modalProduct: false })
                this.getUnapprovedProducts()
            })
            .catch()
    }

    renderModalTransfer = () => {
        return (
            <Modal isOpen={this.state.modalTransfer}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Bank Transfer Proof for Transaction : {this.state.trandeliveryId}</ModalHeader>
                <ModalBody>
                    <p className="text-justify">
                        Total cost for this transaction is : &nbsp;
                        <b ><NumberFormat prefix="IDR " value={this.state.totalcost} displayType={'text'} thousandSeparator={true} /></b>
                    </p>
                    <img className="border" src={"http://localhost:5555/" + this.state.transferpic} style={{ height: "250px", width: "250px", objectFit: "cover" }} alt="No pic" />
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" onClick={() => this.approveTransfer()} >
                        Approve
                            </Button>
                    <Button size="sm" color="secondary" onClick={() => { this.toggleTransfer() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderModalReceiving = () => {
        return (
            <Modal isOpen={this.state.modalReceiving}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Receiving Proof for Transaction : {this.state.trandeliveryId}</ModalHeader>
                <ModalBody>
                    <img className="border" src={"http://localhost:5555/" + this.state.deliveredpic} style={{ height: "250px", width: "450px", objectFit: "contain" }} alt="No pic" />
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" onClick={() => this.approveReceiving()} >
                        Approve
                            </Button>
                    <Button size="sm" color="secondary" onClick={() => { this.toggleReceiving() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderModalProduct = () => {
        return (
            <Modal isOpen={this.state.modalProduct}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Product Detail for {this.state.brand} {this.state.name} </ModalHeader>
                <ModalBody>
                    <p className="text-justify">
                        color : {this.state.color}
                        <br></br>
                        weight : {this.state.weight}
                        <br></br>
                        dimension : {this.state.dimension}
                        <br></br>
                        description : {this.state.description}

                    </p>
                    <img className="border mx-auto m-3" src={"http://localhost:5555/" + this.state.mainPic} style={{ height: "450px", width: "400px", objectFit: "cover" }} alt="No pic" />
                    <img id="pointlink" onClick={() => this.setState({ mainPic: this.state.productpic1 })} className="mr-3" src={"http://localhost:5555/" + this.state.productpic1} style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                    <img id="pointlink" onClick={() => this.setState({ mainPic: this.state.productpic2 })} className="" src={"http://localhost:5555/" + this.state.productpic2} style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                    <img id="pointlink" onClick={() => this.setState({ mainPic: this.state.productpic3 })} className="ml-3" src={"http://localhost:5555/" + this.state.productpic3} style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" onClick={() => this.approveProduct()} >
                        Approve
                            </Button>
                    <Button size="sm" color="secondary" onClick={() => { this.toggleProduct() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderUnpaidTransaction = () => {
        let z = []
        let y = this.state.unpaidTransaction
        for (let i = 0; i < y.length; i++) {
            if (i === 0) {
                z.push(y[i])
            }
            if (i > 0 && y[i].trandeliveryId !== y[i - 1].trandeliveryId) {
                z.push(y[i])
            }
        }
        let map = z.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.trandeliveryId}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.trandate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.uploadtransferdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.recipientname}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.email}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.cellphone}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_district}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_cityregency}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.totalcost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center" style={{ fontSize: "12px" }} >
                        <Button className="d-block" style={{ fontSize: "12px" }} size="sm" onClick={() => this.showTransfer(val.transferpic, val.trandeliveryId, val.tranpaymentId, val.totalcost)} >
                            Show Transfer Proof
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderPaidTransaction = () => {
        let z = []
        let y = this.state.paidTransaction
        for (let i = 0; i < y.length; i++) {
            if (i === 0) {
                z.push(y[i])
            }
            if (i > 0 && y[i].trandeliveryId !== y[i - 1].trandeliveryId) {
                z.push(y[i])
            }
        }
        let map = z.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.trandeliveryId}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.trandate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.type}</td>
                    {
                        val.uploadtransferdate !== null
                            ?
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {new Date(val.uploadtransferdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            :
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >

                            </td>
                    }
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.storename}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.totalcost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    {
                        val.uploadtransferdate !== null
                            ?
                            <td className="p-2 text-center" style={{ fontSize: "12px" }} >
                                <Button className="d-block" style={{ fontSize: "12px" }} size="sm" onClick={() => this.showTransfer(val.transferpic, val.trandeliveryId, val.tranpaymentId, val.totalcost)} >
                                    Show Transfer Proof
                            </Button>
                            </td>
                            :
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >

                            </td>
                    }
                </tr>
            )
        })
        return map
    }

    renderclaimCompleteTransaction = () => {
        let z = []
        let y = this.state.claimCompleteTransaction
        for (let i = 0; i < y.length; i++) {
            if (i === 0) {
                z.push(y[i])
            }
            if (i > 0 && y[i].trandeliveryId !== y[i - 1].trandeliveryId) {
                z.push(y[i])
            }
        }
        let map = z.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.trandeliveryId}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.trandate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.jnereceiptdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.jnereceipt}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.recipientname}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.email}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.cellphone}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_address}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_district}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_cityregency}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_province}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_postalcode}</td>
                    <td className="p-2 text-center" style={{ fontSize: "12px" }} >
                        <Button className="d-block" style={{ fontSize: "12px" }} size="sm" onClick={() => this.showReceiving(val.deliveredpic, val.trandeliveryId, val.tranpaymentId)} >
                            Show Receiving Proof
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderUnapprovedStores = () => {
        let map = this.state.listUnapprovedStores.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.storename}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.fullname}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.email}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.cellphone}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.store_address}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.store_district}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.store_cityregency}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.store_province}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.store_postalcode}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <Button className="d-block" style={{ fontSize: "12px" }} size="sm" onClick={() => this.approveStore(val.storeId, val.userId)} >
                            Approve Store
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderUnapprovedProducts = () => {
        let map = this.state.listUnapprovedProducts.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.storename}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.category}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.brand}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {val.name}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <Button className="d-block" style={{ fontSize: "12px" }} size="sm" onClick={() => this.showProducts(val.productId, val.brand, val.name, val.color, val.weight, val.dimension, val.description, val.productpic1, val.productpic2, val.productpic3)} >
                            Show Product Detail
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    render() {
        if (this.props.match.params.id === "xxx" && !this.props.homeRedux) {
            return (
                <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                    {this.renderModalTransfer()}
                    {this.renderModalReceiving()}
                    {this.renderModalProduct()}
                    <h1 >Admin Menu</h1>
                    <h3 className="mt-3 mb-1" >New Store Registration</h3>
                    <table className="table-bordered mb-5" >
                        <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold mb-3">
                            <td></td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Storename</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Owner</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Email</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Cellphone</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Address</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >District</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Province</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Postalcode</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >City/Regency</td>
                            <td className="p-2 text-center align-text-top" ></td>
                        </thead>
                        <tbody>
                            {this.renderUnapprovedStores()}
                        </tbody>
                    </table>

                    <h3 className="mt-3 mb-1" >New Product Registration</h3>
                    <table className="table-bordered mb-5" >
                        <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold mb-3">
                            <td></td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Storename</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Category</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Brand</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Price</td>
                            <td className="p-2 text-center align-text-top" ></td>
                        </thead>
                        <tbody>
                            {this.renderUnapprovedProducts()}
                        </tbody>
                    </table>

                    <h3 className="mt-3" >Approval Required Transaction</h3>
                    <p className="mb-1" >
                        Transaction status : payment done claim, waiting for admin approval
                        </p>
                    <table className="table-bordered mb-5" style={{ width: "1200px" }} >
                        <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold mb-3">
                            <td></td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Id</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Date</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Upload Bank Transfer Date</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Email</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Cellphone</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >District</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >City/Regency</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Total Cost</td>
                            <td className="p-2 text-center align-text-top" ></td>
                        </thead>
                        <tbody>
                            {this.renderUnpaidTransaction()}
                        </tbody>
                    </table>
                    <p className="mb-1" >
                        Transaction status : payment done, waiting for the product(s) to be delivered
                        </p>
                    <table className="table-bordered mb-5" >
                        <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold mb-3">
                            <td></td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Id</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Date</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Payment Type</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Upload Bank Transfer Date</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Store</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Total Cost</td>
                            <td className="p-2 text-center align-text-top" ></td>
                        </thead>
                        <tbody>
                            {this.renderPaidTransaction()}
                        </tbody>
                    </table>
                    <p className="mb-1" >
                        Transaction status : received claim, waiting for admin approval
                        </p>
                    <table className="table-bordered mb-5" style={{ width: "1200px" }} >
                        <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                            <td></td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Id</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Date</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Date</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >JNE Receipt Code</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Email</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Cellphone</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Address</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >District</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >City/Regency</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Province</td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Postalcode</td>
                            <td className="p-2 text-center align-text-top" ></td>
                        </thead>
                        <tbody>
                            {this.renderclaimCompleteTransaction()}
                        </tbody>
                    </table>
                </div>
            )
        } else {
            alert("you are not admin")
            return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        homeRedux: state.home.home
    }
}


export default connect(mapStateToProps)(Adminmenu)