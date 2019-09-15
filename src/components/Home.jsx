import React,{Component} from "react";
import {connect} from "react-redux";
import {
    Card, CardImg, CardBody,
    CardTitle, CardFooter, CardSubtitle
  } from 'reactstrap';
import axios from "axios";
import $ from "jquery"

import Carouselhome from "./Carousel"
  
class Home extends Component {

    state = {
        bestSellingItem : []
    }

    componentDidMount () {
        axios.get(
            'http://localhost:15000/bestSellingItem'
        ).then(res=>this.setState({bestSellingItem:res.data}));
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

    render () {
        return (
            <div className="mt-3" style={{margin:"50px"}}>
                {this.renderCarousel()}
                <br></br>
                <p className="h5" style={{color:"#737373"}}>Best Selling Item</p>
                
                <div style={{height:"300px",overflowX:"scroll",overflowY:"hidden",whiteSpace:"nowrap"}}>
                    {this.renderBestSellingItem()}
                </div>
            </div>
        );
    }
}

export default connect()(Home)
