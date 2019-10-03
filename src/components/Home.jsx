import React,{Component} from "react";
import {connect} from "react-redux";
import {
    Card, CardImg, CardBody,
    CardTitle, CardFooter, CardSubtitle
  } from 'reactstrap';
import axios from "axios";
import {headerSearchbox} from "../action/index"


import Carouselhome from "./Carouselhome"
import Modalhome from "./Modalhome";
  
class Home extends Component {

    state = {
        bestSellingItem : [],
        emailverified : ""
    }

    componentDidMount () {
        this.props.headerSearchbox();
        
        axios.get(
            'http://localhost:15000/bestSellingItem'
        ).then(res=>{
            this.setState({bestSellingItem:res.data})
        }).catch();

        if (this.props.loginRedux.length>0) {
            axios.get("http://localhost:5555/auth/getlogin", {
                params : {
                    username : this.props.loginRedux[0].username,
                    email : this.props.loginRedux[0].username,
                    cellphone : this.props.loginRedux[0].username
                }
            }).then(res=>{
                this.setState({emailverified:res.data[0].emailverified})
            }).catch()
        }
    }

    renderBestSellingItem = () => {
        let z = this.state.bestSellingItem.map(val=>{
            return (
                <Card className="border-warning d-inline-block p-0" style={{width:"150px",margin:"5px",fontSize:"12px"}}>
                    <CardImg className="m-1" top style={{width:"140px",height:"100px",objectFit:"cover"}} src={val.picture} alt="Card image cap" />
                    <CardBody className="py-0">
                        <CardTitle style={{height:"1rem"}} className="overflow-hidden">{val.name}</CardTitle>
                        <CardSubtitle>$ {val.price}</CardSubtitle>
                        <div>*****</div>
                    </CardBody>
                    <CardFooter>
                        <p className="my-0">store name</p>
                        <p className="my-0">store adress</p>
                        <p className="my-0">% successfull trans</p>
                    </CardFooter>
                </Card>     
            )
        })
        return z
    }

    renderCarousel = () => {
        return <Carouselhome/>
    }

    renderModal = () => {
        return <Modalhome/>
    }

    render () {
        return (
            <div className="mt-3" style={{margin:"50px"}}>
                {this.renderCarousel()}
                <br></br>
                <p className="h5" style={{color:"#737373"}}>Best Selling Item</p>
                
                <div style={{height:"300px",overflowX:"scroll",overflowY:"hidden",whiteSpace:"nowrap"}}>
                    {this.renderBestSellingItem()}
                </div>
                {
                    this.props.loginRedux.length>0
                    ?
                        this.state.emailverified===0
                        ?
                        this.renderModal()
                        :
                        null
                    :
                    null
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loginRedux : state.login.user
    }
}


export default connect(mapStateToProps,{headerSearchbox})(Home)
