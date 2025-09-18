import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


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

        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Bệnh viện tiêu biểu trong việc khám chữa bệnh
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px"
                            src="https://www.youtube.com/embed/SdtsDPPXcwI"
                            title="PHIM GIỚI THIỆU VỀ BỆNH VIỆN QUÂN Y 175"
                            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className='content-right'>
                        <p>
                            Ra đời tháng 5 năm 1975, Bệnh viện Quân y 175 là đơn vị tuyến cuối phía Nam của Quân đội, bên cạnh chức năng là Trung tâm nghiên cứu y học quân sự, cơ sở đào tạo sau đại học của Bộ Quốc phòng, Bệnh viện Quân y 175 còn là bệnh viện đa khoa, chuyên khoa sâu tuyến cuối chăm sóc sức khỏe cho quân đội và nhân dân
                            Điểm nhấn hiện nay là Viện Chấn thương chỉnh hình, là cơ sở hoàn chỉnh có năng lực chuyên môn kỹ thuật cao, đáp ứng nhu cầu điều trị chấn thương trong khu vực. Viện là đơn vị duy nhất hiện nay tại Việt Nam có sân đáp trực thăng, đây sẽ trở thành trung tâm cấp cứu đa năng với các loại hình đường sông, đường bộ, đường thủy, đường hàng không đáp ứng khả năng cấp cứu trong mọi tình hướng, đặc biệt là y tế biển đảo; đồng thời là trung tâm huấn luyện, đào tạo, chuyển giao công nghệ, nghiên cứu khoa học, hợp tác quốc tế.
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
