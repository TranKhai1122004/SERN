import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RemedyModal.scss';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import { toast } from "react-toastify";
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay-ts';
import { CommonUtils } from '../../../utils';
class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            isLoading: false,
        };
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }
    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }
    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })

        }
    }
    handleSendRemedy = async () => {
        this.setState({ isLoading: true });
        try {
            await this.props.sendRemedy(this.state);
            this.setState({ isLoading: false });
        } catch (e) {
            this.setState({ isLoading: false });
        }
    }
    render() {
        let { isOpenModal, dataModal, closeRemedyModal, sendRemedy } = this.props;


        return (
            <>
                {this.state.isLoading && (
                    <div className="custom-overlay">
                        <div className="spinner"></div>
                        <span><FormattedMessage id="remedyModal.progress.Booking-progress" /></span>
                    </div>
                )}
                <Modal
                    isOpen={isOpenModal} className={"remedy-modal-container"} size='md' centered
                    backdrop={true}
                >
                    <div className='remedy-modal-content'>
                        <div className='remedy-modal-header'>
                            <span className='left'><FormattedMessage id="patient.manage.title" /></span>
                            <span className='right' onClick={closeRemedyModal}>
                                <i className='fas fa-times'></i>
                            </span>
                        </div>

                        <div className='remedy-modal-body'>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.manage.patient-email" /></label>
                                    <input className='form-control' type='email' value={this.state.email}
                                        onChange={(event) => this.handleOnChangeEmail(event)}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="patient.manage.prescription-file" /></label>
                                    <input className='form-control-file' type='file' onChange={(event) => this.handleOnchangeImage(event)} />
                                </div>
                            </div>
                        </div>

                        <div className='remedy-modal-footer'>
                            <button className='btn-remedy-confirm' onClick={() => this.handleSendRemedy()}><FormattedMessage id="patient.manage.send" /></button>
                            <button className='btn-remedy-cancel' onClick={closeRemedyModal}>
                                <FormattedMessage id="booking-modal.title.cancel" />
                            </button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
