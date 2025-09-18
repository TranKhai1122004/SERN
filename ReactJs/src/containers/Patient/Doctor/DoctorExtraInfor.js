import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { LANGUAGES } from '../../../utils';
import { getExtraInforDoctorById } from '../../../services/userService';
import NumberFormat from 'react-number-format';
import { FormattedMessage } from 'react-intl';
class DoctorExtraInfor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: false,
            isShowDetailInfor2: false,
            isShowDetailInfor3: false,
            extraInfor: {}
        };
    }

    async componentDidMount() {
        if (this.props.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfor: res.data
                })
            }
        }
    }
    showHideDetailInfor = (status) => {
        this.setState({ isShowDetailInfor: status });
    }

    showHideDetailInfor2 = (status) => {
        this.setState({ isShowDetailInfor2: status });
    }

    showHideDetailInfor3 = (status) => {
        this.setState({ isShowDetailInfor3: status });
    }

    render() {
        const { isShowDetailInfor, isShowDetailInfor2, isShowDetailInfor3, extraInfor } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className='doctor-extra-infor-container'>
                    <div className='doctor-extra-infor-body'>
                        {/* Địa chỉ khám */}
                        <div className='content-up'>
                            <div className='text-address'><FormattedMessage id="patient.extra-infor-doctor.text-address" /></div>
                            <div className='name-clinic'>
                                {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                            </div>
                            <div className='detail-address'>{extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}</div>
                        </div>

                        {/* Giá khám */}
                        <div className='content-mid'>
                            {isShowDetailInfor ? (
                                <>
                                    <div className='title-price'><FormattedMessage id="patient.extra-infor-doctor.title-price" /></div>
                                    <div className='detail-infor'>
                                        <div className='price'>
                                            <span className='left'><FormattedMessage id="patient.extra-infor-doctor.title-price" /></span>
                                            <div className='right'>
                                                {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI &&
                                                    <NumberFormat className="currency" value={extraInfor.priceTypeData.valueVi} displayType={'text'} thousandSeparator={true} suffix={"đ"} />
                                                }
                                                {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN &&
                                                    <NumberFormat className="currency" value={extraInfor.priceTypeData.valueEn} displayType={'text'} thousandSeparator={true} suffix={"$"} />
                                                }
                                            </div>
                                        </div>
                                        <div className='note'>
                                            <FormattedMessage id="patient.extra-infor-doctor.note" />

                                        </div>
                                    </div>
                                    <div className='payment'>
                                        <FormattedMessage id="patient.extra-infor-doctor.payment" />
                                        <span className="payment-method">
                                            {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.VI ? extraInfor.paymentTypeData.valueVi : ''}
                                            {extraInfor && extraInfor.paymentTypeData && language === LANGUAGES.EN ? extraInfor.paymentTypeData.valueEn : ''}
                                        </span>
                                    </div>
                                    <div className='hide-price'>
                                        <span onClick={() => this.showHideDetailInfor(false)}><FormattedMessage id="patient.extra-infor-doctor.hide-price" /></span>
                                    </div>
                                </>
                            ) : (
                                <div className='short-infor'>
                                    <div className="form-group-row">
                                        <div className='short-infor-title'><FormattedMessage id="patient.extra-infor-doctor.title-price" />:</div>
                                        <div className='short-infor-price'>
                                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.VI &&
                                                <NumberFormat className="currency" value={extraInfor.priceTypeData.valueVi} displayType={'text'} thousandSeparator={true} suffix={"đ"} />
                                            }
                                            {extraInfor && extraInfor.priceTypeData && language === LANGUAGES.EN &&
                                                <NumberFormat className="currency" value={extraInfor.priceTypeData.valueEn} displayType={'text'} thousandSeparator={true} suffix={"$"} />
                                            }
                                        </div>
                                        <span className="detail-span" onClick={() => this.showHideDetailInfor(true)}><FormattedMessage id="patient.extra-infor-doctor.detail-span" /></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bảo hiểm */}
                        <div className='content-down'>
                            {isShowDetailInfor2 ? (
                                <div className='insurance-detail'>
                                    <div className='insurance'><FormattedMessage id="patient.extra-infor-doctor.insurance" /></div>
                                    <div className='insurance-detail-one'>
                                        <div className='ins-child'><FormattedMessage id="patient.extra-infor-doctor.insurance-state-title" /></div>
                                        <div className='ins-child2'>
                                            <FormattedMessage id="patient.extra-infor-doctor.insurance-state-desc" />
                                        </div>
                                    </div>
                                    <div className='insurance-detail-two'>
                                        {isShowDetailInfor3 ? (
                                            <>
                                                <div className='ins-detail-child1'><FormattedMessage id="patient.extra-infor-doctor.insurance-direct-title" /></div>
                                                <div className='ins-detail-child2'>
                                                    <FormattedMessage id="patient.extra-infor-doctor.insurance-direct-desc" />
                                                </div>
                                                <div className='ins-detail-child3'>
                                                    <div className='ins-detail-child-child'>
                                                        <FormattedMessage id="patient.extra-infor-doctor.insurance" />
                                                    </div>
                                                    <ul>
                                                        {Array.from({ length: 26 }, (_, i) => {
                                                            const index = i + 1;
                                                            return (
                                                                <li key={index}>
                                                                    {index}.{" "}
                                                                    <FormattedMessage id={`patient.extra-infor-doctor.insurancee.list.${index}`} />
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                                <span onClick={() => this.showHideDetailInfor3(false)}>
                                                    <FormattedMessage id="patient.extra-infor-doctor.hide" />
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className='ins-detail-child1'><FormattedMessage id="patient.extra-infor-doctor.insurance-direct-title" /></div>
                                                <div className='ins-detail-child2'>
                                                    <FormattedMessage id="patient.extra-infor-doctor.insurance-direct-desc" />
                                                </div>
                                                <span onClick={() => this.showHideDetailInfor3(true)}>
                                                    <FormattedMessage id="patient.extra-infor-doctor.insurance-see-list" />
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className='hide-insurance'>
                                        <span onClick={() => this.showHideDetailInfor2(false)}><FormattedMessage id="patient.extra-infor-doctor.hide" /></span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className='insurance-shorten'>
                                        <div className="form-group-row">
                                            <div className='insurance'><FormattedMessage id="patient.extra-infor-doctor.insurance" /></div>
                                            <span onClick={() => this.showHideDetailInfor2(true)}><FormattedMessage id="patient.extra-infor-doctor.detail-span" /></span>
                                        </div>
                                    </div>


                                </>
                            )}
                        </div>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
