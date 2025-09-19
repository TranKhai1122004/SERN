import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/logo.svg';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from '../../store/actions/appActions';
import { withRouter } from 'react-router';
import Chatbot from '../../components/ChatBot/ChatBot';
import { getAllSpecialty } from '../../services/userService';
import Fuse from 'fuse.js';
import { toast } from 'react-toastify';

class HomeHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            specialties: []
        }
    }
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    }
    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({ specialties: res.data });
        }

    }
    handleSearch = () => {
        if (!this.state.keyword) return;

        const { specialties, keyword } = this.state;


        const options = {
            includeScore: true,
            threshold: 0.3,
            keys: ["nameVi"]
        };

        const fuse = new Fuse(specialties, options);
        const results = fuse.search(keyword);

        if (results.length > 0) {
            let specialtyId = results[0].item.id;
            this.props.history.push(`/detail-specialty/${specialtyId}`);
        } else {
            toast.error("❌ Không tìm thấy chuyên khoa");
        }
        this.setState({ keyword: '' });
    }


    render() {
        let language = this.props.language;
        console.log(this.state.specialties)
        return (
            <React.Fragment>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fas fa-bars"></i>
                            <img className='header-logo' src={logo} onClick={() => this.returnToHome()} />
                        </div>
                        <div className='center-content'>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.speciality" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.searchdoctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.health-facility" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-room" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.doctor" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.select-doctor" /></div>
                            </div>
                            <div className='child-content'>
                                <div><b><FormattedMessage id="homeheader.fee" /></b></div>
                                <div className='subs-title'><FormattedMessage id="homeheader.check-health" /></div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'><i className='fas fa-question-circle'></i><FormattedMessage id="homeheader.support" /></div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={() => { this.changeLanguage(LANGUAGES.VI) }}>VN</span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => { this.changeLanguage(LANGUAGES.EN) }}>EN</span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true &&
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title1'><FormattedMessage id="banner.title1" /></div>
                            <div className='title2'><FormattedMessage id="banner.title2" /></div>
                            <div className='search'>
                                <i
                                    className='fas fa-search'
                                    onClick={this.handleSearch}
                                ></i>
                                <input
                                    type='text'
                                    placeholder={this.props.intl.formatMessage({ id: "homeheader.find-speciality" })}
                                    value={this.state.keyword}
                                    onChange={(e) => this.setState({ keyword: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && this.handleSearch()}
                                />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <button className='options-child'
                                    onClick={() => this.props.history.push('/examination-specialty')}>
                                    <div className='icon-child'><i className='far fa-hospital'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child1" /></div>
                                </button>
                                <div className='options-child' onClick={() => this.props.history.push('/detail-doctor/61')}>
                                    <div className='icon-child'><i className='fas fa-mobile-alt'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child2" /></div>
                                </div>
                                <div className='options-child' onClick={() => this.props.history.push('/examination-general')}>
                                    <div className='icon-child'><i className='fas fa-procedures'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child3" /></div>
                                </div>
                                <div className='options-child' onClick={() => this.props.history.push('/detail-doctor/63')}>
                                    <div className='icon-child'><i className="fas fa-flask"></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child4" /></div>
                                </div>
                                <div className='options-child' onClick={() => this.props.history.push('/detail-doctor/4')}>
                                    <div className='icon-child'><i className='fas fa-user-md'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child5" /></div>
                                </div>
                                <div className='options-child' onClick={() => this.props.history.push('/detail-doctor/62')}>
                                    <div className='icon-child'><i className='fas fa-briefcase-medical'></i></div>
                                    <div className='text-child'><FormattedMessage id="banner.child6" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <Chatbot />
            </React.Fragment>
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomeHeader)));
