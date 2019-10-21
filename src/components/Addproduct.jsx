import React,{Component} from "react";
import { Row, CustomInput, Card, Button, CardBody, CardFooter, CardImg, CardText,
    CardHeader, Input, Form, FormGroup, Label,
    Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {connect} from "react-redux";
import axios from "axios";
import {Redirect} from "react-router-dom";

class Addproduct extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            modal : false,
            renderpic1 : "images/productpics/nopic.png",
            renderpic2 : "images/productpics/nopic.png",
            renderpic3 : "images/productpics/nopic.png",
            editPic1 : false,
            editPic2 : false,
            editPic3 : false,
            productpic1 : "",
            productpic2 : "",
            productpic3 : "",
            category : "Fashion",
            brand : "",
            inventory : "",
            measurement : "meter",
            name : "",
            price : "",
            description : "",
            color : "",
            weight : "",
            dimension : ""
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    componentDidMount () {
        let setProductId = localStorage.getItem("setproductId")
        if (setProductId) {
            this.getPic()
        }
    }

    getProductPic1 = (val)=>{
        switch (false) {
            case val.type.split("/")[1]==="png" || val.type.split("/")[1]==="jpeg" :
                alert("File must be an image")
                break;
            case val.size<200000 :
                alert("File size must be smaller than 200Kb")
                break;
            default:
                this.setState({productpic1:val})
        }
    }

    getProductPic2 = (val)=>{
        switch (false) {
            case val.type.split("/")[1]==="png" || val.type.split("/")[1]==="jpeg" :
                alert("File must be an image")
                break;
            case val.size<200000 :
                alert("File size must be smaller than 200Kb")
                break;
            default:
                this.setState({productpic2:val})
        }
    }

    getProductPic3 = (val)=>{
        switch (false) {
            case val.type.split("/")[1]==="png" || val.type.split("/")[1]==="jpeg" :
                alert("File must be an image")
                break;
            case val.size<200000 :
                alert("File size must be smaller than 200Kb")
                break;
            default:
                this.setState({productpic3:val})
        }
    }

    uploadPic1 = ()=>{
        let setProductId = localStorage.getItem("setproductId")
        if (!setProductId) {
            let d = new Date()
            let year = d.getFullYear().toString()
            let month = (d.getMonth()+1).toString()
                if(month.length<2) {month="0"+month}
            let date = d.getDate().toString()
                if(date.length<2) {date="0"+date}
            let addedDate = year+month+date
            axios.post("http://localhost:5555/prod/addproduct", {
                storename : this.props.loginRedux[0].storename,
                addeddate : addedDate
            })
            .then(res=>{
                localStorage.setItem("setproductId",res.data.insertId)
                let fd = new FormData()
                let data = {
                    productId : res.data.insertId
                }
                fd.append("productPic", this.state.productpic1)
                fd.append("data", JSON.stringify(data))
                axios.put("http://localhost:5555/upload/uploadproductpic1", fd)
                .then(res=>{
                    this.getPic()
                    this.setState({editPic1:false,productpic1:""})
                }).catch()
            })
            .catch()
        } else {
            let fd = new FormData()
            let data = {
                productId : setProductId
            }
            fd.append("productPic", this.state.productpic1)
            fd.append("data", JSON.stringify(data))
            axios.put("http://localhost:5555/upload/uploadproductpic1", fd)
            .then(res=>{
                this.getPic()
                this.setState({editPic1:false,productpic1:""})
            }).catch()
        }    
    }

    uploadPic2 = ()=>{
        let setProductId = localStorage.getItem("setproductId")
        if (!setProductId) {
            let d = new Date()
            let year = d.getFullYear().toString()
            let month = (d.getMonth()+1).toString()
                if(month.length<2) {month="0"+month}
            let date = d.getDate().toString()
                if(date.length<2) {date="0"+date}
            let addedDate = year+month+date
            axios.post("http://localhost:5555/prod/addproduct", {
                storename : this.props.loginRedux[0].storename,
                addeddate : addedDate
            })
            .then(res=>{
                localStorage.setItem("setproductId",res.data.insertId)
                let fd = new FormData()
                let data = {
                    productId : res.data.insertId
                }
                fd.append("productPic", this.state.productpic2)
                fd.append("data", JSON.stringify(data))
                axios.put("http://localhost:5555/upload/uploadproductpic2", fd)
                .then(res=>{
                    this.getPic()
                    this.setState({editPic2:false,productpic2:""})
                }).catch()
            })
            .catch()
        } else {
            let fd = new FormData()
            let data = {
                productId : setProductId
            }
            fd.append("productPic", this.state.productpic2)
            fd.append("data", JSON.stringify(data))
            axios.put("http://localhost:5555/upload/uploadproductpic2", fd)
            .then(res=>{
                this.getPic()
                this.setState({editPic2:false,productpic2:""})
            }).catch()
        }    
    }

    uploadPic3 = ()=>{
        let setProductId = localStorage.getItem("setproductId")
        if (!setProductId) {
            let d = new Date()
            let year = d.getFullYear().toString()
            let month = (d.getMonth()+1).toString()
                if(month.length<2) {month="0"+month}
            let date = d.getDate().toString()
                if(date.length<2) {date="0"+date}
            let addedDate = year+month+date
            axios.post("http://localhost:5555/prod/addproduct", {
                storename : this.props.loginRedux[0].storename,
                addeddate : addedDate
            })
            .then(res=>{
                localStorage.setItem("setproductId",res.data.insertId)
                let fd = new FormData()
                let data = {
                    productId : res.data.insertId
                }
                fd.append("productPic", this.state.productpic3)
                fd.append("data", JSON.stringify(data))
                axios.put("http://localhost:5555/upload/uploadproductpic3", fd)
                .then(res=>{
                    this.getPic()
                    this.setState({editPic3:false,productpic3:""})
                }).catch()
            })
            .catch()
        } else {
            let fd = new FormData()
            let data = {
                productId : setProductId
            }
            fd.append("productPic", this.state.productpic3)
            fd.append("data", JSON.stringify(data))
            axios.put("http://localhost:5555/upload/uploadproductpic3", fd)
            .then(res=>{
                this.getPic()
                this.setState({editPic3:false,productpic3:""})
            }).catch()
        }    
    }

    getPic = ()=>{
        let token = localStorage.getItem("token")
        let setProductId = localStorage.getItem("setproductId")
        axios.get("http://localhost:5555/prod/getproductbyid", {
            params : {
                productId : setProductId
            },
            headers : {
                authorization : token
            }
        })
        .then(res=>{
            if (res.data[0].productpic1!==null) {
                this.setState({renderpic1:res.data[0].productpic1})
            }
            if (res.data[0].productpic2!==null) {
                this.setState({renderpic2:res.data[0].productpic2})
            }
            if (res.data[0].productpic3!==null) {
                this.setState({renderpic3:res.data[0].productpic3})
            }
        })
        .catch()
    }

    addProduct = ()=>{
        switch (true) {
            case this.state.renderpic1 === "images/productpics/nopic.png":
                alert("Please upload 3 product picture")
                break;
            case this.state.renderpic2 === "images/productpics/nopic.png":
                alert("Please upload 3 product picture")
                break;
            case this.state.renderpic3 === "images/productpics/nopic.png":
                alert("Please upload 3 product picture")
                break;
            case !this.state.brand || !this.state.inventory || !this.state.name || !this.state.description || !this.state.price || !this.state.weight || !this.state.color :
                alert("Please fill in all empty fields")
            default:
                let setProductId = localStorage.getItem("setproductId")
                axios.put("http://localhost:5555/prod/addproductfinal", {
                category : this.state.category,
                brand : this.state.brand,
                inventory : this.state.inventory,
                measurement : this.state.measurement,
                name : this.state.name,
                color : this.state.color,
                weight : this.state.weight,
                dimension : this.state.dimension,
                description : this.state.description,
                price : this.state.price,
                productId : setProductId
                })
                .then(res=>{
                    this.setState({modal:true})
                    localStorage.removeItem("setproductId");
                }).catch()
                break;
        }
    }

    renderModal = ()=>{
        return (
            <Modal isOpen={this.state.modal}>
                <ModalHeader style={{backgroundColor:"#ffc61a"}}>Add Product Success</ModalHeader>
                <ModalBody>
                    <p className="text-justify">
                        Product has been added to your store.
                        <br></br>
                        However, it will only be displayed after it gets approval from our team, in 24 hours at most.
                        <br></br>
                        You can check its status in "List Product" tab.
                        <br></br>
                        <br></br>
                        Thank you.
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" href="/Addproduct" >Add another product</Button>
                    <Button color="secondary" href="/Listproduct" >List Product</Button>
                    <Button color="secondary" href="/" >Home</Button>
                </ModalFooter>
            </Modal>
        )
    } 
    
    render () {
        switch (true) {
            case this.props.loginRedux.length>0:
                return (
                    <div className="mt-3 mx-5" id="curtain">
                        {this.renderModal()}
                        <h1>Add Product of {this.props.loginRedux[0].storename}</h1>
                        <Row className="mb-3">
                            <Card style={{width:"300px"}} className="mr-3">
                                <CardHeader>Product Picture 1</CardHeader>
                                <CardImg className="mx-auto my-3 border" src={"http://localhost:5555/"+this.state.renderpic1} style={{height:"250px",width:"250px",objectFit:"cover"}} alt="Card image cap" />
                                {
                                    this.state.editPic1===true
                                    ?
                                    <CardBody>
                                        <CardText className="mb-0">Select picture</CardText>
                                        <CardText>
                                            <small>pic size max 200kb</small>
                                        </CardText>    
                                        <CustomInput type="file" label={this.state.productpic1.name} onChange={e=>this.getProductPic1(e.target.files[0])} />
                                    </CardBody>
                                    :
                                    null
                                }
                                {
                                    this.state.editPic1===false
                                    ?
                                    <CardFooter>
                                        <Button onClick={()=>this.setState({editPic1:true})} >Edit</Button>
                                    </CardFooter>
                                    :
                                    <CardFooter>
                                        <Button onClick={()=>this.setState({editPic1:false,productpic1:""})} >Cancel</Button>
                                        <Button className="ml-1" disabled={!this.state.productpic1} onClick={()=>this.uploadPic1()} >Upload</Button>
                                    </CardFooter>
                                }
                            </Card>
        
                            <Card style={{width:"300px"}} className="mr-3">
                                <CardHeader>Product Picture 2</CardHeader>
                                <CardImg className="mx-auto my-3 border" src={"http://localhost:5555/"+this.state.renderpic2} style={{height:"250px",width:"250px",objectFit:"cover"}} alt="Card image cap" />
                                {
                                    this.state.editPic2===true
                                    ?
                                    <CardBody>
                                        <CardText className="mb-0">Select picture</CardText>
                                        <CardText>
                                            <small>pic size max 200kb</small>
                                        </CardText>    
                                        <CustomInput type="file" label={this.state.productpic2.name} onChange={e=>this.getProductPic2(e.target.files[0])} />
                                    </CardBody>
                                    :
                                    null
                                }
                                {
                                    this.state.editPic2===false
                                    ?
                                    <CardFooter>
                                        <Button onClick={()=>this.setState({editPic2:true})} >Edit</Button>
                                    </CardFooter>
                                    :
                                    <CardFooter>
                                        <Button onClick={()=>this.setState({editPic2:false,productpic2:""})} >Cancel</Button>
                                        <Button className="ml-1" disabled={!this.state.productpic2} onClick={()=>this.uploadPic2()} >Upload</Button>
                                    </CardFooter>
                                }
                            </Card>
        
                            <Card style={{width:"300px"}} className="mr-3">
                                <CardHeader>Product Picture 3</CardHeader>
                                <CardImg className="mx-auto my-3 border" src={"http://localhost:5555/"+this.state.renderpic3} style={{height:"250px",width:"250px",objectFit:"cover"}} alt="Card image cap" />
                                {
                                    this.state.editPic3===true
                                    ?
                                    <CardBody>
                                        <CardText className="mb-0">Select picture</CardText>
                                        <CardText>
                                            <small>pic size max 200kb</small>
                                        </CardText>    
                                        <CustomInput type="file" label={this.state.productpic3.name} onChange={e=>this.getProductPic3(e.target.files[0])} />
                                    </CardBody>
                                    :
                                    null
                                }
                                {
                                    this.state.editPic3===false
                                    ?
                                    <CardFooter>
                                        <Button onClick={()=>this.setState({editPic3:true})} >Edit</Button>
                                    </CardFooter>
                                    :
                                    <CardFooter>
                                        <Button onClick={()=>this.setState({editPic3:false,productpic3:""})} >Cancel</Button>
                                        <Button className="ml-1" disabled={!this.state.productpic3} onClick={()=>this.uploadPic3()} >Upload</Button>
                                    </CardFooter>
                                }
                            </Card>
                        </Row>
                        <Form>
                            <FormGroup>
                                <p>
                                    <label>category :&nbsp;&nbsp;</label>
                                    <select className="mr-5" onClick={e=>this.setState({category:e.target.value})} >
                                        <option value="Fashion" >Fashion</option>
                                        <option value="Furniture" >Furniture</option>
                                        <option value="Electronic" >Electronic</option>
                                        <option value="Cellphone" >Cellphone</option>
                                        <option value="Notebook" >Notebook</option>
                                        <option value="Sport" >Sport</option>
                                    </select>
                                    <label>Brand :&nbsp;</label>
                                    <input type="text" className="mr-5" style={{width:"290px"}} onChange={e=>this.setState({brand:e.target.value})} />
                                    <label>Inventory :&nbsp;&nbsp;</label>
                                    <input type="number" style={{width:"50px"}} onChange={e=>this.setState({inventory:e.target.value})} />
                                    <select style={{height:"40px"}} onClick={e=>this.setState({measurement:e.target.value})} >
                                        <option value="meter" >Meter (mtr)</option>
                                        <option value="centimeter" >Centimeter (cm)</option>
                                        <option value="kilogram" >Kilogram (kg)</option>
                                        <option value="gram" >Gram (gr)</option>
                                        <option value="pcs" >Pieces (pcs)</option>
                                        <option value="dozen" >Dozen (doz)</option>
                                        <option value="unit" >Unit (un)</option>
                                    </select>
                                </p>
                                <p>
                                    <label>Name :&nbsp;</label>
                                    <input type="text" className="mr-5" style={{width:"510px"}} onChange={e=>this.setState({name:e.target.value})} />
                                    <label>Price (IDR) :&nbsp;</label>
                                    <input style={{width:"210px"}} onChange={e=>this.setState({price:e.target.value})} />
                                </p>
                                <p>
                                    <label>Color :&nbsp;</label>
                                    <input type="text" className="mr-3" style={{width:"200px"}} onChange={e=>this.setState({color:e.target.value})} />
                                    <label>Weight (kg/each) :&nbsp;</label>
                                    <input type="number" className="mr-3" style={{width:"50px"}} onChange={e=>this.setState({weight:e.target.value})} />
                                    <label>Dimension (cm) :&nbsp;</label>
                                    <input placeholder="exp : length x width x height, or diameter" className="mr-3" style={{width:"320px"}} onChange={e=>this.setState({dimension:e.target.value})} />
                                </p>
                                <p>
                                    <Label for="exampleText">Description :</Label>
                                    <Input style={{width:"920px"}} type="textarea" name="text" id="exampleText" placeholder="exp : fabrics, material, feature, etc" onChange={e=>this.setState({description:e.target.value})} />
                                </p>
                            </FormGroup>
                            <Button onClick={()=>{this.addProduct()}} >Add Product</Button>
                            <br></br>
                            <br></br>
                            
                        </Form>
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


export default connect(mapStateToProps)(Addproduct)
    