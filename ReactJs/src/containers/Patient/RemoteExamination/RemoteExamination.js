import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './RemoteExamination.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
class RemoteExamination extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }


    render() {

        return (
            <div className="remote-examination-container">
                <HomeHeader />
                <div className='remote-examination-body'>
                    <div className='remote-examination-content'>
                        <div className='text'><FormattedMessage id = "remote.text"/></div>
                        
                    </div>
                </div>
                <HomeFooter/>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemoteExamination);
