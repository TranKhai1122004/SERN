import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailClinic.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailClinicById, getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import { lang } from 'moment';
class DetailClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {},
            image: '',
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailClinicById({
                id: id,
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = []
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorClinic;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }

                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId,

                })
            }

        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    getDataDetailClinic = () => {

    }

    render() {
        let { arrDoctorId, dataDetailClinic } = this.state;
        let { language } = this.props;
        console.log("xem ảnh: ", this.state)
        return (
            <div className='detail-clinic-container'>
                <HomeHeader />
                <div className='detail-clinic-body'>
                    <div
                        className='content-clinic-up'
                        style={{
                            backgroundImage: `url(${dataDetailClinic && dataDetailClinic.image ? dataDetailClinic.image : ''})`
                        }}
                    >
                        <div className='bg-overlay'></div>
                        <div className='description-clinic'>
                            {dataDetailClinic && !_.isEmpty(dataDetailClinic) &&
                                <>
                                    <div className='name-clinic'>{language === LANGUAGES.VI ? dataDetailClinic.nameVi : dataDetailClinic.nameEn}</div>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: language === LANGUAGES.VI
                                                ? dataDetailClinic.contentHTMLVi
                                                : dataDetailClinic.contentHTMLEn
                                        }}>
                                    </div>
                                </>

                            }
                        </div>
                    </div>

                    <div className='content-clinic-down'>
                        <div className='content-clinic-down-header'>

                        </div>
                        <div className='content-clinic-down-body'>
                            
                            {arrDoctorId && arrDoctorId.length > 0
                                &&
                                arrDoctorId.map((item, index) => {
                                    return (
                                        <div className='each-doctor' key={index}>
                                            <div className='dt-content-left'>
                                                <div className='profile-doctor'>
                                                    <ProfileDoctor
                                                        doctorId={item}
                                                        isShowDescriptionDoctor={true}
                                                        isShowLinkDetail={true}
                                                        isShowPrice={false}

                                                    />
                                                </div>
                                            </div>
                                            <div className='dt-content-right'>
                                                <div className='doctor-schedule'>
                                                    <DoctorSchedule
                                                        doctorIdFromParent={item}
                                                    />
                                                </div>
                                                <div className='doctor-extra-infor'>
                                                    <DoctorExtraInfor
                                                        doctorIdFromParent={item}
                                                    />
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>


                </div>


                <HomeFooter />
            </div >

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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
