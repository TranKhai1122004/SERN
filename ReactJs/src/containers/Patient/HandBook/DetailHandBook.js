import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDetailHandBookById } from '../../../services/userService';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import './DetailHandBook.scss';
class DetailHandBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailHandBook: {}
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getDetailHandBookById(id);
            if (res && res.errCode === 0) {
                this.setState({
                    detailHandBook: res.data
                })
            }
            
        }
    }

    render() {
        let { detailHandBook } = this.state;

        
        return (
            <>

                <HomeHeader />
                <div className="detail-handbook-container">
                    <div className='content-up'>
                        <div className='text'>
                            <div>{detailHandBook.name}</div>
                        </div>
                    </div>
                    <div className="handbook-banner">
                        <img src={detailHandBook.image} className="handbook-image" />
                    </div>
                    <div className='detail-handbook-down'>

                        <div className="detail-handbook-content">
                            <div dangerouslySetInnerHTML={{ __html: detailHandBook.contentHTML }} />
                        </div>
                    </div>
                </div>
                <HomeFooter />

            </>

        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(DetailHandBook);
