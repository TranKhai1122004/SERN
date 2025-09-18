import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import moment from 'moment';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {}

        };
    }

    async componentDidMount() {
        this.getDataPatient();
    }
    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();
        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient();
        })
    }
    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })

    }
    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }
    sendRemedy = async (dataChild) => {
        let { dataModal, currentDate } = this.state;
        let { user } = this.props;
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        });
        if (res && res.errCode === 0) {
            toast.success('Send Remedy succeeds');
            await this.getDataPatient();
        }
        else {
            toast.error('Something wrongs...')
            console.log('Error send remedy: ', res);
        }
        this.closeRemedyModal();
    }
    render() {
        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;

        console.log("Khaiii: ", this.state);

        return (
            <>
                <div className="background-image-layer">
                    <div className="overlay"></div>
                </div>
                <div className='manage-patient-container'>
                    <div className='m-p-title'>
                        <FormattedMessage id="menu.doctor.manage-patient" />
                    </div>
                    <div className='m-p-body'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="menu.doctor.choose-date" /></label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className="form-control"
                                        value={this.state.currentDate}

                                    />
                                </div>
                                <div className='col-12 table-manage-patient'>
                                    <table style={{ width: '100%' }} >
                                        <tbody>
                                            <tr>
                                                <th><FormattedMessage id="patient.manage.no" /></th>
                                                <th><FormattedMessage id="patient.manage.time" /></th>
                                                <th><FormattedMessage id="patient.manage.fullName" /></th>
                                                <th><FormattedMessage id="patient.manage.address" /></th>
                                                <th><FormattedMessage id="patient.manage.sex" /></th>
                                                <th><FormattedMessage id="patient.manage.action" /></th>
                                            </tr>
                                            {dataPatient && dataPatient.length > 0 ?
                                                dataPatient.map((item, index) => {

                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn}</td>
                                                            <td>{item.patientData.firstName}</td>
                                                            <td>{item.patientData.address}</td>
                                                            <td>{language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn}</td>
                                                            <td>
                                                                <button onClick={() => this.handleBtnConfirm(item)}><FormattedMessage id="patient.manage.confirm" /></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                                :

                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center' }}><FormattedMessage id="patient.manage.noData" /></td>
                                                </tr>
                                            }

                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
            </>

        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
