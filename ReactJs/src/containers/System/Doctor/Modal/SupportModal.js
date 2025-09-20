import React, { Component } from 'react';
import { connect } from "react-redux";
import { Modal } from 'reactstrap';
import './SupportModal.scss';
import { FormattedMessage } from 'react-intl';

class SupportModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }

    async componentDidMount() { }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
    }

    render() {
        let { isOpenModalSupport, closeSupportModal } = this.props;

        return (
            <Modal
                isOpen={isOpenModalSupport}
                className="support-modal-container"
                size="md"
                centered
                backdrop={true}
                fade={true}
            >
                <div className="support-modal-content">
                    <div className="support-modal-header">
                        <span className="left"><FormattedMessage id="modal.support"/></span>
                        <span
                            className="right"
                            onClick={() => closeSupportModal()}
                        >
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="support-modal-body">
                        <div className="info-item phone">
                            <i className="fas fa-phone-alt"></i>
                            024-7301-2468
                        </div>
                        <div className="info-item email">
                            <i className="fas fa-envelope"></i>
                            support@bookingcare.vn
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

export default connect(mapStateToProps)(SupportModal);
