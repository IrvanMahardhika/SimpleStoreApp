import React,{Component} from "react";
import {connect} from "react-redux";
import { Card, Button, CardHeader, CardBody,
    CardTitle, Input } from 'reactstrap';

import {headerChange} from "../action/index";

class Transtat extends Component {

    componentDidMount () {
        this.props.headerChange()
    }

    render () {
        return (
            <div id="curtain2" className="row justify-content-center">
                <Card className="mt-5" style={{width:"600px"}}>
                    <CardHeader>Transaction Status</CardHeader>
                    <CardBody>
                        <CardTitle>Only for purchasing without login</CardTitle>
                        <Input placeholder="Buyer code" className="my-3"/>
                        <Input placeholder="Transaction code" className="my-3"/>
                        <Button className="btn-block my-3">
                            Status
                        </Button>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default connect(null,{headerChange})(Transtat)