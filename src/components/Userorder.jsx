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
import { getUserOrder } from "../action/tran"

class Userorder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalNote: false,
            modalJNE: false,
            showProduct: false,
            productNote: "",
            productBrand: "",
            productName: "",
            tranpaymentId: "",
            trandeliveryId: "",
            name: "",
            email: "",
            JNEreceiptCode: "",
            wholeContent: {}
        };
        this.toggleNote = this.toggleNote.bind(this);
    }

    toggleNote() {
        this.setState(prevState => ({
            modalNote: !prevState.modalNote
        }));
    }

    toggleEntryJNE() {
        this.setState(prevState => ({
            modalJNE: !prevState.modalJNE
        }));
    }

    showProduct = (id) => {
        this.setState({ showProduct: id })
    }

    showEntryJNE = (trandeliveryId, tranpaymentId, name, email, wholeContent) => {
        this.setState({ modalJNE: true, trandeliveryId: trandeliveryId, tranpaymentId: tranpaymentId, name: name, email: email, wholeContent: wholeContent })
    }

    showNote = (note, brand, name) => {
        this.setState({ modalNote: true, productNote: note, productBrand: brand, productName: name })
    }

    entryJNE = () => {
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
        axios.put("http://localhost:5555/tran/updatejnereceipt", {
            jnereceipt: this.state.JNEreceiptCode,
            jnereceiptdate: trandate,
            trandeliveryId: this.state.trandeliveryId
        })
            .then(res => {
                alert(`entry JNE receipt for tran ${this.state.trandeliveryId} success`)
                this.props.getUserOrder()
            })
            .catch()
        axios.put("http://localhost:5555/tran/updatetranstatus", {
            status: "delivered, waiting to be received by customer",
            tranpaymentId: this.state.tranpaymentId
        })
            .then()
            .catch()
        axios.get("http://localhost:5555/mail/sendinvoiceemail", {
            params: {
                trandeliveryId: this.state.trandeliveryId,
                storename: this.state.wholeContent.storename,
                fullname: this.state.name,
                address: this.state.wholeContent.dest_address,
                district: this.state.wholeContent.dest_district,
                cityregency: this.state.wholeContent.dest_cityregency,
                province: this.state.wholeContent.dest_province,
                postalcode: this.state.wholeContent.dest_postalcode,
                productcost: this.state.wholeContent.productcost,
                deliverycost: this.state.wholeContent.deliverycost,
                totalcost: this.state.wholeContent.totalcost,
                date: this.state.wholeContent.tranconfirmdate,
                email: this.state.email
            }
        }).then(res => {
            console.log(this.state.email);
            
        }).catch();
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

    renderModalEntryJNE = () => {
        return (
            <Modal isOpen={this.state.modalJNE}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Entry JNE receipt for Transaction ID : {this.state.trandeliveryId}</ModalHeader>
                <ModalBody>
                    <p >
                        After you entry JNE receipt code, <b >transaction {this.state.trandeliveryId}</b> will change status into <b >"delivered, waiting to be received by customer"</b>.
                        <br></br>
                        It will no longer be in this page, you can check it status in this menu on the header :
                        <br></br>
                        <img src={require('./historystore.png')} style={{ width: "300px", height: "300px", objectFit: "contain" }} alt="No pic" />
                    </p>
                    <Input style={{ width: "400px" }} placeholder="JNE receipt code" onChange={e => this.setState({ JNEreceiptCode: e.target.value })} />
                    <Button disabled={this.state.JNEreceiptCode === ""} className="mt-2" size="sm" onClick={() => { this.toggleEntryJNE(); this.entryJNE() }} >
                        Entry JNE Receipt
                    </Button>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="secondary" onClick={() => { this.toggleEntryJNE() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderResumeUserOrder = () => {
        let z = []
        let y = this.props.userOrderRedux
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
                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                        <Button className="mr-1" style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showProduct(val.trandeliveryId)} >
                            Show Product
                            </Button>
                        <Button style={{ fontSize: "12px", width: "60px" }} size="sm" onClick={() => this.showEntryJNE(val.trandeliveryId, val.tranpaymentId, val.recipientname, val.email, val)} >
                            Entry JNE
                            </Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderShowProduct = () => {
        let map = this.props.userOrderRedux.filter(val => val.trandeliveryId === this.state.showProduct).map((val, index) => {
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
        console.log(this.props.userOrderRedux);
        
        switch (true) {
            case this.props.userOrderRedux.length > 0 && !this.props.homeRedux:
                return (
                    <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                        {this.renderModalNote()}
                        {this.renderModalEntryJNE()}
                        <h1 >
                            User Order for {this.props.userOrderRedux[0].storename}
                        </h1>
                        <p className="mb-1" >
                            Status : payment done, waiting for the product(s) to be delivered
                        </p>
                        <table className="table-bordered mb-5" style={{ width: "1200px" }} >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Payment Date</td>
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
                                {this.renderResumeUserOrder()}
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
                                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Disc Percent (%)</td>
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
            case this.props.userOrderRedux.length > 0 && this.props.homeRedux:
                return <Redirect to="/" />
            default:
                alert("your dont have any order")
                return <Redirect to="/" />
        }

    }
}

const mapStateToProps = state => {
    return {
        userOrderRedux: state.tran.userOrder,
        homeRedux: state.home.home
    }
}


export default connect(mapStateToProps, { getUserOrder })(Userorder)