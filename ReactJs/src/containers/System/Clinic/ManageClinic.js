import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import { LANGUAGES, CommonUtils } from '../../../utils';
import { createNewClinic } from '../../../services/userService';
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageBase64: '',
            contentHTMLVi: '',
            contentMarkdownVi: '',
            contentHTMLEn: '',
            contentMarkdownEn: '',
            address: '',
            nameVi: '',
            nameEn: '',
        };
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

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
    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        window.open(this.state.previewImgURL, "_blank");
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
            contentHTMLEn: html,
        })
    }
    handleSaveNewClinic = async () => {
        let data = { ...this.state };
        let res = await createNewClinic(data);

        if (res && res.errCode === 0) {
            toast.success("Add new handbook succeed !");
            this.setState({
                imageBase64: '',
                contentHTMLVi: '',
                contentMarkdownVi: '',
                contentHTMLEn: '',
                contentMarkdownEn: '',
                address: '',
                nameVi: '',
                nameEn: '',
            });
        } else {
            toast.error('Something wrong...');
            console.log('trkhai check error: ', res);
        }


    };
    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    render() {

        return (
            <>
                <div className="background-image-layer">
                    <div className="overlay"></div>
                </div>
                <div className='manage-handbook-container'>
                    <div className='manage-handbook-title'>Quản lý phòng khám</div>
                    <div className='manage-handbook-body'>
                        <div className='container'>
                            <div className='add-new-handbook row'>
                                <div className='col-6 form-group'>
                                    <label>Tên phòng khám Vi</label>
                                    <input
                                        className='form-control' type='text' value={this.state.nameVi}
                                        onChange={(event) => this.handleOnChangeInput(event, 'nameVi')}
                                    ></input>
                                    <label>Tên phòng khám En</label>
                                    <input
                                        className='form-control' type='text' value={this.state.nameEn}
                                        onChange={(event) => this.handleOnChangeInput(event, 'nameEn')}
                                    ></input>
                                    <label>Địa chỉ phòng khám</label>
                                    <input
                                        className='form-control' type='text' value={this.state.address}
                                        onChange={(event) => this.handleOnChangeInput(event, 'address')}
                                    ></input>

                                </div>
                                <div className='col-6 form-group'>
                                    <label>Ảnh phòng khám</label>
                                    <div className="custom-file-upload">
                                        <input
                                            className='choose-file'
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

                            <div className='manage-handbook-editor'>
                                <div className='markdownVi'>MarkdownVi</div>
                                <MdEditor
                                    value={this.state.contentMarkdownVi}
                                    style={{ height: '550px', marginTop: '2px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChangeVi}
                                />
                                <div className='markdownEn'>MarkdownEn</div>
                                <MdEditor
                                    value={this.state.contentMarkdownEn}
                                    style={{ height: '550px', marginTop: '2px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={this.handleEditorChangeEn}
                                />
                            </div>
                            <button className='btn-add-new-handbook' onClick={() => this.handleSaveNewClinic()}><FormattedMessage id='handBook.save' /></button>

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
