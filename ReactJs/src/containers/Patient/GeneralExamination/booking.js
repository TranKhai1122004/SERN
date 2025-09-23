import React, { Component } from 'react';
import { connect } from "react-redux";
import _ from 'lodash';
import "./booking.scss"
import { getAllDoctors, getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';

class booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            listProvince: [],
        };
    }

    async componentDidMount() {
        await this.fetchDoctorsAndProvinces();
    }

    fetchDoctorsAndProvinces = async (location = 'ALL') => {
        // Lấy tất cả bác sĩ
        const resDoctors = await getAllDoctors(); // API lấy tất cả bác sĩ, filter theo location nếu muốn

        // Lấy danh sách province
        const resProvince = await getAllCodeService('PROVINCE');

        let arrDoctorId = [];
        if (resDoctors && resDoctors.errCode === 0) {
            arrDoctorId = resDoctors.data.map(item => item.id);
        }

        let listProvince = [];
        if (resProvince && resProvince.errCode === 0) {
            listProvince = [{ keyMap: "ALL", valueEn: "ALL", valueVi: "Toàn quốc" }, ...resProvince.data];
        }

        this.setState({ arrDoctorId, listProvince });
    }

    handleOnChangeSelect = async (event) => {
        const location = event.target.value;
        await this.fetchDoctorsAndProvinces(location);
    }

    render() {
        const { arrDoctorId, listProvince } = this.state;
        const { language } = this.props;

        return (
            <div className='doctor-container'>
                <HomeHeader />
                <div className='doctor-body'>
                    

                    {/* Hiển thị danh sách doctor */}
                    <div className='content-doctor-down-body'>
                        {arrDoctorId.map((doctorId) => (
                            <div className='each-doctor' key={doctorId}>
                                <div className='dt-content-left'>
                                    <ProfileDoctor
                                        doctorId={doctorId}
                                        isShowDescriptionDoctor={true}
                                        isShowLinkDetail={true}
                                        isShowPrice={false}
                                    />
                                </div>
                                <div className='dt-content-right'>
                                    <div className='doctor-schedule'>
                                        <DoctorSchedule doctorIdFromParent={doctorId} />
                                    </div>
                                    <div className='doctor-extra-infor'>
                                        <DoctorExtraInfor doctorIdFromParent={doctorId} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.app.language
});

export default connect(mapStateToProps)(booking);
