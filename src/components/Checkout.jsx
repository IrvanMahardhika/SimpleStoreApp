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

class Checkout extends Component {

    state = {
        grandTotal: 0,
        totalWeight: 0,
        cost: [5000, 5000]
    }

    componentDidMount() {
        this.getTotalPrice(this.props.cartRedux)
        this.getTotalWeight(this.props.cartRedux)
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

    renderCart = () => {
        let map = this.props.cartRedux.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td id="pointer" className="p-2 text-center " onClick={() => this.gotoProductDetail(val.productId)} >
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
                    <td className="p-2 text-center align-text-top" >
                        {val.weight * val.qty}
                    </td>
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
                        <NumberFormat value={this.state.cost[index]} displayType={'text'} thousandSeparator={true} />
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

    render() {
        switch (true) {
            case this.props.cartRedux.length > 0:
                return (
                    <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                        <h1 >Checkout</h1>
                        <p className="mb-0 mt-3" >Product(s)</p>
                        <table className="table-bordered mb-2" >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" >Brand</td>
                                <td className="p-2 text-center align-text-top" >Name</td>
                                <td className="p-2 text-center align-text-top" >Pic</td>
                                <td className="p-2 text-center align-text-top" >Seller</td>
                                <td className="p-2 text-center align-text-top" >Weight</td>
                                <td className="p-2 text-center align-text-top" >Purchase qty</td>
                                <td className="p-2 text-center align-text-top" >Total Price</td>
                                <td className="p-2 text-center align-text-top" >Total Weight</td>
                            </thead>
                            <tbody>
                                {this.renderCart()}
                                <tr >
                                    <td colSpan="7" className="text-right font-weight-bold p-2" >
                                        Grand Total
                                            </td>
                                    <td className="font-weight-bold p-2 text-center" >
                                        <NumberFormat prefix="IDR " displayType={'text'} value={this.state.grandTotal} thousandSeparator={true} />
                                    </td>
                                    <td className="font-weight-bold p-2 text-center" >
                                        <NumberFormat suffix="kg" displayType={'text'} value={this.state.totalWeight} thousandSeparator={true} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="mb-0 mt-3" >Delivery</p>
                        <table className="table-bordered mb-2" >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold" >
                                <td></td>
                                <td className="p-2 text-center align-text-top" >Seller</td>
                                <td className="p-2 text-center align-text-top" >Seller Address</td>
                                <td className="p-2 text-center align-text-top" >Cost/kg</td>
                                <td className="p-2 text-center align-text-top" >Weight</td>
                                <td className="p-2 text-center align-text-top" >Total Cost</td>
                            </thead>
                            <tbody >
                                {this.renderDeliveryCost()}
                                <tr >
                                    <td colSpan="4" className="text-right font-weight-bold p-2" >
                                        Grand Total
                                    </td>
                                    <td className="font-weight-bold p-2 text-center" >
                                        <NumberFormat suffix="kg" displayType={'text'} value={this.state.totalWeight} thousandSeparator={true} />
                                    </td>
                                    <td className="font-weight-bold p-2 text-center" >

                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
        cartRedux: state.cart.cart
    }
}


export default connect(mapStateToProps)(Checkout)