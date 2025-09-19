import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HandBook.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllHandBook } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div>
            className={className}
            style={{ ...style, display: "block", background: "red" }}
            onClick={onClick}
        </div>
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div>
            className={className}
            style={{ ...style, display: "block", background: "green" }}
            onClick={onClick}
        </div>
    );
}
class HandBook extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataHandBook: []
        }
    }
    async componentDidMount() {
        let res = await getAllHandBook();

        if (res && res.errCode === 0) {
            this.setState({
                dataHandBook: res.data ? res.data : []
            })
        }
    }
    handleViewDetailHandBook = (item) => {
        this.props.history.push(`/detail-handbook/${item.id}`);
    }
    render() {
        let { dataHandBook } = this.state;
        let { language } = this.props
        return (
            <div className='section-share section-handbook'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id="handBook.handbook" /></span>
                        <button className='btn-section' onClick={() => this.props.history.push('/remote-examination')}><FormattedMessage id="handBook.RemoteExamination" /></button>
                    </div>
                    <div className='section-body'>
                        <div className='slick-slider'>
                            <Slider {...this.props.settings}>
                                {dataHandBook && dataHandBook.length > 0 &&
                                    dataHandBook.map((item, index) => {
                                        return (
                                            <div
                                                className='section-customize' key={index}
                                                onClick={() => this.handleViewDetailHandBook(item)}
                                            >
                                                <div className='bg-image section-handbook'
                                                    style={{ backgroundImage: `url(${item.image})` }} />
                                                <div className='text-handbook text-center'>{item.name}</div>
                                            </div>
                                        )
                                    })}
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
        lang: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HandBook));
