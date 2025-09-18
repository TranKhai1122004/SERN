import axios from '../axios';
axios.defaults.withCredentials = true;
const handleLoginApi = (email, password) => {
    return axios.post('http://localhost:8080/api/login', {
        email: email,
        password: password
    });
};

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}
const createNewUserService = (data) => {
    console.log('check data from service: ', data)
    return axios.post('/api/create-new-user', data);
}

const deleteUserService = (userId) => {
    //return axios.delete('/api/delete-user', {id: userId})
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}
const editUserService = (inputData) => {
    return axios.put('/api/edit-user', inputData);
}

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
}
const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`)
}
const saveDetailDoctorService = (data) => {
    return axios.post(`/api/save-infor-doctors`, data)
}
const getDetaiInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post(`/api/bulk-create-schedule`, data)
}

const getScheduleByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}
const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
    return axios.post(`/api/patient-book-appointment`, data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post(`/api/verify-book-appointment`, data)
}
const createNewSpecialty = (data) => {
    return axios.post(`/api/create-new-specialty`, data)
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`)
}

const getDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}
const getAllHandBook = () => {
    return axios.get(`/api/get-handbook`)
}

const createNewHandBook = (data) => {
    return axios.post(`/api/create-new-handbook`, data)
}
const getDetailHandBookById = (id) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${id}`);
}
const createNewClinic = (data) => {
    return axios.post(`/api/create-new-clinc`, data)
}

const getAllClinic = () => {
    return axios.get(`/api/get-clinic`);
}
const getDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}
const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}
const postSendRemedy = (data) => {
    return axios.post(`/api/send-remedy`, data)
}
const postChatbotMessage = (message) => {
    return axios.post(`/api/chatbot`, { message });
};
export {
    handleLoginApi,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getTopDoctorHomeService,
    getAllDoctors,
    saveDetailDoctorService,
    getDetaiInforDoctor,
    saveBulkScheduleDoctor,
    getScheduleByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postPatientBookAppointment,
    postVerifyBookAppointment,
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    getAllHandBook,
    createNewHandBook,
    getDetailHandBookById,
    createNewClinic,
    getAllClinic,
    getDetailClinicById,
    getAllPatientForDoctor,
    postSendRemedy,
    postChatbotMessage
};
