import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import '../HomePage/Section/HomeFooter.scss';
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
class HomeFooter extends Component {

    render() {

        return (
            <div className='home-footer-container'>
                <div className='home-footer-body'>
                    <p>&copy; <FormattedMessage id="homepage.footer" />
                        <a target='blank' href='https://github.com/TranKhai1122004'>
                            &#8594;  Click here &#8592;</a> </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
