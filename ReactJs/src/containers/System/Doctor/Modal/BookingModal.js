import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import ProfileDoctor from '../../../Patient/Doctor/ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from "react-toastify";
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthDay: '',
            doctorId: '',
            selectedGender: '',
            genders: '',
            timeType: '',

            isLoading: false,

        };
    }

    async componentDidMount() {
        this.props.getGenders();

    }
    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (event, id) => {
        let valueInput = event.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        })
    }
    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthDay: date[0]
        })
    }
    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedGender: selectedOption });

    };
    capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    buildTimeBooking = (dataTime) => {
        const { language } = this.props;
        if (!dataTime || _.isEmpty(dataTime)) return <></>;

        const dateMoment = moment.unix(+dataTime.date / 1000);
        const now = moment();
        let prefix = '';
        let date = '';
        let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

        if (dateMoment.isSame(now, 'day')) {
            const ddMMYY = dateMoment.format('DD/MM/YYYY');
            const MMddYY = dateMoment.format('MM/DD/YYYY');
            prefix = language === LANGUAGES.VI ? 'Hôm nay' : 'Today';
            date = language === LANGUAGES.VI ? `${prefix} - ${ddMMYY}` : `${prefix} - ${MMddYY}`;
        } else {
            date = language === LANGUAGES.VI
                ? this.capitalizeFirstLetter(dateMoment.format('dddd - DD/MM/YYYY'))
                : this.capitalizeFirstLetter(dateMoment.locale('en').format('ddd - MM/DD/YYYY'));
        }
        return `${time} - ${date}`

    }
    buildDoctorName = (dataTime) => {
        const { language } = this.props;
        if (!dataTime || _.isEmpty(dataTime)) return <></>;
        let name = language === LANGUAGES.VI ?
            `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}` : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`

        return name;

    }
    handleConfirmBooking = async () => {

        const { fullName, phoneNumber, email, address, reason, birthDay, doctorId, selectedGender, timeType } = this.state;
        const { language } = this.props;


        if (!fullName || !phoneNumber || !email || !address || !reason || !birthDay || !selectedGender) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error(language === LANGUAGES.VI ? "Email không hợp lệ. Vui lòng nhập lại!" : "Invalid email. Please try again!");
            return;
        }
        const phoneRegex = /^(0[0-9]{9})$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error(language === LANGUAGES.VI ? "Số điện thoại không hợp lệ. Vui lòng nhập lại!" : "Invalid phone number. Please try again!");
            return;
        }


        this.setState({ isLoading: true });

        try {
            const timeString = this.buildTimeBooking(this.props.dataTime);
            const doctorName = this.buildDoctorName(this.props.dataTime);
            const date = new Date(birthDay).getTime();

            const res = await postPatientBookAppointment({
                fullName,
                phoneNumber,
                email,
                address,
                reason,
                date: this.props.dataTime.date,
                doctorId,
                selectedGender: selectedGender.value,
                timeType,
                language,
                timeString,
                doctorName,
                birthDay: date
            });

            if (res && res.errCode === 0) {
                toast.success(language === LANGUAGES.VI ? "Đặt lịch thành công!" : "Booking a new appointment succeed!");
                this.props.closeBookingModal();
                this.resetData();
            } else {
                toast.error(language === LANGUAGES.VI ? "Đặt lịch không thành công!" : "Booking a new appointment error!");
            }
        } catch (e) {
            console.error("Booking error:", e);
            toast.error("Có lỗi xảy ra!");
        } finally {
            this.setState({ isLoading: false });
        }
    };



    resetData = () => {
        this.setState({
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthDay: '',
            doctorId: '',
            selectedGender: '',
            genders: this.buildDataGender(this.props.genders),
            timeType: ''
        });
    }
    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }

        return (
            <>
                {/* Overlay hiển thị khi isLoading = true */}
                {this.state.isLoading && (
                    <div className="custom-overlay">
                        <div className="spinner"></div>
                        <span><FormattedMessage id="booking-modal.progress.Booking-progress" /></span>
                    </div>
                )}
                <Modal
                    isOpen={isOpenModal} className={"booking-modal-container"} size='lg' centered
                    backdrop={true}
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'><FormattedMessage id="booking-modal.title.Booking-information" /></span>
                            <span className='right'
                                onClick={() => { closeBookingModal(); this.resetData(); }}>
                                <i className='fas fa-times'></i></span>
                        </div>
                        <div className='booking-modal-body'>
                            <div className='doctor-infor'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="booking-modal.title.fullName" /></label>
                                    <input
                                        className='form-control'
                                        value={this.state.fullName}
                                        onChange={(event) => this.handleOnChangeInput(event, 'fullName')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="booking-modal.title.phoneNumber" /></label>
                                    <input
                                        className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(event) => this.handleOnChangeInput(event, 'phoneNumber')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="booking-modal.title.emailAddress" /></label>
                                    <input
                                        className='form-control'
                                        value={this.state.email}
                                        onChange={(event) => this.handleOnChangeInput(event, 'email')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="booking-modal.title.contactAddress" /></label>
                                    <input
                                        className='form-control'
                                        value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    />
                                </div>
                                <div className='col-12 form-group'>
                                    <label><FormattedMessage id="booking-modal.title.reason" /></label>
                                    <input
                                        className='form-control'
                                        value={this.state.reason}
                                        onChange={(event) => this.handleOnChangeInput(event, 'reason')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="booking-modal.title.birthDay" /></label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className="datepicker form-control"
                                        value={this.state.birthDay}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label><FormattedMessage id="booking-modal.title.gender" /></label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-confirm' onClick={() => this.handleConfirmBooking()}><FormattedMessage id="booking-modal.title.confirm" /></button>
                            <button className='btn-booking-cancel'
                                onClick={() => { closeBookingModal(); this.resetData(); }}
                            >
                                <FormattedMessage id="booking-modal.title.cancel" /></button>
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
        getGenders: () => dispatch(actions.FetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
