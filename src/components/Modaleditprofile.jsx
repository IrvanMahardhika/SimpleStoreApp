import React,{Component} from "react";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Input} from 'reactstrap';
import {connect} from "react-redux";
import axios from "axios";

import {getData} from "../action/index";


class Modaleditprofile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            input1: "",
            input2: "",
            input3: "",
            input4: "",
            input5: "",
            input6: "",
            randomCode: ""
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    componentDidMount () {
        let random
        do {
            random = parseInt(Math.random()*1000000).toString()
        } while (random<100000);
        console.log(random);
        this.setState({randomCode:random})
    }

    verCel = (val)=>{
        let inputCode = [this.state.input1,this.state.input2,this.state.input3,this.state.input4,this.state.input5,val].join("")
        if (inputCode===this.state.randomCode) {
            this.toggle()
            axios.put("http://localhost:5555/auth/verifyCellphone",
                {
                    username : this.props.loginRedux[0].username
                }
            )
            .then(res=>{
                alert("Cellphone verified")
                this.props.getData()
            })
            .catch()
        } else {
            alert("Wrong input code")
            document.getElementById("verCod1").value='';
            document.getElementById("verCod2").value='';
            document.getElementById("verCod3").value='';
            document.getElementById("verCod4").value='';
            document.getElementById("verCod5").value='';
            document.getElementById("verCod6").value='';
            document.getElementById("verCod1").focus()
        }
    }

    z = () => {
        let container = document.getElementsByClassName("code")[0];
        container.onkeyup = (e) => {
            var target = e.srcElement || e.target;
            var maxLength = parseInt(target.attributes["maxlength"].value, 10);
            var myLength = target.value.length;
            if (myLength >= maxLength) {
                var next = target;
                while (next = next.nextElementSibling) {
                    if (next == null)
                        break;
                    if (next.tagName.toLowerCase() === "input") {
                        next.focus();
                        break;
                    }
                }
            } else if (myLength === 0) {
                var previous = target;
                while (previous = previous.previousElementSibling) {
                    if (previous == null)
                        break;
                    if (previous.tagName.toLowerCase() === "input") {
                        previous.focus();
                        // previous.value=""
                        break;
                    }
                }
            }
        }
    }

    verCelShow = ()=>{
        let random
        do {
            random = parseInt(Math.random()*1000000).toString()
        } while (random<100000);
        console.log(random);
        this.setState({randomCode:random})
        document.getElementById("verCod1").value='';
        document.getElementById("verCod2").value='';
        document.getElementById("verCod3").value='';
        document.getElementById("verCod4").value='';
        document.getElementById("verCod5").value='';
        document.getElementById("verCod6").value='';
        document.getElementById("verCod1").focus()
    }
    
    render () {
        return (
            <div>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader style={{backgroundColor:"#ffc61a"}}>Cellphone Verification</ModalHeader>
                    <ModalBody>
                        <p className="text-center">
                            Verification code has been sent via text message to 
                            <br></br> 
                            <b>{this.props.loginRedux[0].cellphone}</b>
                            <br></br> 
                            <br></br>
                            Verification code :
                        </p>
                        <InputGroup className="code">
                            <Input autoFocus onChange={(e)=>{this.z();this.setState({input1:e.target.value})}} maxLength="1" className="mx-2 pl-4" id="verCod1" type="text"/>
                            <Input onChange={e=>this.setState({input2:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod2" type="text"/>
                            <Input onChange={e=>this.setState({input3:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod3" type="text"/>
                            <Input onChange={e=>this.setState({input4:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod4" type="text"/>
                            <Input onChange={e=>this.setState({input5:e.target.value})} maxLength="1" className="mx-2 pl-4" id="verCod5" type="text"/>
                            <Input onChange={e=>{this.verCel(e.target.value)}} maxLength="1" className="mx-2 pl-4" id="verCod6" type="text"/> 
                        </InputGroup>
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => {this.verCelShow()}}>Resend Verification Code</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loginRedux : state.login.user
    }
}


export default connect(mapStateToProps,{getData})(Modaleditprofile)