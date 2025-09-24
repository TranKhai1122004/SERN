import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';


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
class About extends Component {

    render() {
        const { intl } = this.props;
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    <FormattedMessage id='about.typical' />
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px"
                            src="https://www.youtube.com/embed/SdtsDPPXcwI"
                            title={intl.formatMessage({ id: "about.videoTitle" })}
                            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className='content-right'>
                        <p>
                            <FormattedMessage id="about.text" />
                        </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(About));
