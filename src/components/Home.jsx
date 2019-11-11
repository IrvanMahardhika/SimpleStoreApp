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
import CarouselHomeNewProducts from "./CarouselHomeNewProducts"
  
class Home extends Component {

    state = {
        
    }

    componentDidMount () {
        this.props.headerSearchbox();
    }

    renderCarousel = () => {
        return <Carouselhome/>
    }

    renderModal = () => {
        return <Modalhome/>
    }

    renderCarouselHomeNewProducts = () => {
        return <CarouselHomeNewProducts />
    }

    render () {
        return (
            <div className="mt-3" style={{margin:"100px"}}>
                {
                    this.props.loginRedux.length>0
                    ?
                        this.props.loginRedux[0].emailverified===0
                        ?
                        this.renderModal()
                        :
                        null
                    :
                    null
                }
                <div id="curtain2" >
                    {this.renderCarousel()}
                </div>
                
                <br></br>
                <p className="h5 my-1" style={{color:"#737373"}}>New Products</p>
                <div id="curtain2" >
                    {this.renderCarouselHomeNewProducts()}
                </div>
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
