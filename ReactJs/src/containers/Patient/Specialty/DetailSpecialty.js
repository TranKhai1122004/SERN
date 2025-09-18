import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailSpecialty.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import DoctorSchedule from '../Doctor/DoctorSchedule';
import DoctorExtraInfor from '../Doctor/DoctorExtraInfor';
import ProfileDoctor from '../Doctor/ProfileDoctor';
import { getDetailSpecialtyById, getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import _ from 'lodash';
import { lang } from 'moment';
class DetailSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            image: '',
        };
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;

            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });
            let resProvince = await getAllCodeService('PROVINCE')
            if (res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = []
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }

                }
                let dataProvince = resProvince.data;
                let result = [];
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueEn: "ALL",
                        valueVi: "Toàn quốc"
                    })
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince ? dataProvince : []
                })
            }

        }

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }
    getDataDetailSpecialty = () => {

    }
    handleOnChangeSelect = async (event) => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            let res = await getDetailSpecialtyById({
                id: id,
                location: location
            });

            if (res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = []
                if (data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if (arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }

                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,

                })
            }
        }
    }
    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state;
        let { language } = this.props;
        
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div
                        className='content-specialty-up'
                        style={{
                            backgroundImage: `url(${dataDetailSpecialty && dataDetailSpecialty.image ? dataDetailSpecialty.image : ''})`
                        }}
                    >
                        <div className='bg-overlay'></div>
                        <div className='description-specialty'>
                            {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: language === LANGUAGES.VI
                                            ? dataDetailSpecialty.contentHTMLVi
                                            : dataDetailSpecialty.contentHTMLEn
                                    }}>
                                </div>
                            }
                        </div>
                    </div>

                    <div className='content-specialty-down'>
                        <div className='content-specialty-down-header'>
                            <div className='search-sp-doctor'>
                                <select onChange={(event) => this.handleOnChangeSelect(event)}>
                                    {listProvince && listProvince.length > 0 &&
                                        listProvince.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                        </div>
                        <div className='content-specialty-down-body'>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
