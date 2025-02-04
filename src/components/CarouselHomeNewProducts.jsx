import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Row, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    CardHeader, CardImgOverlay, CardTitle, CardSubtitle, Input, Form, FormGroup, Label,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from "axios";
import NumberFormat from "react-number-format";
import ItemsCarousel from 'react-items-carousel';
import { Redirect } from "react-router-dom";


class CarouselHomeNewProducts extends Component {

    state = {
        newProductList: [],
        activeItemIndex: 0,
        chevronWidth: 5,
        productId: false
    }

    componentDidMount() {
        this.getNewProducts()
    }

    getNewProducts = () => {
        axios.get("http://localhost:5555/prod/getnewproducts")
            .then(res => {
                this.setState({ newProductList: res.data })
            })
            .catch()
    }

    setActiveItemIndex = (val) => {
        let z = this.state.activeItemIndex
        if (val === 2) {
            this.setState({ activeItemIndex: z + 1 })
        } else {
            this.setState({ activeItemIndex: z - 1 })
        }
    }

    gotoProductDetail = (val) => {
        this.setState({ productId: val })
    }

    renderNewProduct = () => {
        let z = this.state.newProductList.map(val => {
            return (
                <Card id="pointer" onClick={() => this.gotoProductDetail(val.productId)} className="border-warning d-inline-block p-0 mx-3" style={{ marginBottom: "5px", marginTop: "5px", fontSize: "12px" }}>
                    <CardImg className="m-1 mx-1" top style={{ width: "140px", height: "100px", objectFit: "contain" }} src={"http://localhost:5555/" + val.productpic1} alt="Card image cap" />
                    {
                        val.discpercent !== null
                            ?
                            <CardImgOverlay className="p-1" >
                                <CardTitle className="text-danger font-weight-bolder h6 text-right" >
                                    <NumberFormat style={{ backgroundColor: "white" }} displayType={'text'} className="border-0" prefix="- " suffix="%" value={val.discpercent} />
                                </CardTitle>
                            </CardImgOverlay>
                            :
                            null
                    }
                    {
                        val.discvalue !== null && val.discvalue < 1000000
                            ?
                            <CardImgOverlay className="p-1" >
                                <CardTitle className="text-danger font-weight-bolder h6 text-right" >
                                    <NumberFormat style={{ backgroundColor: "white" }} displayType={'text'} className="border-0" prefix="- IDR " suffix="K" value={val.discvalue / 1000} thousandSeparator={true} />
                                </CardTitle>
                            </CardImgOverlay>
                            :
                            null
                    }
                    {
                        val.discvalue !== null && val.discvalue >= 1000000
                            ?
                            <CardImgOverlay className="p-1" >
                                <CardTitle className="text-danger font-weight-bolder h6 text-right" >
                                    <NumberFormat style={{ backgroundColor: "white" }} displayType={'text'} className="border-0" prefix="- IDR " suffix="Mio" value={val.discvalue / 1000000} thousandSeparator={true} />
                                </CardTitle>
                            </CardImgOverlay>
                            :
                            null
                    }
                    <CardBody className="py-0">
                        <CardText >
                            <p className="m-0 font-weight-bold" >{val.brand}</p>
                            <p className="m-0" style={{ height: "40px" }} >{val.name}</p>
                            {
                                val.discpercent === null && val.discvalue === null
                                    ?
                                    <div >
                                        <NumberFormat className="border-0" prefix="IDR " style={{ width: "100px" }} thousandSeparator={true} />
                                        <NumberFormat className="border-0" prefix="IDR " style={{ width: "100px" }} value={val.price} thousandSeparator={true} />
                                    </div>
                                    :
                                    <div >
                                        <NumberFormat className="border-0" prefix="IDR " style={{ width: "100px", textDecorationLine: "line-through" }} value={val.price} thousandSeparator={true} />
                                        {
                                            val.discvalue === null
                                                ?
                                                <div>
                                                    <NumberFormat className="border-0 text-danger" prefix="IDR " style={{ width: "100px" }} value={val.price * (100 - val.discpercent) / 100} thousandSeparator={true} />
                                                </div>
                                                :
                                                <div>
                                                    <NumberFormat className="border-0 text-danger" prefix="IDR " style={{ width: "100px" }} value={val.price - val.discvalue} thousandSeparator={true} />
                                                </div>
                                        }
                                    </div>
                            }
                            sold {val.sales === null ? 0 : val.sales} {val.measurement}
                        </CardText>
                    </CardBody>
                    <CardFooter className="py-1">
                        <p className="my-0">{val.storename}</p>
                        <p className="my-0">{val.store_cityregency}</p>
                    </CardFooter>
                </Card>
            )
        })
        return z
    }

    render() {
        if (!this.state.productId) {
            return (
                <div style={{ padding: `0 ${this.state.chevronWidth}px`, backgroundColor: "#ffc61a" }}>
                    <ItemsCarousel
                        // requestToChangeActive={}
                        activeItemIndex={this.state.activeItemIndex}
                        numberOfCards={7}
                        gutter={0}
                        leftChevron={<button onClick={() => this.setActiveItemIndex(1)} >{'<'}</button>}
                        rightChevron={<button onClick={() => this.setActiveItemIndex(2)} >{'>'}</button>}
                        outsideChevron
                        chevronWidth={this.state.chevronWidth}
                    >
                        {this.renderNewProduct()}
                    </ItemsCarousel>
                </div>
            )
        } else {
            return <Redirect to={`/Productdetail/${this.state.productId}`} />
        }

    }
}

const mapStateToProps = state => {
    return {
        loginRedux: state.login.user
    }
}


export default connect(mapStateToProps)(CarouselHomeNewProducts)