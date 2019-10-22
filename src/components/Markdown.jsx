import React,{Component} from "react";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import axios from "axios";
import NumberFormat from "react-number-format";
import { Button, Input, FormGroup, FormFeedback, Col, Label, Modal, ModalHeader,  ModalBody, ModalFooter } from 'reactstrap';

class Markdown extends Component {

    state = {
        productList : [],
        markdown : [],
        showPercent : [],
        showValue : [],
        forReRender : true
    }

    componentDidMount () {
        let storage = JSON.parse(localStorage.getItem("userData"))
        if (storage) {
            this.getApprovedProductList()
        }
        let a = []
        let b = []
        let c = []
        for (let i=0; i<this.state.productList.length; i++) {a.push("a");b.push("a");c.push("a")}
        this.setState({markdown:a,showPercent:b,showValue:c})
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

    getMarkdown = (val,index,price,type)=>{
        switch (true) {
            case val==="":
                this.state.markdown[index]=0
                this.state.showPercent[index]="a"
                this.state.showValue[index]="a"
                this.setState({forReRender:true})
                break;
            case type===1:
                let z=price*val/100    
                this.state.markdown[index]=z
                this.state.showPercent[index]=val
                this.state.showValue[index]="b"
                this.setState({forReRender:true})
                break;
            case type===2:
                this.state.markdown[index]=val
                this.state.showValue[index]=val
                this.state.showPercent[index]="b"
                this.setState({forReRender:true})
                break;
        }
    }

    renderYear = ()=>{
        let d = new Date()
        let x = d.getFullYear()-12
        let y = []
        for(let i=0; i<60; i++){y.push(x-i)}
        let z = y.map(val=>{
            return (
                <option value={val} >{val}</option>
            )
        })
        return z
    }

    renderDate = ()=>{
        let y = []
        for(let i=1; i<32; i++){
            if (i<10) {y.push("0"+i)}
            else {y.push(i)}
        }
        let z = y.map(val=>{
            return (
                <option value={val} >{val}</option>
            )
        })
        return z
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
                    <td className="p-2 text-center align-text-top" >
                        <img src={"http://localhost:5555/"+val.productpic1} style={{height:"50px",width:"50px",objectFit:"cover"}} alt="No pic" />
                    </td>
                    <td className="p-2 text-center " >
                        <FormGroup className="m-0">
                            <Input invalid={this.state.showPercent[index]<10} style={{width:"60px"}} disabled={this.state.showPercent[index]==="b"} onChange={e=>this.getMarkdown(e.target.value,index,val.price,1)} />
                            <FormFeedback onInvalid>min 10%</FormFeedback>
                        </FormGroup>
                    </td>
                    <td className="p-2 text-center " >
                        <FormGroup className="m-0">
                            <Input invalid={this.state.showValue[index]<10000} style={{width:"110px"}} disabled={this.state.showValue[index]==="b"} onChange={e=>this.getMarkdown(e.target.value,index,val.price,2)} />
                            <FormFeedback onInvalid>min IDR 10000</FormFeedback>
                        </FormGroup>
                    </td>
                    <td className="p-2 text-center align-text-top text-success" >
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
                        <table className="border mb-1" style={{width:"1000px"}} >
                            <thead>
                                <tr>
                                    <td className="h5 pl-3 border-bottom" colSpan="2" >
                                        Markdown 1
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className="ml-3" >Start Date :&nbsp;
                                            <select >{this.renderDate()}</select>
                                            &nbsp;
                                            <select >
                                                <option value="01" >Jan</option>
                                                <option value="02" >Feb</option>
                                                <option value="03" >Mar</option>
                                                <option value="04" >Apr</option>
                                                <option value="05" >May</option>
                                                <option value="06" >Jun</option>
                                                <option value="07" >Jul</option>
                                                <option value="08" >Agt</option>
                                                <option value="09" >Sep</option>
                                                <option value="10" >Oct</option>
                                                <option value="11" >Nov</option>
                                                <option value="12" >Dec</option>
                                            </select>
                                            &nbsp;
                                            <select >{this.renderYear()}</select>
                                        </span>
                                    </td>
                                    <td className="border-left" rowSpan="2">
                                        <FormGroup className="ml-5" tag="fieldset">
                                            <Label className="mt-1 mb-2" check>
                                                <Input type="radio" name="radio1" value="Male" />
                                                Set markdown one by one
                                            </Label>
                                            <br></br>
                                            <Label check>
                                                <Input type="radio" name="radio1" value="Female" />
                                                Set markdown globally
                                            </Label>
                                        </FormGroup>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="ml-3" >End Date :&nbsp;
                                            <select >{this.renderDate()}</select>
                                            &nbsp;
                                            <select >
                                                <option value="01" >Jan</option>
                                                <option value="02" >Feb</option>
                                                <option value="03" >Mar</option>
                                                <option value="04" >Apr</option>
                                                <option value="05" >May</option>
                                                <option value="06" >Jun</option>
                                                <option value="07" >Jul</option>
                                                <option value="08" >Agt</option>
                                                <option value="09" >Sep</option>
                                                <option value="10" >Oct</option>
                                                <option value="11" >Nov</option>
                                                <option value="12" >Dec</option>
                                            </select>
                                            &nbsp;
                                            <select >{this.renderYear()}</select>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table-bordered" style={{width:"1000px"}} >
                            <thead style={{backgroundColor:"#ffc61a"}} className="font-weight-bold">
                                <td></td>
                                <td className="p-2 text-center align-text-top" >Category</td>
                                <td className="p-2 text-center align-text-top" >Brand</td>
                                <td className="p-2 text-center align-text-top" >Name</td>
                                <td className="p-2 text-center align-text-top" >Inventory</td>
                                <td className="p-2 text-center align-text-top" >EA</td>
                                <td className="p-2 text-center align-text-top" >Price (IDR)</td>
                                <td className="p-2 text-center align-text-top" >Pic</td>
                                <td className="p-2 text-center align-text-top" >Markdown by %</td>
                                <td className="p-2 text-center align-text-top" >Markdown by IDR</td>
                                <td className="p-2 text-center align-text-top" >Price after markdown</td>
                            </thead>
                            <tbody>
                                {this.renderApprovedProductList()}
                                <tr>
                                    <td colSpan="11" className="text-right" >
                                        <Button className="m-1" >Save Markdown</Button>
                                    </td>
                                </tr>
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

