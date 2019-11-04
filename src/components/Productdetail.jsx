import React, { Component } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";
import {
    Row, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    TabContent, TabPane, Nav, NavItem, NavLink, CardHeader, Input, FormGroup, FormFeedback, Badge
} from 'reactstrap';
import { connect } from "react-redux";
import { getCart } from "../action/tran"

class Productdetail extends Component {

    state = {
        renderpic: "images/userpics/nopic.png",
        productDetail: [],
        qty: 1
    }

    componentDidMount() {
        this.getProductDetail()
    }

    getProductDetail = () => {
        axios.get("http://localhost:5555/prod/getproductdetail", {
            params: {
                productId: this.props.match.params.id
            }
        })
            .then(res => {
                this.setState({ productDetail: res.data, renderpic: res.data[0].productpic1 })
            })
            .catch()
    }

    changeQty = (val) => {
        let z = this.state.qty
        if (val === "minus") { z -= 1 }
        if (val === "plus") { z += 1 }
        this.setState({ qty: z })
    }

    addTocart = () => {
        let y = this.props.cartRedux.filter(val => val.productId !== this.props.match.params.id)
        let z = {
            productId: this.props.match.params.id,
            category: this.state.productDetail[0].category,
            brand: this.state.productDetail[0].brand,
            name: this.state.productDetail[0].name,
            description: this.state.productDetail[0].description,
            price: this.state.productDetail[0].price,
            pic: this.state.productDetail[0].productpic1,
            qty: this.state.qty
        }
        y.push(z)
        localStorage.setItem(
            "cart",
            JSON.stringify(y)
        )
        this.props.getCart(y)
    }

    render() {
        return (
            <div className="mt-3" id="curtain" style={{ marginLeft: "100px" }} >
                <Row className="ml-1" >
                    <Card className="mr-1" style={{ backgroundColor: "#ffc61a", width: "425px" }} >
                        <CardImg className="mx-auto m-3" src={"http://localhost:5555/" + this.state.renderpic} style={{ height: "450px", width: "400px", objectFit: "cover" }} alt="Card image cap" />
                        {
                            this.state.productDetail.length > 0
                                ?
                                <Row className="mx-auto" >
                                    <img id="pointlink" onClick={() => this.setState({ renderpic: this.state.productDetail[0].productpic1 })} className="mr-3" src={"http://localhost:5555/" + this.state.productDetail[0].productpic1} style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                                    <img id="pointlink" onClick={() => this.setState({ renderpic: this.state.productDetail[0].productpic2 })} className="" src={"http://localhost:5555/" + this.state.productDetail[0].productpic2} style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                                    <img id="pointlink" onClick={() => this.setState({ renderpic: this.state.productDetail[0].productpic3 })} className="ml-3" src={"http://localhost:5555/" + this.state.productDetail[0].productpic3} style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                                </Row>
                                :
                                null
                        }
                    </Card>
                    {
                        this.state.productDetail.length > 0
                            ?
                            <Card className="" style={{ width: "600px" }} >
                                <CardHeader >
                                    <h1>
                                        {this.state.productDetail[0].brand}{this.state.productDetail[0].name}
                                    </h1>
                                </CardHeader>
                                <CardText className="p-4" >
                                    <table className="table-bordered" >
                                        <tr>
                                            <td className="p-3" >
                                                Price
                                            </td>
                                            <td className="p-3" style={{ fontSize: "30px" }} >
                                                <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={this.state.productDetail[0].price} thousandSeparator={true} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="p-3" >
                                                Available color
                                        </td>
                                            <td className="p-3" >
                                                {this.state.productDetail[0].color}
                                            </td>
                                        </tr>
                                        <tr >
                                            <td className="p-3" >
                                                Dimension
                                        </td>
                                            <td className="p-3" >
                                                {this.state.productDetail[0].dimension} cm
                                        </td>
                                        </tr>
                                        <tr >
                                            <td className="p-3" >
                                                Weight
                                        </td>
                                            <td className="p-3" >
                                                {this.state.productDetail[0].weight} kg
                                        </td>
                                        </tr>
                                        <tr >
                                            <td className="p-3" >
                                                Qty
                                            </td>
                                            <td className="p-3" style={{ fontSize: "30px" }} >
                                                <Button disabled={this.state.qty === 1} onClick={() => this.changeQty("minus")} >-</Button>
                                                <NumberFormat displayType={'text'} style={{ width: "50px" }} decimalScale="0" allowNegative={false} className="text-right mx-3" value={this.state.qty} onChange={e => this.setState({ qty: e.target.value })} />
                                                <Button onClick={() => this.changeQty("plus")} >+</Button>
                                            </td>
                                        </tr>
                                        <tr >
                                            <td className="p-3" >
                                                Total
                                            </td>
                                            <td className="p-3" style={{ fontSize: "30px" }} >
                                                <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={this.state.productDetail[0].price * this.state.qty} thousandSeparator={true} />
                                            </td>
                                        </tr>
                                        <tr >
                                            <td className="p-3 text-center" >
                                                <Button >
                                                    Buy
                                                </Button>
                                            </td>
                                            <td className="p-3 text-center  " >
                                                <Button onClick={() => this.addTocart()} >
                                                    Add to Cart
                                                </Button>
                                                <Button href="/Cart" className="ml-1 bg-white" id="buttonImg">
                                                    <img src={require('./cart.png')} id="imgNav" alt="No pic" />
                                                    <Badge style={{ backgroundColor: "#ffc61a", color: "grey" }} >{this.props.cartQtyRedux}</Badge>
                                                </Button>
                                            </td>
                                        </tr>
                                    </table>
                                </CardText>
                            </Card>
                            :
                            null
                    }
                </Row>
                <div className="border mt-1 p-4" style={{ width: "1030px" }} >
                    <h5 >Product Description</h5>
                    {
                        this.state.productDetail.length > 0
                            ?
                            <p >
                                {this.state.productDetail[0].description}
                            </p>
                            :
                            null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        cartRedux: state.cart.cart,
        cartQtyRedux: state.cart.cartQty
    }
}


export default connect(mapStateToProps, { getCart })(Productdetail)