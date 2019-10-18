import React,{Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import axios from "axios";
import NumberFormat from "react-number-format";
import { Button, Modal, ModalHeader,  ModalBody, ModalFooter } from 'reactstrap';

class Listproduct extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modal : false,
            unapprovedProductList : [],
            approvedProductList : [],
            productDescription : ""
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    componentDidMount () {
        let storage = JSON.parse(localStorage.getItem("userData"))
        if (storage) {
            this.getUnapprovedProductList()
            this.getApprovedProductList()
        }
    }

    getUnapprovedProductList = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getunapprovedproduct", {
            params : {
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({unapprovedProductList:res.data})
        })
        .catch()
    }

    getApprovedProductList = ()=>{
        let token = localStorage.getItem("token")
        axios.get("http://localhost:5555/prod/getapprovedproduct", {
            params : {
                storename : this.props.loginRedux[0].storename
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            this.setState({approvedProductList:res.data})
        })
        .catch()
    }

    renderUnapprovedProductList = ()=>{
        let map = this.state.unapprovedProductList.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={()=>{this.setState({modal:true,productDescription:val.description})}} >Show</Button>
                    </td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" ><NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} /></td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic2} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic3} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={()=>{this.deleteProduct(val.productId)}} >Delete</Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderApprovedProductList = ()=>{
        let map = this.state.approvedProductList.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={()=>{this.setState({modal:true,productDescription:val.description})}} >Show</Button>
                    </td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                        <Button size="sm" >Markdown</Button>
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic2} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic3} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={()=>{this.deleteProduct(val.productId)}} >Stop Selling</Button>
                    </td>
                </tr>
            )
        })
        return map
    }

    renderModal = ()=>{
        return (
            <Modal isOpen={this.state.modal}>
                <ModalHeader style={{backgroundColor:"#ffc61a"}}>Product Description</ModalHeader>
                <ModalBody>
                    <p className="text-justify">
                        {this.state.productDescription}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={()=>{this.toggle()}} >Close</Button>
                </ModalFooter>
            </Modal>
        )
    } 

    deleteProduct = (val)=>{
        axios.put("http://localhost:5555/prod/deleteproduct", {
            productId : val
        })
        .then(res=>{
            this.getUnapprovedProductList()
        })
        .catch()
    }

    render () {
        switch (true) {
            case this.props.loginRedux.length>0:
                return (
                    <div className="mt-3 mx-5" id="curtain" >
                        <h1>{this.props.loginRedux[0].storename}'s Product List</h1>
                        <br></br>
                        <h5>List of un-approved product</h5>
                        <p><small>(We will approve your product within 24 hours, if your product match with the regulation)</small></p>
                        {this.renderModal()}
                        <table className="table-bordered" style={{width:"1000px"}} >
                            <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center " >Category</td>
                                <td className="p-2 text-center " >Brand</td>
                                <td className="p-2 text-center " >Name</td>
                                <td className="p-2 text-center " >Desc</td>
                                <td className="p-2 text-center " >Inventory</td>
                                <td className="p-2 text-center " >EA</td>
                                <td className="p-2 text-center " >Price (IDR)</td>
                                <td className="p-2 text-center " >Pic 1</td>
                                <td className="p-2 text-center " >Pic 2</td>
                                <td className="p-2 text-center " >Pic 3</td>
                                <td className="p-2 text-center " ></td>
                            </thead>
                            <tbody>
                                {this.renderUnapprovedProductList()}
                                <td className="p-2 text-right " colSpan="12">
                                    <Button className="mr-2" href="/Addproduct">Add Product</Button>
                                </td>
                            </tbody>
                        </table>
                        <br></br>
                        <br></br>
                        <h5>List of approved product</h5>
                        <table className="table-bordered" style={{width:"1000px"}} >
                            <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center " >Category</td>
                                <td className="p-2 text-center " >Brand</td>
                                <td className="p-2 text-center " >Name</td>
                                <td className="p-2 text-center " >Desc</td>
                                <td className="p-2 text-center " >Inventory</td>
                                <td className="p-2 text-center " >EA</td>
                                <td className="p-2 text-center " >Price (IDR)</td>
                                <td className="p-2 text-center " >Pic 1</td>
                                <td className="p-2 text-center " >Pic 2</td>
                                <td className="p-2 text-center " >Pic 3</td>
                                <td className="p-2 text-center " ></td>
                            </thead>
                            <tbody>
                                {this.renderApprovedProductList()}
                                <tr>
                                    <td className="p-2 text-right " colSpan="12">
                                        <Button>Markdown ALL</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br></br>
                        <br></br>
                    </div>
                )
            default:
                return <Redirect to="/" />
        }
        
    }

}

const mapStateToProps = state => {
    return {
        loginRedux : state.login.user
    }
}

export default connect(mapStateToProps,{})(Listproduct)