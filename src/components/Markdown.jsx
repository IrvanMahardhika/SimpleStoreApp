import React,{Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import axios from "axios";
import NumberFormat from "react-number-format";
import { Button, Modal, ModalHeader,  ModalBody, ModalFooter } from 'reactstrap';

class Markdown extends Component {

    state = {
        productList : [],
        markdown : []
    }

    componentDidMount () {
        let storage = JSON.parse(localStorage.getItem("userData"))
        if (storage) {
            this.getApprovedProductList()
        }
        let a = []
        for (let i=0; i<this.state.productList.length; i++) {a.push(0)}
        this.setState({markdown:a})
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
            this.setState({productList:res.data})
        })
        .catch()
    }

    getMarkdown = (val,index)=>{
        console.log(val);
        console.log(index);
        this.state.markdown[index]=val
        console.log(this.state.markdown); 
    }

    renderApprovedProductList = ()=>{
        let map = this.state.productList.map((val,index)=>{
            return (
                <tr>
                    <td className="p-2 text-center align-text-top" >{index+1}</td>
                    <td className="p-2 text-center align-text-top" >{val.category}</td>
                    <td className="p-2 text-center align-text-top" >{val.brand}</td>
                    <td className="p-2 text-center align-text-top" >{val.name}</td>
                    <td className="p-2 text-center align-text-top" >{val.inventory}</td>
                    <td className="p-2 text-center align-text-top" >{val.measurement}</td>
                    <td className="p-2 text-center align-text-top" >
                        <NumberFormat value={val.price} displayType={'text'} thousandSeparator={true} />
                    </td>
                    <td className="p-2 text-center " >
                        <input autoFocus onChange={e=>this.getMarkdown(e.target.value,index)} />
                    </td>
                    <td className="p-2 text-center " >
                        <input />
                    </td>
                    <td className="p-2 text-center " >
                        <NumberFormat value={val.price-this.state.markdown[index]} displayType={'text'} thousandSeparator={true} />
                    </td>
                </tr>
            )
        })
        return map
    }

    render () {
        switch (true) {
            case this.props.loginRedux.length>0:
                return (
                    <div className="mt-3 mx-5" id="curtain">
                        <h1>{this.props.loginRedux[0].storename}'s Product Price Markdown</h1>
                        <br></br>
                        <table className="table-bordered" style={{width:"1000px"}} >
                            <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center " >Category</td>
                                <td className="p-2 text-center " >Brand</td>
                                <td className="p-2 text-center " >Name</td>
                                <td className="p-2 text-center " >Inventory</td>
                                <td className="p-2 text-center " >EA</td>
                                <td className="p-2 text-center " >Price (IDR)</td>
                                <td className="p-2 text-center " >Markdown by %</td>
                                <td className="p-2 text-center " >Markdown by value</td>
                                <td className="p-2 text-center " >Markdown price</td>
                            </thead>
                            <tbody>
                                {this.renderApprovedProductList()}
                                
                            </tbody>
                        </table>
                        <Button className="my-3" href="/Listproduct">Back to List Product</Button>
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

export default connect(mapStateToProps,{})(Markdown)

