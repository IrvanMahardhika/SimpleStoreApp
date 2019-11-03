import React, { Component } from "react";
import axios from "axios";
import NumberFormat from "react-number-format";
import {
    Row, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    TabContent, TabPane, Nav, NavItem, NavLink, CardHeader, Input, FormGroup, FormFeedback, Badge
} from 'reactstrap';

class Productdetail extends Component {

    state = {
        renderpic: "images/userpics/nopic.png",
        productDetail: []
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

    render() {
        return (
            <div className="mt-3" id="curtain" style={{ marginLeft: "100px" }} >
                <Row >
                    <Card className="mr-1" style={{ backgroundColor: "#ffc61a" }} >
                        <CardImg className="mx-auto my-3" src={"http://localhost:5555/" + this.state.renderpic} style={{ height: "400px", width: "400px", objectFit: "cover" }} alt="Card image cap" />
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
                                        <tr>
                                            <td className="p-3" >
                                                Price
                                        </td>
                                            <td className="p-3" >
                                                <NumberFormat className="border-0" prefix="IDR " value={this.state.productDetail[0].price} thousandSeparator={true} />
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
                                                Description
                                        </td>
                                            <td className="p-3" >
                                                {this.state.productDetail[0].description}
                                            </td>
                                        </tr>
                                    </table>
                                </CardText>
                            </Card>
                            :
                            null
                    }
                </Row>
            </div>
        )
    }
}

export default Productdetail