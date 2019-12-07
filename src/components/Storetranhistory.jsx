import React, { Component } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";
import {
    Row, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    TabContent, TabPane, Nav, NavItem, NavLink, CardHeader, Input, FormGroup, FormFeedback, Badge,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Storetranhistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalNote: false,
            modalEvidence: false,
            allTransaction: [],
            incompleteTransaction: [],
            claimCompleteTransaction: [],
            completedTransaction: [],
            showProduct: false,
            productNote: "",
            productBrand: "",
            productName: "",
            renderpic: "images/receivingevidencepics/nopic.png",
            receivingEvidencePic: "",
            trandeliveryId: "",
            tranpaymentId: ""
        };
        this.toggleNote = this.toggleNote.bind(this);
    }

    toggleNote() {
        this.setState(prevState => ({
            modalNote: !prevState.modalNote
        }));
    }

    toggleEntryReceivingEvidence() {
        this.setState(prevState => ({
            modalEvidence: !prevState.modalEvidence
        }));
    }

    componentDidMount() {
        this.getTransaction()
    }

    getTransaction = () => {
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/tran/getstoretransaction", {
            params: {
                storename: this.props.loginRedux[0].storename
            },
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    let incompleteTransaction = res.data.filter(val => val.status === "delivered, waiting to be received by customer")
                    let claimCompleteTransaction = res.data.filter(val => val.status === "received claim, waiting for admin approval")
                    let completedTransaction = res.data.filter(val => val.status === "received by customer (transaction complete)")
                    this.setState({ incompleteTransaction: incompleteTransaction, completedTransaction: completedTransaction, claimCompleteTransaction: claimCompleteTransaction, allTransaction: res.data })
                }
            })
            .catch()
    }

    showProduct = (id) => {
        this.setState({ showProduct: id })
    }

    showNote = (note, brand, name) => {
        this.setState({ modalNote: true, productNote: note, productBrand: brand, productName: name })
    }

    showEntryReceivingEvidence = (trandeliveryId, tranpaymentId) => {
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/tran/getreceivingevidencepic", {
            params: {
                trandeliveryId: trandeliveryId
            },
            headers: {
                authorization: token
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    if (res.data[0].deliveredpic !== null) {
                        this.setState({ renderpic: res.data[0].deliveredpic, modalEvidence: true, trandeliveryId: trandeliveryId, tranpaymentId: tranpaymentId })
                    } else {
                        this.setState({ renderpic: "images/receivingevidencepics/nopic.png", modalEvidence: true, trandeliveryId: trandeliveryId, tranpaymentId: tranpaymentId })
                    }
                }
            })
            .catch()
    }

    getReceivingEvidencePic = (val) => {
        switch (false) {
            case val.type.split("/")[1] === "png" || val.type.split("/")[1] === "jpeg":
                alert("File must be an image")
                break;
            case val.size < 200000:
                alert("File size must be smaller than 200Kb")
                break;
            default:
                this.setState({ receivingEvidencePic: val })
        }
    }

    saveClick = () => {
        let fd = new FormData()
        let data = {
            trandeliveryId: this.state.trandeliveryId
        }
        fd.append("receivingevidencePic", this.state.receivingEvidencePic)
        fd.append("data", JSON.stringify(data))
        axios.put("http://localhost:5555/upload/uploadreceivingevidencepic", fd)
            .then(res => {
                this.setState({ receivingEvidencePic: "", modalEvidence: false })
                alert("upload success")
            })
            .catch()
        axios.put("http://localhost:5555/tran/updatetranstatus", {
            status: "received claim, waiting for admin approval",
            tranpaymentId: this.state.tranpaymentId
        })
            .then()
            .catch()
    }

    renderModalNote = () => {
        return (
            <Modal isOpen={this.state.modalNote}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Note for {this.state.productBrand} {this.state.productName}</ModalHeader>
                <ModalBody>
                    <p className="text-justify">
                        Note for Seller :
                        <br></br>
                        {this.state.productNote}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="secondary" onClick={() => { this.toggleNote() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderModalEntryReceivingEvidence = () => {
        return (
            <Modal isOpen={this.state.modalEvidence}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Upload Receiving Evidence for Transaction ID : {this.state.trandeliveryId}</ModalHeader>
                <ModalBody>
                    <p >
                        After you upload <b >receiving evidence picture</b>, our staff will check it and update you immediately.
                        <br></br>
                        If the customer truly has received the product, then the transaction status will be changed into <b >received by customer (transaction complete)</b>.
                    </p>
                    <img className="border" src={"http://localhost:5555/" + this.state.renderpic} style={{ height: "250px", width: "450px", objectFit: "contain" }} alt="No pic" />
                    <p className="mb-1" >
                        <small>pic size max 200kb</small>
                    </p>
                    <CustomInput className="d-inline" style={{ width: "300px" }} type="file" label={this.state.receivingEvidencePic.name} onChange={e => this.getReceivingEvidencePic(e.target.files[0])} />
                    <br></br>
                    <br></br>
                    <Button disabled={!this.state.receivingEvidencePic} className="" onClick={() => { this.saveClick() }}>Upload</Button>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="secondary" onClick={() => { this.toggleEntryReceivingEvidence() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderIncompleteTransaction = () => {
        let z = []
        let y = this.state.incompleteTransaction
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
                <tr className={val.trandeliveryId === this.state.showProduct ? "bg-warning" : ""} >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.tranconfirmdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.jnereceiptdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.trandeliveryId}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.recipientname}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.cellphone}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_address}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_district}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_cityregency}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_province}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_postalcode}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.productcost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.deliverycost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center" style={{ fontSize: "12px" }} >
                        <Button className="d-block mb-1" style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showProduct(val.trandeliveryId)} >
                            Show Product
                            </Button>
                        <Button className="d-block" style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showEntryReceivingEvidence(val.trandeliveryId, val.tranpaymentId)} >
                            Entry Delivery Proof
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderClaimCompleteTransaction = () => {
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
                <tr className={val.trandeliveryId === this.state.showProduct ? "bg-warning" : ""} >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.tranconfirmdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.jnereceiptdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.trandeliveryId}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.recipientname}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.cellphone}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_address}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_district}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_cityregency}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_province}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_postalcode}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.productcost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.deliverycost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center" style={{ fontSize: "12px" }} >
                        <Button className="d-block mb-1" style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showProduct(val.trandeliveryId)} >
                            Show Product
                            </Button>
                        <Button className="d-block" style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showEntryReceivingEvidence(val.trandeliveryId, val.tranpaymentId)} >
                            Show Delivery Proof
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderCompletedTransaction = () => {
        let z = []
        let y = this.state.completedTransaction
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
                <tr className={val.trandeliveryId === this.state.showProduct ? "bg-warning" : ""} >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.tranconfirmdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        {new Date(val.jnereceiptdate).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.trandeliveryId}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.recipientname}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.cellphone}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_address}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_district}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_cityregency}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_province}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.dest_postalcode}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.productcost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.deliverycost} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center" style={{ fontSize: "12px" }} >
                        <Button className="d-block mb-1" style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showProduct(val.trandeliveryId)} >
                            Show Product
                            </Button>
                        <Button className="d-block" style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showEntryReceivingEvidence(val.trandeliveryId, val.tranpaymentId)} >
                            Show Delivery Proof
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderShowProduct = () => {
        let map = this.state.allTransaction.filter(val => val.trandeliveryId === this.state.showProduct).map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.name}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.discpercent}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.discvalue} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.priceafterdisc} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >{val.qty} {val.measurement}</td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <NumberFormat prefix="IDR " value={val.totalprice} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <Button className="mr-1" style={{ fontSize: "12px" }} size="sm" onClick={() => this.showNote(val.note, val.brand, val.name)} >
                            Show Note
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }


    render() {
        if (this.props.loginRedux.length > 0) {
            if (this.props.loginRedux[0].storeapproval === 1 && !this.props.homeRedux) {
                return (
                    <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                        {this.renderModalNote()}
                        {this.renderModalEntryReceivingEvidence()}
                        <h1 >Transaction History for {this.props.loginRedux[0].storename}</h1>
                        <p className="mb-1" >
                            Status : delivered, waiting to be received by customer
                        </p>
                        <table className="table-bordered mb-5" style={{ width: "1200px" }} >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Payment Date</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Date</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Id</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Cellphone</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Address</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >District</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >City/Regency</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Province</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Postalcode</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Product Cost</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Cost</td>
                                <td className="p-2 text-center align-text-top" ></td>
                            </thead>
                            <tbody>
                                {this.renderIncompleteTransaction()}
                            </tbody>
                        </table>
                        <p className="mb-1" >
                            Status : received claim, waiting for admin approval
                        </p>
                        <table className="table-bordered mb-5" style={{ width: "1200px" }} >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Payment Date</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Date</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Id</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Cellphone</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Address</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >District</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >City/Regency</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Province</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Postalcode</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Product Cost</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Cost</td>
                                <td className="p-2 text-center align-text-top" ></td>
                            </thead>
                            <tbody>
                                {this.renderClaimCompleteTransaction()}
                            </tbody>
                        </table>
                        <p className="mb-1" >
                            Status : received by customer (transaction complete)
                        </p>
                        <table className="table-bordered mb-5" style={{ width: "1200px" }} >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Payment Date</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Date</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Tran Id</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Cellphone</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Address</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >District</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >City/Regency</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Province</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Postalcode</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Product Cost</td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Cost</td>
                                <td className="p-2 text-center align-text-top" ></td>
                            </thead>
                            <tbody>
                                {this.renderCompletedTransaction()}
                            </tbody>
                        </table>
                        {
                            !this.state.showProduct
                                ?
                                null :
                                <p className="mb-1" >
                                    List Product for transaction id {this.state.showProduct}
                                </p>
                        }
                        {
                            !this.state.showProduct
                                ?
                                null
                                :
                                <table className="table-bordered mb-2" style={{ width: "1200px" }} >
                                    <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                        <td></td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Brand</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Price</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Disc Percent</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Disc Value</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Price After Disc</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Qty</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Total Price</td>
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Note fr Customer</td>
                                    </thead>
                                    <tbody>
                                        {this.renderShowProduct()}
                                    </tbody>
                                </table>
                        }
                    </div>
                )
            } else {
                alert("your dont have store")
                return <Redirect to="/" />
            }
        } else {
            alert("your dont have store")
            return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        loginRedux: state.login.user,
        homeRedux: state.home.home
    }
}


export default connect(mapStateToProps)(Storetranhistory)