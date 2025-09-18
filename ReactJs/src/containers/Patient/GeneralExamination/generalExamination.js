import React, { Component } from 'react';
import { connect } from "react-redux";
import { getAllSpecialty } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import './generalExamination.scss';
import { withRouter } from 'react-router-dom';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';

class generalExamination extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],   // danh sách tất cả chuyên khoa
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data
            });
        }
    }

    // click vào chuyên khoa -> đi đến trang detail
    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecialty } = this.state;
        let {language} = this.props
        console.log(this.state)
        return (
            <div className="examination-container">
                <HomeHeader />
                <div className='content-up'>
                    <div className='text'>
                        <div><FormattedMessage id="generalExamination.general_Examination" /></div>
                    </div>
                </div>

                <div className='examination-down'>
                    <div className='examination-down-body'>
                        {dataSpecialty && dataSpecialty.length > 0 ? (
                            dataSpecialty.map((item, index) => {
                                if (index === 9) return null;
                                return (
                                    
                                    <div
                                        className='each-examination'
                                        key={index}
                                        onClick={() => this.handleViewDetailSpecialty(item)}
                                    >
                                        <div className='dt-content-left'>
                                            <div
                                                className='content-specialty-up'
                                                style={{
                                                    backgroundImage: `url(${item.image || ''})`
                                                }}
                                            >
                                            </div>
                                        </div>
                                        <div className='dt-content-right'>
                                            <h3>{language === LANGUAGES.VI ? item.nameVi : item.nameEn}</h3>
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: item.description || ''
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div>Không có dữ liệu chuyên khoa</div>
                        )}
                    </div>
                </div>

                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default withRouter(connect(mapStateToProps)(generalExamination));
