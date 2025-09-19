import React, { Component } from 'react';
import { connect } from 'react-redux';
import './MedicalFacility.scss';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import { getAllClinic } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';
class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: []
        }
    }
    async componentDidMount() {
        let res = await getAllClinic();
        if (res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : []
            })
        }

    }
    handleViewDetailClinic = (clinic) => {
        this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
    render() {
        let { dataClinics } = this.state;
        let { language } = this.props;
        return (
            <div>
                <div className='section-share section-medical-facility'>
                    <div className='section-container'>
                        <div className='section-header'>
                            <span className='title-section'><FormattedMessage id="medical.medical-facility" /></span>
                            <button className='btn-section' onClick={() => this.props.history.push('/remote-examination')}><FormattedMessage id="specialty.more-infor" /></button>
                        </div>
                        <div className='section-body'>
                            <Slider {...this.props.settings}>
                                {dataClinics && dataClinics.length > 0 &&
                                    dataClinics.map((item, index) => {
                                        return (
                                            <div className='section-customize'
                                                onClick={() => this.handleViewDetailClinic(item)}
                                                key={index}>
                                                <div className='bg-image section-medical-facility'
                                                    style={{ backgroundImage: `url(${item.image})` }}
                                                />
                                                <div className='text-center clinic-name'>{language === LANGUAGES.VI ? item.nameVi : item.nameEn}</div>
                                            </div>
                                        )
                                    })
                                }

                            </Slider>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
