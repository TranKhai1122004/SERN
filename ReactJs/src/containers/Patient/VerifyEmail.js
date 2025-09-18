import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import "./VerifyEmail.scss"
import { postVerifyBookAppointment } from '../../services/userService';
import HomeHeader from '../HomePage/HomeHeader';
import { LANGUAGES } from '../../utils';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import HomeFooter from '../HomePage/HomeFooter';
class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0
        };
    }

    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            console.log("Check: ", token, doctorId);
            let res = await postVerifyBookAppointment({
                token: token,
                doctorId: doctorId
            })
            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }


    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }


    render() {
        let { statusVerify, errCode } = this.state;

        return (
            <>
                <HomeHeader />
                {statusVerify === false ? (
                    <div className='verify-email-container'>
                        <div className='verify-email-body'>
                            <span className='text'>
                                <FormattedMessage id="verify.text.loading" />
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className='verify-email-container'>
                        <div className='verify-email-body'>
                            {errCode === 0 ? (
                                <span className='text'>
                                    <FormattedMessage id="verify.text.success1" /><br />
                                    <FormattedMessage id="verify.text.success2" />
                                </span>
                            ) : (
                                <span className='text'>
                                    <FormattedMessage id="verify.text.failed" />
                                </span>
                            )}
                        </div>
                    </div>
                )}
                <HomeFooter />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
