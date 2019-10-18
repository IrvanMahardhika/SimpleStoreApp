import React,{Component} from "react";
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {connect} from "react-redux";
import {sendVerifyEmail} from "../action/index"


class Modalhome extends Component {

    constructor(props) {
        super(props);
        this.state = {
          modal: true
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
    }

    resendClick = ()=>{
        this.props.sendVerifyEmail(this.props.loginRedux[0])
    }
    
    render () {
        return (
            <div>
                <Modal isOpen={this.state.modal}>
                    <ModalHeader style={{backgroundColor:"#ffc61a"}}>E-mail Verification</ModalHeader>
                    <ModalBody>
                        <p className="text-justify">Your e-mail has not been verified. Please verify your e-mail, by clicking the link we have sent.
                        Verified e-mail is required to recover your password, in case you forget it.
                        <br></br>
                        <br></br>
                        If you have not received the link, please click the button below to resend the link to your e-mail.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <span>
                            <a onClick={this.toggle} id="pointlink" >
                                I already received the link
                            </a>
                        </span>&nbsp;&nbsp;&nbsp;
                        <Button color="secondary" onClick={()=>{this.toggle();this.resendClick()}}>Resend Verification Link</Button>
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


export default connect(mapStateToProps,{sendVerifyEmail})(Modalhome)