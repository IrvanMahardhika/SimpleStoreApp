import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Card, Button, CardHeader, CardBody, CustomInput,
    CardTitle, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from "axios";
import NumberFormat from "react-number-format";

import { headerChange } from "../action/index";

class Transtat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalNote: false,
            modalEvidence: false,
            transactionDetail: [],
            renderTransferPic: "",
            productNote: "",
            productBrand: "",
            productName: "",
            statusPayment: "waiting for payment",
            datePayment: "",
            statusDelivery: "waiting for payment",
            dateDelivery: "",
            statusReceiving: "waiting for payment",
            dateReceiving: "",
            renderpic: "",
            transferEvidencePic: ""

        };
        this.toggleNote = this.toggleNote.bind(this);
    }

    toggleNote() {
        this.setState(prevState => ({
            modalNote: !prevState.modalNote
        }));
    }

    toggleEntryTransferEvidence() {
        this.setState(prevState => ({
            modalEvidence: !prevState.modalEvidence
        }));
    }

    componentDidMount() {
        this.props.headerChange()
        this.getTransaction()
    }

    getTransaction = () => {
        axios.get("http://localhost:5555/tran/gettransaction", {
            params: {
                trandeliveryid: this.props.match.params.id
            }
        })
            .then(res => {
                if (res.data[0].transferpic === null) {
                    this.setState({ transactionDetail: res.data, renderTransferPic: "images/banktransferpics/nopic.png" })
                } else {
                    this.setState({ transactionDetail: res.data, renderTransferPic: res.data[0].transferpic })
                }
                switch (true) {
                    case res.data[0].status === "payment done claim, waiting for admin approval":
                        this.setState({
                            statusPayment: "payment done claim, waiting for admin approval",
                            datePayment: res.data[0].uploadtransferdate,
                            statusDelivery: "payment done claim, waiting for admin approval",
                            statusReceiving: "payment done claim, waiting for admin approval"
                        })
                        break;
                    case res.data[0].status === "payment done, waiting for the product(s) to be delivered":
                        this.setState({
                            statusPayment: "payment done",
                            datePayment: res.data[0].tranconfirmdate,
                            statusDelivery: "waiting for the product(s) to be delivered",
                            statusReceiving: "waiting for the product(s) to be delivered"
                        })
                        break;
                    case res.data[0].status === "delivered, waiting to be received by customer" || res.data[0].status === "received claim, waiting for admin approval":
                        this.setState({
                            statusPayment: "payment done",
                            datePayment: res.data[0].tranconfirmdate,
                            statusDelivery: "delivered",
                            dateDelivery: res.data[0].jnereceiptdate,
                            statusReceiving: "waiting to be received by customer"
                        })
                        break;
                    case res.data[0].status === "received by customer (transaction complete)":
                        this.setState({
                            statusPayment: "payment done",
                            datePayment: res.data[0].tranconfirmdate,
                            statusDelivery: "delivered",
                            dateDelivery: res.data[0].jnereceiptdate,
                            statusReceiving: "received by customer (transaction complete)",
                            dateReceiving: res.data[0].completeddate
                        })
                        break;
                    default:
                        break;
                }
            })
            .catch()
    }

    showNote = (note, brand, name) => {
        this.setState({ modalNote: true, productNote: note, productBrand: brand, productName: name })
    }

    showEntryTransferEvidence = () => {
        axios.get("http://localhost:5555/tran/gettransferevidencepic", {
            params: {
                tranpaymentId: this.state.transactionDetail[0].tranpaymentId
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    if (res.data[0].transferpic !== null) {
                        this.setState({ renderpic: res.data[0].transferpic, modalEvidence: true })
                    } else {
                        this.setState({ renderpic: "images/banktransferpics/nopic.png", modalEvidence: true })
                    }
                }
            })
            .catch()
    }

    getTransferEvidencePic = (val) => {
        switch (false) {
            case val.type.split("/")[1] === "png" || val.type.split("/")[1] === "jpeg":
                alert("File must be an image")
                break;
            case val.size < 200000:
                alert("File size must be smaller than 200Kb")
                break;
            default:
                this.setState({ transferEvidencePic: val })
        }
    }

    saveClick = () => {
        let fd = new FormData()
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
        let data = {
            uploadtransferdate: trandate,
            tranpaymentId: this.state.transactionDetail[0].tranpaymentId
        }
        fd.append("transferevidencePic", this.state.transferEvidencePic)
        fd.append("data", JSON.stringify(data))
        axios.put("http://localhost:5555/upload/uploadtransferevidencepic", fd)
            .then(res => {
                this.setState({ transferEvidencePic: "", modalEvidence: false })
                alert("upload success")
                this.getTransaction()
            })
            .catch()
        axios.put("http://localhost:5555/tran/updatetranstatus", {
            status: "payment done claim, waiting for admin approval",
            tranpaymentId: this.state.transactionDetail[0].tranpaymentId
        })
            .then()
            .catch()
    }

    confirmProductReceiving = () => {
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
            trandeliveryId: this.state.transactionDetail[0].trandeliveryId
        })
            .then(res => {
                axios.put("http://localhost:5555/tran/updatetranstatus", {
                    status: "received by customer (transaction complete)",
                    tranpaymentId: this.state.transactionDetail[0].tranpaymentId
                })
                    .then(pos => {
                        alert("confirmation success")
                        this.getTransaction()
                    })
                    .catch()
            })
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

    renderModalEntryTransferEvidence = () => {
        return (
            <Modal isOpen={this.state.modalEvidence}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Upload Bank Transfer Evidence for Transaction ID : {this.props.match.params.id}</ModalHeader>
                <ModalBody>
                    <p >
                        After you upload <b >bank transfer evidence picture</b>, our staff will check it and update you immediately.
                        <br></br>
                        The transaction status will be changed into <b >payment done claim, waiting for admin approval</b>.
                    </p>
                    <img className="border" src={"http://localhost:5555/" + this.state.renderpic} style={{ height: "250px", width: "250px", objectFit: "cover" }} alt="No pic" />
                    <p className="mb-1" >
                        <small>pic size max 200kb</small>
                    </p>
                    <CustomInput className="d-inline" style={{ width: "300px" }} type="file" label={this.state.transferEvidencePic.name} onChange={e => this.getTransferEvidencePic(e.target.files[0])} />
                    <br></br>
                    <br></br>
                    <Button disabled={!this.state.transferEvidencePic} className="" onClick={() => { this.saveClick() }}>Upload</Button>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="secondary" onClick={() => { this.toggleEntryTransferEvidence() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderShowProduct = () => {
        let map = this.state.transactionDetail.map((val, index) => {
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
        return (
            <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }}>
                {this.renderModalNote()}
                {this.renderModalEntryTransferEvidence()}
                <p className="mb-4" >
                    Detail for transaction id : {this.props.match.params.id}
                </p>
                <p className="mb-1" >
                    Product List
                </p>
                <table className="table-bordered mb-4" style={{ width: "1200px" }} >
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

                <p className="mb-1" >
                    Cost
                </p>
                <table className="table-bordered mb-4" >
                    <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold" >
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Payment Type</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Bank</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Product Cost</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Delivery Cost</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Total Cost</td>
                    </thead>
                    <tbody >
                        <tr >
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].type : null}
                            </td>
                            {
                                this.state.transactionDetail.length > 0
                                    ?
                                    <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                        {this.state.transactionDetail[0].type === "card" ? this.state.transactionDetail[0].bankori : this.state.transactionDetail[0].bankdest}
                                    </td>
                                    :
                                    null
                            }
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                <NumberFormat prefix="IDR " value={this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].productcost : null} displayType={'text'} thousandSeparator={true} />
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                <NumberFormat prefix="IDR " value={this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].deliverycost : null} displayType={'text'} thousandSeparator={true} />
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                <NumberFormat prefix="IDR " value={this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].totalcost : null} displayType={'text'} thousandSeparator={true} />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p className="mb-1" >
                    Destination
                </p>
                <table className="table-bordered mb-4" style={{ width: "1200px" }} >
                    <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold" >
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Name</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Email</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Cellphone</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Address</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >District</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >City/Regency</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Province</td>
                        <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >Postalcode</td>
                    </thead>
                    <tbody >
                        <tr >
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].recipientname : null}
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].email : null}
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].cellphone : null}
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].dest_address : null}
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].dest_district : null}
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].dest_cityregency : null}
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].dest_province : null}
                            </td>
                            <td className="p-2 text-center align-text-top" style={{ fontSize: "12px" }} >
                                {this.state.transactionDetail.length > 0 ? this.state.transactionDetail[0].dest_postalcode : null}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className="mb-1" >
                    Transaction Status
                </p>
                <table className="table-bordered mb-4" >
                    <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold" >
                        <td className="p-2 text-center align-text-top" >

                        </td>
                        <td className="p-2 text-center align-text-top" >
                            Status
                        </td>
                        <td className="p-2 text-center align-text-top" >
                            Date
                        </td>
                    </thead>
                    <tbody >
                        <tr >
                            <td className="p-2 text-left align-text-top" >
                                Payment
                            </td>
                            <td className="p-2 text-left align-text-top" >
                                {this.state.statusPayment}
                                {
                                    this.state.transactionDetail.length > 0 && this.state.transactionDetail[0].type === "transfer"
                                        ?
                                        <Button className="ml-2" size="sm" onClick={() => this.showEntryTransferEvidence()} >
                                            Entry Bank Transfer Receipt
                                        </Button>
                                        :
                                        null
                                }

                            </td>
                            {
                                this.state.datePayment !== ""
                                    ?
                                    <td className="p-2 text-left align-text-top" >
                                        {new Date(this.state.datePayment).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    :
                                    <td className="p-2 text-left align-text-top" >

                                    </td>
                            }
                        </tr>
                        <tr >
                            <td className="p-2 text-left align-text-top" >
                                Delivery
                            </td>
                            <td className="p-2 text-left align-text-top" >
                                {this.state.statusDelivery}
                                {
                                    (this.state.transactionDetail.length > 0 && this.state.transactionDetail[0].status === "delivered, waiting to be received by customer") || (this.state.transactionDetail.length > 0 && this.state.transactionDetail[0].status === "received claim, waiting for admin approval") || (this.state.transactionDetail.length > 0 && this.state.transactionDetail[0].status === "received by customer (transaction complete)")
                                        ?
                                        <span className="ml-2" >
                                            (JNE receipt code : <b >{this.state.transactionDetail[0].jnereceipt}</b>)
                                        </span>
                                        :
                                        null
                                }
                            </td>
                            {
                                this.state.dateDelivery !== ""
                                    ?
                                    <td className="p-2 text-left align-text-top" >
                                        {new Date(this.state.dateDelivery).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    :
                                    <td className="p-2 text-left align-text-top" >

                                    </td>
                            }
                        </tr>
                        <tr >
                            <td className="p-2 text-left align-text-top" >
                                Receiving
                            </td>
                            <td className="p-2 text-left align-text-top" >
                                {this.state.statusReceiving}
                                {
                                    (this.state.transactionDetail.length > 0 && this.state.transactionDetail[0].status === "delivered, waiting to be received by customer") || (this.state.transactionDetail.length > 0 && this.state.transactionDetail[0].status === "received claim, waiting for admin approval")
                                        ?
                                        <Button className="ml-2" size="sm" onClick={() => this.confirmProductReceiving()} >
                                            Confirm Product Receiving
                                        </Button>
                                        :
                                        null
                                }
                            </td>
                            {
                                this.state.dateReceiving !== ""
                                    ?
                                    <td className="p-2 text-left align-text-top" >
                                        {new Date(this.state.dateReceiving).toLocaleDateString("id", { day: "numeric", month: "short", year: "numeric" })}
                                    </td>
                                    :
                                    <td className="p-2 text-left align-text-top" >

                                    </td>
                            }
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default connect(null, { headerChange })(Transtat)