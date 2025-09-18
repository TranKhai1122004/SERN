import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { createNewSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nameVi: '',
            nameEn: '',
            imageBase64: '',
            previewImgURL: '',
            contentHTMLEn: '',
            contentMarkdownEn: '',
            contentHTMLVi: '',
            contentMarkdownVi: ''

        };
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    handleEditorChangeVi = ({ html, text }) => {
        this.setState({
            contentMarkdownVi: text,
            contentHTMLVi: html,

        })
    }

    handleEditorChangeEn = ({ html, text }) => {
        this.setState({
            contentMarkdownEn: text,
            contentHTMLEn: html
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                imageBase64: base64,
                previewImgURL: objectUrl
            })
        }
    }
    handleSaveNewSpecialty = async () => {
        let data = { ...this.state };
        let res = await createNewSpecialty(data);

        if (res && res.errCode === 0) {
            toast.success("Add new specialty succeed !");
            this.setState({
                nameVi: '',
                nameEn: '',
                imageBase64: '',
                contentHTMLEn: '',
                contentMarkdownEn: '',
                contentHTMLVi: '',
                contentMarkdownVi: ''
            });
        } else {
            toast.error('Something wrong...');
            console.log('trkhai check error: ', res);
        }

        console.log("khai check state gửi lên: ", data);
    };
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        window.open(this.state.previewImgURL, "_blank");
    }
    render() {

        return (
            <>
                <div className="background-image-layer">
                    <div className="overlay"></div>
                </div>
                <div className='manage-specialty-container'>
                    <div className='manage-specialty-title'><FormattedMessage id="specialty.manage-speciality" /></div>
                    <div className='manage-specialty-body'>
                        <div className='container'>
                            <div className='add-new-speacialty row'>
                                <div className='col-6 form-group'>
                                    <label>Tên chuyên khoa</label>
                                    <input
                                        className='form-control' type='text' value={this.state.nameVi}
                                        onChange={(event) => this.handleOnChangeInput(event, 'nameVi')}
                                    ></input>
                                    <label>Specialty Name</label>
                                    <input
                                        className='form-control' type='text' value={this.state.nameEn}
                                        onChange={(event) => this.handleOnChangeInput(event, 'nameEn')}
                                    ></input>
                                </div>
                                <div className='col 6 form-group'>
                                    <label><FormattedMessage id="specialty.img-speciality" /></label>
                                    <div className="custom-file-upload">
                                        <input
                                            className='choose-file'
                                            id="specialtyImage"
                                            type="file"
                                            onChange={(event) => this.handleOnchangeImage(event)}
                                        />
                                        <div
                                            className='preview-image'
                                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                                            onClick={() => this.openPreviewImage()}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className='manage-specialty-editor'>
                                <div className='markdownVi'>Markdown VI</div>
                                <MdEditor
                                    value={this.state.contentMarkdownVi}
                                    style={{ height: '550px', marginTop: '2px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChangeVi}
                                />
                                <div className="markdownEn">Markdown EN</div>
                                <MdEditor
                                    value={this.state.contentMarkdownEn}
                                    style={{ height: '550px', marginTop: '2px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChangeEn}
                                />
                            </div>
                            <button className='btn-add-new-specialty' onClick={() => this.handleSaveNewSpecialty()}><FormattedMessage id="specialty.save" /></button>

                        </div>
                    </div>
                </div>
            </>

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
