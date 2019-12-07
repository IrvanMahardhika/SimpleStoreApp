import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Card, Button, CardHeader, CardBody, CustomInput,
    CardTitle, Input, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import axios from "axios";
import NumberFormat from "react-number-format";

import { headerChange } from "../action/index";

class Test extends Component {

    state = {
        table: false
    }

    render() {
        return (
            <div className="mt-3" id="curtain2" style={{ marginLeft: "100px" }} >
                <div id="divTest" >
                    <Button id="buttonTest" onClick={() => this.setState({ table: true })} >
                        Click me !
                    </Button>
                    <br></br>
                    <br></br>

                    {
                        this.state.table === true ?
                        <table id="tableTest" >
                            <tr >
                                <td id="tdTest0" >
                                    Col 1
                                </td>
                            </tr>
                            <tr >
                                <td id="tdTest1" >
                                    20
                                </td>
                            </tr>
                            <tr >
                                <td id="tdTest2" >
                                    40
                                </td>
                            </tr>
                        </table>
                        :null
                    }

                    
                </div>
            </div>
        )
    }


}

export default connect(null, { headerChange })(Test)