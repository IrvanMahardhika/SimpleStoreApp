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
        qty: 1,
        note: ""
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

    getQty = (val) => {
        switch (true) {
            case parseInt(val) === 0:
                this.setState({ qty: 1 })
                break;
            case val.substr(0, 1) === "0":
                this.setState({ qty: parseInt(val) })
                break;
            default:
                this.setState({ qty: val })
                break;
        }
    }

    addTocart = () => {
        let token = localStorage.getItem("token")
        let y = this.props.cartRedux.filter(val => val.productId !== this.props.match.params.id)
        let z = {
            productId: this.props.match.params.id,
            category: this.state.productDetail[0].category,
            brand: this.state.productDetail[0].brand,
            name: this.state.productDetail[0].name,
            note: this.state.note,
            price: this.state.productDetail[0].price,
            pic: this.state.productDetail[0].productpic1,
            discpercent: this.state.productDetail[0].discpercent,
            discvalue: this.state.productDetail[0].discvalue,
            qty: this.state.qty
        }
        y.push(z)

        if (this.props.loginRedux.length > 0) {
            localStorage.setItem(
                "cartLogin",
                JSON.stringify(y)
            )
            axios.get("http://localhost:5555/tran/checkcart", {
                params: {
                    userId: this.props.loginRedux[0].userId,
                    productId: this.props.match.params.id
                },
                headers : {
                    authorization : token
                }
            })
                .then(res => {
                    console.log(res.data);
                    
                    if (res.data.length > 0) {
                        axios.put("http://localhost:5555/tran/updatecart", {
                            userId: this.props.loginRedux[0].userId,
                            productId: this.props.match.params.id,
                            qty: this.state.qty
                        }).then().catch()
                    } else {
                        axios.post("http://localhost:5555/tran/addtocart",
                            {
                                userId: this.props.loginRedux[0].userId,
                                productId: this.props.match.params.id,
                                qty: this.state.qty,
                                note: this.state.note
                            })
                            .then()
                            .catch()
                    }
                })
                .catch()
        } else {
            localStorage.setItem(
                "cart",
                JSON.stringify(y)
            )
        }
        alert("Add to cart success")
        this.props.getCart(y)
    }

    render() {
        return (
            <div className="mt-3" id="curtain" style={{ marginLeft: "100px" }} >
                <Row className="ml-1 mb-3" >
                    <Card className="mr-1" style={{ backgroundColor: "#ffc61a", width: "425px" }} >
                        <CardImg className="mx-auto m-3" src={"http://localhost:5555/" + this.state.renderpic} style={{ height: "450px", width: "400px", objectFit: "cover" }} alt="Card image cap" />
                        {
                            this.state.productDetail.length > 0
                                ?
                                <Row className="mx-auto mb-3" >
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
                                        {
                                            this.state.productDetail[0].discpercent !== null || this.state.productDetail[0].discvalue !== null
                                                ?
                                                <tr>
                                                    <td className="p-2" >
                                                        Price
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px" }} >
                                                        <NumberFormat style={{ textDecorationLine: "line-through" }} displayType={'text'} className="border-0" prefix="IDR " value={this.state.productDetail[0].price} thousandSeparator={true} />
                                                    </td>
                                                </tr>
                                                :
                                                <tr>
                                                    <td className="p-2" >
                                                        Price
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={this.state.productDetail[0].price} thousandSeparator={true} />
                                                    </td>
                                                </tr>
                                        }
                                        {
                                            this.state.productDetail[0].discpercent !== null
                                                ?
                                                <tr >
                                                    <td className="p-2" >
                                                        Disc
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px", color: "red" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="- " suffix="%" value={this.state.productDetail[0].discpercent} />
                                                    </td>
                                                </tr>
                                                :
                                                null
                                        }
                                        {
                                            this.state.productDetail[0].discvalue !== null
                                                ?
                                                <tr >
                                                    <td className="p-2" >
                                                        Disc
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px", color: "red" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="- IDR " value={this.state.productDetail[0].discvalue} thousandSeparator={true} />
                                                    </td>
                                                </tr>
                                                :
                                                null
                                        }
                                        {
                                            this.state.productDetail[0].discpercent !== null
                                                ?
                                                <tr >
                                                    <td className="p-2" >
                                                        Price After Disc
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={this.state.productDetail[0].price * (100 - this.state.productDetail[0].discpercent) / 100} thousandSeparator={true} />

                                                    </td>
                                                </tr>
                                                :
                                                null
                                        }
                                        {
                                            this.state.productDetail[0].discvalue !== null
                                                ?
                                                <tr >
                                                    <td className="p-2" >
                                                        Price After Disc
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={this.state.productDetail[0].price - this.state.productDetail[0].discvalue} thousandSeparator={true} />

                                                    </td>
                                                </tr>
                                                :
                                                null
                                        }
                                        <tr >
                                            <td className="p-2" >
                                                Qty
                                            </td>
                                            <td className="p-2" style={{ fontSize: "30px" }} >
                                                <Button disabled={this.state.qty === 1} onClick={() => this.changeQty("minus")} >-</Button>
                                                <NumberFormat maxLength="2" style={{ width: "50px" }} decimalScale="0" allowNegative={false} className="text-right mx-3" value={this.state.qty} onChange={e => this.getQty(e.target.value)} />
                                                <Button onClick={() => this.changeQty("plus")} >+</Button>
                                            </td>
                                        </tr>
                                        {
                                            this.state.productDetail[0].discpercent === null && this.state.productDetail[0].discvalue === null
                                                ?
                                                <tr >
                                                    <td className="p-2" >
                                                        Total
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px", color: "red" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={this.state.productDetail[0].price * this.state.qty} thousandSeparator={true} />
                                                    </td>
                                                </tr>
                                                :
                                                null
                                        }
                                        {
                                            this.state.productDetail[0].discpercent !== null
                                                ?
                                                <tr >
                                                    <td className="p-2" >
                                                        Total
                                                </td>
                                                    <td className="p-2" style={{ fontSize: "30px", color: "red" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={(this.state.productDetail[0].price * (100 - this.state.productDetail[0].discpercent) / 100) * this.state.qty} thousandSeparator={true} />
                                                    </td>
                                                </tr>
                                                :
                                                null
                                        }
                                        {
                                            this.state.productDetail[0].discvalue !== null
                                                ?
                                                <tr >
                                                    <td className="p-2" >
                                                        Total
                                            </td>
                                                    <td className="p-2" style={{ fontSize: "30px", color: "red" }} >
                                                        <NumberFormat displayType={'text'} className="border-0" prefix="IDR " value={(this.state.productDetail[0].price - this.state.productDetail[0].discvalue) * this.state.qty} thousandSeparator={true} />
                                                    </td>
                                                </tr>
                                                :
                                                null
                                        }
                                        <tr >
                                            <td className="p-2" >
                                                Note
                                            </td>
                                            <td className="p-2" style={{ fontSize: "30px" }} >
                                                <Input style={{ width: "300px", height: "100px" }} type="textarea" placeholder="exp : request for red color" onChange={e => this.setState({ note: e.target.value })} />
                                            </td>
                                        </tr>
                                        <tr >
                                            <td className="p-2 text-center" >

                                            </td>
                                            <td className="p-2 text-center  " >
                                                <Button disabled={this.state.qty === ""} onClick={() => this.addTocart()} >
                                                    Add to Cart
                                                </Button>
                                                <Button href="/Cart" className="ml-3 bg-white" id="buttonImg">
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
                    {
                        this.state.productDetail.length > 0
                            ?
                            <table className="table-bordered" >
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
                                        Description
                                </td>
                                    <td className="p-3" >
                                        {this.state.productDetail[0].description}
                                    </td>
                                </tr>
                            </table>
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
        loginRedux: state.login.user,
        cartRedux: state.cart.cart,
        cartQtyRedux: state.cart.cartQty
    }
}


export default connect(mapStateToProps, { getCart })(Productdetail)