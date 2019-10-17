import React,{Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import axios from "axios";
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
        this.getUnapprovedProductList()
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

    renderUnapprovedProductList = ()=>{
        let map = this.state.unapprovedProductList.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={()=>{this.setState({modal:true,productDescription:val.description})}} >Show Description</Button>
                    </td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >{val.price}</td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="Card image cap" />
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic2} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="Card image cap" />
                    </td>
                    <td className="p-2 text-center " >
                        <img src={"http://localhost:5555/"+val.productpic3} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="Card image cap" />
                    </td>
                    <td className="p-2 text-center " >
                        <Button size="sm" color="secondary" onClick={()=>{this.deleteProduct(val.productId)}} >Delete</Button>
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
                        <h1>List Product</h1>
                        <br></br>
                        <h5>List of un-approved product</h5>
                        <p>(We will approve your product within 24 hours, if your product match with the regulation)</p>
                        {this.renderModal()}
                        <table className="table-bordered" style={{width:"1000px"}} >
                            <thead >
                                <td></td>
                                <td className="p-2 text-center " >Category</td>
                                <td className="p-2 text-center " >Brand</td>
                                <td className="p-2 text-center " >Name</td>
                                <td className="p-2 text-center " >Description</td>
                                <td className="p-2 text-center " >Inventory</td>
                                <td className="p-2 text-center " >Measurement</td>
                                <td className="p-2 text-center " >Price</td>
                                <td className="p-2 text-center " >Pic 1</td>
                                <td className="p-2 text-center " >Pic 2</td>
                                <td className="p-2 text-center " >Pic 3</td>
                                <td className="p-2 text-center " ></td>
                            </thead>
                            <tbody>
                                {this.renderUnapprovedProductList()}
                            </tbody>
                        </table>
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