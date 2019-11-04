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
import { getCart, emptyCart } from "../action/tran"

class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal : false,
            productBrand : "",
            productName : "",
            productColor : "",
            productWeight : "",
            productDimension : "",
            productDescription : ""
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    emptyCartClick = () => {
        this.props.emptyCart()
    }

    renderModal = ()=>{
        return (
            <Modal isOpen={this.state.modal}>
                <ModalHeader style={{backgroundColor:"#ffc61a"}}>Description of {this.state.productBrand} {this.state.productName}</ModalHeader>
                <ModalBody>
                    <p className="text-justify">
                        Color : {this.state.productColor}
                        <br></br>
                        <br></br>
                        Weight : {this.state.productWeight} kg/each
                        <br></br>
                        <br></br>
                        Dimension : {this.state.productDimension} cm
                        <br></br>
                        <br></br>
                        Description :
                        <br></br>
                        {this.state.productDescription}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" color="secondary" onClick={()=>{this.toggle()}} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    }

    renderCart = () => {
        let map = this.props.cartRedux.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={()=>{this.setState({modal:true,productBrand:val.brand,productName:val.name,productColor:val.color,productWeight:val.weight,productDimension:val.dimension,productDescription:val.description})}} >Show</Button>
                    </td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.pic} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center align-text-top" >{val.qty}</td>
                    <td className="p-2 text-center align-text-top text-success" >
                        <NumberFormat value={val.price*val.qty} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" >Delete</Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    render() {
        console.log(this.props.cartRedux);
        switch (true) {
            case this.props.cartRedux.length > 0:
                return (
                    <div className="mt-3" id="curtain" style={{ marginLeft: "100px" }} >
                        <h1 >Cart</h1>
                        {this.renderModal()}
                        <table className="table-bordered" style={{ width: "1000px" }} >
                            <thead style={{ backgroundColor: "#ffc61a" }} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" >Category</td>
                                <td className="p-2 text-center align-text-top" >Brand</td>
                                <td className="p-2 text-center align-text-top" >Name</td>
                                <td className="p-2 text-center align-text-top" >Desc</td>
                                <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                <td className="p-2 text-center align-text-top" >Pic</td>
                                <td className="p-2 text-center align-text-top" >Qty</td>
                                <td className="p-2 text-center align-text-top" >Total Price</td>
                                <td className="p-2 text-center align-text-top" ></td>
                            </thead>
                            <tbody>
                                {this.renderCart()}

                            </tbody>
                        </table>
                        <Button onClick={() => this.emptyCartClick()} >
                            Empty Cart
                        </Button>
                    </div>
                )
            default:
                return <Redirect to="/" />
        }
    }
}

const mapStateToProps = state => {
    return {
        cartRedux: state.cart.cart
    }
}


export default connect(mapStateToProps, { getCart, emptyCart })(Cart)