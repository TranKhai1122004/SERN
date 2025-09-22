import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './ManageDoctor.scss';

import * as actions from "../../../store/actions";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { every, has } from 'lodash';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetaiInforDoctor } from '../../../services/userService';
import { useIntl } from 'react-intl';
import TurndownService from 'turndown';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {

            //save to Markdown table
            contentHTML: '',
            contentMarkdown: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            editorKey: Date.now(),
            hasOldData: false,
            contentHTMLEn: '',
            descriptionEn: '',
            contentMarkdownEn: '',

            //save to doctor_infor table
            listPrice: [],
            listProvince: [],
            listPayment: [],
            listClinic: [],
            listSpecialty: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',

        }
    }
    componentDidMount() {
        this.props.fetchAllDoctor();
        this.props.getAllRequiredDoctorInfor()
    }
    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            if (type === 'USERS') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`
                    let labelEn = `${item.lastName} ${item.firstName}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
            }
            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn} USD`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === 'PAYMENT' || type === "PROVINCE") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
            }
            if (type === "SPECIALTY") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.nameVi}`
                    let labelEn = `${item.nameEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
            }
            if (type === "CLINIC") {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.nameVi}`
                    let labelEn = `${item.nameEn}`
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
            }

        }
        return result;

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS')
            this.setState({
                listDoctors: dataSelect,
                selectedDoctor: '',
                description: '',
                contentHTML: '',
                contentMarkdown: '',
                editorKey: Date.now(),
                selectedPrice: null,
                selectedPayment: null,
                selectedProvince: null,
                selectedClinic: null,
                selectedSpecialty: null,
                nameClinic: '',
                addressClinic: '',
                note: '',
                selectedClinic: null,
            })
        }

        if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPrice, resPayment, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
            let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, "SPECIALTY");
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');

            this.setState({
                listPrice: dataSelectPrice,
                listProvince: dataSelectProvince,
                listPayment: dataSelectPayment,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic

            })
        }
        if (prevProps.language !== this.props.language) {
            let { resPrice, resPayment, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
            let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listProvince: dataSelectProvince,
                listPayment: dataSelectPayment,

            })
        }

    }
    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        })
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData, selectedDoctor, selectedPrice, selectedPayment, selectedProvince } = this.state;

        if (!selectedDoctor) {
            alert("Vui lòng chọn bác sĩ trước khi lưu!");
            return;
        }
        this.props.saveDetailDoctors({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            contentHTMLEn: this.state.contentHTMLEn,
            descriptionEn: this.state.descriptionEn,
            doctorId: selectedDoctor ? selectedDoctor.value : null,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
            selectedPrice: selectedPrice ? selectedPrice.value : null,
            selectedPayment: selectedPayment ? selectedPayment.value : null,
            selectedProvince: selectedProvince ? selectedProvince.value : null,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty.value
        });
    }


    // show UI dropdown
    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
        let res = await getDetaiInforDoctor(selectedDoctor.value);
        if (res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let doctor = res.data.Doctor_Infor;
            
            const turndownService = new TurndownService();
            let selectedPrice = doctor ? this.state.listPrice.find(item => item.value === doctor.priceId) : null;
            let selectedPayment = doctor ? this.state.listPayment.find(item => item.value === doctor.paymentId) : null;
            let selectedProvince = doctor ? this.state.listProvince.find(item => item.value === doctor.provinceId) : null;
            let selectedSpecialty = doctor ? this.state.listSpecialty.find(item => item.value === doctor.specialtyId) : null;
            let selectedClinic = doctor ? this.state.listClinic.find(item => item.value === doctor.clinicId) : null;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                contentHTMLEn: markdown.contentHTMLEn,
                contentMarkdownEn: markdown.contentHTMLEn
                    ? turndownService.turndown(markdown.contentHTMLEn)
                    : '',
                descriptionEn: markdown.descriptionEn,
                hasOldData: true,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                nameClinic: doctor ? doctor.nameClinic : '',
                addressClinic: doctor ? doctor.addressClinic : '',
                selectedClinic: selectedClinic,
                note: doctor ? doctor.note : '',
            })
        }
        else {

            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,

            })
        }
    };

    handleChangeSelectDoctorInfor = async (selectedDoctor, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state };
        stateCopy[stateName] = selectedDoctor
        this.setState({
            ...stateCopy
        })
    }
    handleOnChangeText = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    handleClearForm = () => {
        this.setState({
            contentHTML: '',
            contentMarkdown: '',
            contentHTMLEn: '',
            contentMarkdownEn: '',
            description: '',
            descriptionEn: '',
            selectedDoctor: null,
            selectedPrice: null,
            selectedPayment: null,
            selectedProvince: null,
            selectedClinic: null,
            selectedSpecialty: null,
            nameClinic: '',
            addressClinic: '',
            note: '',
            hasOldData: false,
            editorKey: Date.now(),

        });
    }

    render() {
        let { hasOldData, listSpecialty } = this.state

        return (
            <>
                <div className="background-image-layer">
                    <div className="overlay"></div>
                </div>
                <div className='manage-doctor-container'>

                    <div className='manage-doctor-title'><FormattedMessage id="admin.manage-doctor.title" /></div>

                    <div className='manage-doctor-body'>
                        <div className='container'>
                            <div className='more-info'>
                                <div className='content-left form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.select-doctor" /></label>
                                    <Select
                                        value={this.state.selectedDoctor}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.listDoctors}
                                        placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
                                    />
                                </div>
                                <div className='content-right' >
                                    <label><FormattedMessage id="admin.manage-doctor.intro" /></label>
                                    <textarea
                                        className='form-control' rows='4'
                                        onChange={(event) => {
                                            this.props.language === LANGUAGES.VI
                                                ? this.setState({ description: event.target.value })
                                                : this.setState({ descriptionEn: event.target.value })
                                        }}
                                        value={this.props.language === LANGUAGES.VI
                                            ? this.state.description
                                            : this.state.descriptionEn}>
                                    </textarea>
                                </div>
                            </div>
                            <div className='more-infor-extra row' >
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.price" /></label>
                                    <Select
                                        value={this.state.selectedPrice}
                                        onChange={this.handleChangeSelectDoctorInfor}
                                        options={this.state.listPrice}
                                        placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
                                        name="selectedPrice"
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.payment" /></label>
                                    <Select
                                        value={this.state.selectedPayment}
                                        onChange={this.handleChangeSelectDoctorInfor}
                                        options={this.state.listPayment}
                                        placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
                                        name="selectedPayment"
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.province" /></label>
                                    <Select
                                        value={this.state.selectedProvince}
                                        onChange={this.handleChangeSelectDoctorInfor}
                                        options={this.state.listProvince}
                                        placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
                                        name="selectedProvince"
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.nameClinic" /></label>
                                    <input className='form-control'
                                        onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
                                        value={this.state.nameClinic}
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.addressClinic" /></label>
                                    <input className='form-control'
                                        onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
                                        value={this.state.addressClinic}
                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.note" /></label>
                                    <input className='form-control'
                                        onChange={(event) => this.handleOnChangeText(event, 'note')}
                                        value={this.state.note}
                                    />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.select-speciality" /></label>
                                    <Select
                                        value={this.state.selectedSpecialty}
                                        onChange={this.handleChangeSelectDoctorInfor}
                                        options={this.state.listSpecialty}
                                        placeholder={<FormattedMessage id="admin.manage-doctor.select-speciality" />}
                                        name="selectedSpecialty"


                                    />
                                </div>
                                <div className='col-4 form-group'>
                                    <label><FormattedMessage id="admin.manage-doctor.select-clinic" /></label>
                                    <Select
                                        value={this.state.selectedClinic}
                                        onChange={this.handleChangeSelectDoctorInfor}
                                        options={this.state.listClinic}
                                        placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
                                        name="selectedClinic"
                                    />
                                </div>
                            </div>
                            <div className='manage-doctor-editor'>
                                {this.props.language === LANGUAGES.VI ? (
                                    <MdEditor
                                        value={this.state.contentMarkdown}
                                        style={{ height: '550px', marginTop: '10px' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={({ html, text }) =>
                                            this.setState({ contentHTML: html, contentMarkdown: text })
                                        }
                                    />
                                ) : (
                                    <MdEditor
                                        value={this.state.contentMarkdownEn}
                                        style={{ height: '550px', marginTop: '10px' }}
                                        renderHTML={text => mdParser.render(text)}
                                        onChange={({ html, text }) =>
                                            this.setState({ contentHTMLEn: html, contentMarkdownEn: text })
                                        }
                                    />
                                )}
                            </div>

                            <button
                                onClick={() => this.handleSaveContentMarkdown()}
                                className={hasOldData === true ? 'save-content-doctor' : "create-content-doctor"}
                            >
                                {hasOldData === true ? <span><FormattedMessage id="admin.manage-doctor.save" /></span> : <span><FormattedMessage id="admin.manage-doctor.create-infor" /></span>}
                            </button>
                            <button
                                onClick={this.handleClearForm}
                                className="clear-content-doctor"
                            >
                                <FormattedMessage id="admin.manage-doctor.clear" defaultMessage="Clear" />
                            </button>
                        </div>
                    </div>
                </div>

            </>

        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
        getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        saveDetailDoctors: (data) => dispatch(actions.saveDetailDoctors(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
