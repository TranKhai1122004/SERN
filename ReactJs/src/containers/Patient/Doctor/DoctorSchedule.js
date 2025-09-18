import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleByDate } from '../../../services/userService'
import { every } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { all } from 'axios';
import BookingModal from '../../System/Doctor/Modal/BookingModal';
class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvalableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        }
    }


    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getArrDays(language);
        if (allDays && allDays.length > 0) {
            this.setState({
                allDays: allDays,
            })
        }
        if(this.props.doctorIdFromParent){
            let res = await getScheduleByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvalableTime: res.data ? res.data : []
            })
        }
    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language)
            this.setState({
                allDays: allDays
            })
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language)
            let res = await getScheduleByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvalableTime: res.data ? res.data : []
            })
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    getArrDays = (language) => {
        let allDays = []
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = ` Hôm nay - ${ddMM}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi);
                }

            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = ` Today - ${ddMM}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }

            }

            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }

        return allDays;

    }

    handleOnChangeSelect = async (event) => {

        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value
            let res = await getScheduleByDate(doctorId, date);
            let allTime = [];
            if (res && res.errCode === 0) {
                allTime = res.data
                this.setState({
                    allAvalableTime: res.data ? res.data : []
                })
            }
            console.log("trkhai: ", res)
        }
    }
    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
        console.log("Khai check time: ", time)
    }
    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }
    render() {
        let { allDays, allAvalableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(event) => { this.handleOnChangeSelect(event) }}>
                            {allDays && allDays.length > 0 &&
                                allDays.map((item, index) => {
                                    return (
                                        <option value={item.value} key={index}>{item.label}</option>
                                    )
                                })}
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className='fas fa-calendar-alt'></i>
                            <FormattedMessage id="manage-schedule.medical-appointment" />
                        </div>
                        <div className='time-content'>
                            {allAvalableTime && allAvalableTime.length > 0 ?
                                allAvalableTime.map((item, index) => {
                                    let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                    return (
                                        <button key={index}
                                            onClick={() => this.handleClickScheduleTime(item)}
                                        >
                                            {timeDisplay}</button>
                                    )
                                })
                                : <div className='no-schedule'><FormattedMessage id="manage-schedule.text-response" /></div>

                            }
                        </div>
                        {allAvalableTime && allAvalableTime.length > 0 && (
                            <div className="booking-note">
                                <FormattedMessage id="manage-schedule.choose" /><i className="far fa-hand-point-up"></i> <FormattedMessage id="manage-schedule.book" />
                            </div>
                        )}


                    </div>
                </div>

                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataTime = {dataScheduleTimeModal}
                />
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
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
