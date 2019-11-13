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
import { getCartLogin, getCartNonLogin, emptyCart } from "../action/tran"

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            productBrand: "",
            productName: "",
            productNote: "",
            grandTotal: 0,
            productId: false,
            checkout: false
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
    }

    emptyCartClick = () => {
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

    removeItem = (productId, cartId) => {
        let cart = JSON.parse(localStorage.getItem("cart"))
        let cartLogin = JSON.parse(localStorage.getItem("cartLogin"))
        let y = this.props.cartRedux.filter(val => val.productId !== productId)
        switch (true) {
            case cartLogin !== null:
                axios.delete("http://localhost:5555/tran/deletecart/" + cartId)
                    .then()
                    .catch()
                this.props.getCartLogin()
                break;
            case cart !== null:
                axios.delete("http://localhost:5555/tran/deletecartnonlogin/" + cartId)
                    .then()
                    .catch()
                this.props.getCartNonLogin()
                break;
            default:
                break;
        }
        this.getTotalPrice(y)
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

    changeQty = (type, index) => {
        let cart = JSON.parse(localStorage.getItem("cart"))
        let cartLogin = JSON.parse(localStorage.getItem("cartLogin"))
        let y = this.props.cartRedux
        if (type === "minus") { y[index].qty -= 1 }
        if (type === "plus") { y[index].qty += 1 }

        axios.get("http://localhost:5555/prod/getproductdetail", {
            params: {
                productId: y[index].productId
            }
        })
            .then(res => {
                if (res.data[0].inventory - res.data[0].checkoutqty < y[index].qty && type === "plus") {
                    y[index].qty -= 1
                    alert(`remaining stock is only ${res.data[0].inventory - res.data[0].checkoutqty} ${res.data[0].measurement}`)
                } else {
                    switch (true) {
                        case cartLogin !== null:
                            axios.put("http://localhost:5555/tran/updatecart", {
                                userId: y[index].userId,
                                productId: y[index].productId,
                                qty: y[index].qty,
                                note: y[index].note
                            })
                                .then(res => {
                                    this.props.getCartLogin()
                                })
                                .catch()
                            break;
                        case cart !== null:
                            axios.put("http://localhost:5555/tran/updatecartnonlogin", {
                                userId: y[index].userId,
                                productId: y[index].productId,
                                qty: y[index].qty,
                                note: y[index].note
                            })
                                .then(res => {
                                    this.props.getCartNonLogin()
                                })
                                .catch()
                            break;
                        default:
                            break;
                    }
                    this.getTotalPrice(y)
                }
            })
            .catch()
    }


    gotoProductDetail = (val) => {
        this.setState({ productId: val })
    }

    checkout = () => {
        let localUser = localStorage.getItem("localUser")
        let storage = JSON.parse(localStorage.getItem("userData"))
        let token = localStorage.getItem("token")
        if (storage) {
            axios.get("http://localhost:5555/tran/getcart", {
                params: {
                    userId: storage[0].userId
                },
                headers: {
                    authorization: token
                }
            })
                .then(res => {
                    try {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].inventory - res.data[i].checkoutqty < res.data[i].qty) throw "can not continue to checkout, there are items in your cart that exceed the seller's inventory"
                        }
                        this.setState({ checkout: true })
                    } catch (error) {
                        alert(error)
                    }
                })
                .catch()
        } else {
            axios.get("http://localhost:5555/tran/getcartnonlogin", {
                params: {
                    userId: localUser
                },
                headers: {
                    authorization: token
                }
            })
                .then(res => {
                    try {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].inventory - res.data[i].checkoutqty < res.data[i].qty) throw "can not continue to checkout, there are items in your cart that exceed the seller's inventory"
                        }
                        this.setState({ checkout: true })
                    } catch (error) {
                        alert(error)
                    }
                })
                .catch()
        }
    }

    renderModal = () => {
        return (
            <Modal isOpen={this.state.modal}>
                <ModalHeader style={{ backgroundColor: "#ffc61a" }}>Note for {this.state.productBrand} {this.state.productName}</ModalHeader>
                <ModalBody>
                    <p className="text-justify">
                        Note for Seller :
                        <br></br>
                        {this.state.productNote}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="secondary" onClick={() => { this.toggle() }} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderCart = () => {
        let map = this.props.cartRedux.map((val, index) => {
            return (
                <tr >
                    <td className="p-2 text-center align-text-top" >{index + 1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td id="pointlink" className="p-2 text-center align-text-top" onClick={() => this.gotoProductDetail(val.productId)} >{val.name}</td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={() => { this.setState({ modal: true, productBrand: val.brand, productName: val.name, productNote: val.note }) }} >Show</Button>
                    </td>
                    <td id="pointer" className="p-2 text-center " onClick={() => this.gotoProductDetail(val.productId)} >
                        <img src={"http://localhost:5555/" + val.productpic1} style={{ height: "50px", width: "50px", objectFit: "cover" }} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat displayType={'text'} value={val.price} thousandSeparator={true} />
                    </td>
                    {
                        val.discvalue === null && val.discpercent === null
                            ?
                            <td className="p-2 text-center align-text-top" >

                            </td>
                            :
                            null
                    }
                    {
                        val.discpercent !== null
                            ?
                            <td className="p-2 text-center align-text-top" >
                                <NumberFormat displayType={'text'} suffix="%" value={val.discpercent} />
                            </td>
                            :
                            null
                    }
                    {
                        val.discvalue !== null
                            ?
                            <td className="p-2 text-center align-text-top" >
                                <NumberFormat displayType={'text'} value={val.discvalue} thousandSeparator={true} />
                            </td>
                            :
                            null
                    }
                    {
                        val.discvalue === null && val.discpercent === null
                            ?
                            <td className="p-2 text-center align-text-top" >

                            </td>
                            :
                            null
                    }
                    {
                        val.discpercent !== null
                            ?
                            <td className="p-2 text-center align-text-top" >
                                <NumberFormat displayType={'text'} value={val.price * (100 - val.discpercent) / 100} thousandSeparator={true} />
                            </td>
                            :
                            null
                    }
                    {
                        val.discvalue !== null
                            ?
                            <td className="p-2 text-center align-text-top" >
                                <NumberFormat displayType={'text'} value={val.price - val.discvalue} thousandSeparator={true} />
                            </td>
                            :
                            null
                    }
                    <td className="p-2 text-right align-text-top border-right-0" >
                        {val.inventory - val.checkoutqty}
                    </td>
                    <td className="p-2 text-left align-text-top border-left-0" >
                        {val.measurement}
                    </td>
                    <td className={val.inventory - val.checkoutqty < val.qty ? "p-2 text-center align-text-top text-danger" : "p-2 text-center align-text-top"} >
                        <Button disabled={val.qty === 1} size="sm" className="mr-2" onClick={() => this.changeQty("minus", index)} >
                            -
                    </Button>
                        {val.qty}
                        <Button size="sm" className="ml-2" onClick={() => this.changeQty("plus", index)} >
                            +
                    </Button>
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
                        <Button size="sm" color="secondary" onClick={() => this.removeItem(val.productId, val.cartId)} >Delete</Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    render() {
        console.log(this.props.cartRedux);
        
        if (this.props.cartRedux.length > 0 && !this.props.homeRedux ) {
            switch (true) {
                case this.state.productId !== false:
                    return <Redirect to={`/Productdetail/${this.state.productId}`} />
                case this.state.checkout:
                    return <Redirect to="/Checkout" />
                default:
                    return (
                        <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                            <h1 >Your Cart</h1>
                            {this.renderModal()}
                            <table className="table-bordered mb-2" style={{ width: "1200px" }} >
                                <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                    <td></td>
                                    <td className="p-2 text-center align-text-top" >Category</td>
                                    <td className="p-2 text-center align-text-top" >Brand</td>
                                    <td className="p-2 text-center align-text-top" >Name</td>
                                    <td className="p-2 text-center align-text-top" >Note</td>
                                    <td className="p-2 text-center align-text-top" >Pic</td>
                                    <td className="p-2 text-center align-text-top" >Price</td>
                                    <td className="p-2 text-center align-text-top" >Disc</td>
                                    <td className="p-2 text-center align-text-top" >Price After Disc</td>
                                    <td className="p-2 text-center align-text-top" colSpan="2" >Remaining Stock</td>
                                    <td className="p-2 text-center align-text-top" >Purchase qty</td>
                                    <td className="p-2 text-center align-text-top" >Total Price</td>
                                    <td className="p-2 text-center align-text-top" ></td>
                                </thead>
                                <tbody>
                                    {this.renderCart()}
                                    <tr >
                                        <td colSpan="9" className="text-right font-weight-bold p-2" >
                                            Grand Total
                                            </td>
                                        <td colSpan="3" className="font-weight-bold p-2" >
                                            <NumberFormat prefix="IDR " displayType={'text'} value={this.state.grandTotal} thousandSeparator={true} />
                                        </td>
                                        <td colSpan="2" className="font-weight-bold p-2" >
                                            
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Button onClick={() => this.emptyCartClick()} >
                                Empty Cart
                                </Button>
                            <Button className="ml-1" onClick={() => this.checkout()} >
                                Check Out
                                </Button>
                        </div>
                    )
            }
        } else if (this.props.cartRedux.length > 0 && this.props.homeRedux) {
            return <Redirect to="/" />
        } else {
            alert("your cart is empty")
            return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        cartRedux: state.cart.cart,
        homeRedux: state.home.home
    }
}


export default connect(mapStateToProps, { getCartLogin, getCartNonLogin, emptyCart })(Cart)