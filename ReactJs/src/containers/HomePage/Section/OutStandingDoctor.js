import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { Buffer } from 'buffer';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { getAllSpecialty } from '../../../services/userService';
class OutStandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: [],


        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }

    }
    componentDidMount() {
        this.props.loadTopDoctors();

    }

    handleViewDetailDoctor = (doctor) => {

        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }
    render() {
        let arrDoctors = this.state.arrDoctors;
        let { language } = this.props;
        let specialtyList = [
            "Cột sống",
            "Cơ xương khớp",
            "Phẫu thuật Tạo hình - Thẩm mỹ",
            "Y học cổ truyền",
            "Cơ xương khớp",
            "Tai Mũi Họng",
            "Tai Mũi Họng",
            "Tiêu Hóa",
            "Thần Kinh"
        ];

        return (
            <div>
                <div className='section-share section-outstanding-doctor'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'><FormattedMessage id="homepage.outstanding-doctor" /></span>
                            <button className='btn-section' onClick={() => this.props.history.push('/remote-examination')}><FormattedMessage id="homepage.more-info" /></button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>

                                {arrDoctors && arrDoctors.length > 0 && arrDoctors.map((item, index) => {
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                                    }
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `;
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                                    let specialtyName = specialtyList[index % specialtyList.length];
                                    if (index === 0 || index === 1 || index === 2) return null;
                                    return (
                                        <div className='section-customize' key={index}
                                            onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className='bg-image section-outstanding-doctor'
                                                style={{ backgroundImage: `url(${imageBase64})` }}
                                            />
                                            <div className='position text-center'>
                                                <div className='bg-child'>
                                                    <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                                                </div>
                                                <div>
                                                    <div className='text'>{specialtyName}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                                }
                            </Slider>
                        </div>

                    </div>
                </div >
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
