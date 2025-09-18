import actionTypes from './actionTypes';
import {
    getAllCodeService, createNewUserService, getAllUsers,
    deleteUserService, editUserService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctorService,
    getAllSpecialty, getAllClinic, postChatbotMessage
} from '../../services/userService';
import { toast } from "react-toastify";


// export const FetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })
export const FetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            })
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(FetchGenderSuccess(res.data));
            }
            else {
                dispatch(FetchGenderFailed());
            }
        } catch (e) {
            dispatch(FetchGenderFailed());
            console.log('FetchGenderStart error', e);
        }
    }

};

export const FetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const FetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

// Position
export const FetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {

            let res = await getAllCodeService("POSITION");
            if (res && res.errCode === 0) {
                dispatch(FetchPositionSuccess(res.data));
            }
            else {
                dispatch(FetchPositionFailed());
            }
        } catch (e) {
            dispatch(FetchPositionFailed());
            console.log('FetchPositionStart error', e);
        }
    }

};

export const FetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})
export const FetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

//Role
export const FetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(FetchRoleSuccess(res.data));
            }
            else {
                dispatch(FetchRoleFailed());
            }
        } catch (e) {
            dispatch(FetchRoleFailed());
            console.log('FetchRoleStart error', e);
        }
    }

};

export const FetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})
export const FetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            console.log("trankhai check create user redux: ", res);
            if (res && res.errCode === 0) {
                toast.success("Create a new user succeed");
                dispatch(saveUserSuccess());
                dispatch(FetchAllUsersStart());
            }
            else {
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed());
            console.log('Create new user error', e);
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})
export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const FetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            let res1 = await getTopDoctorHomeService('3')
            if (res && res.errCode === 0) {
                dispatch(FetchAllUsersSuccess(res.users.reverse()));
            }
            else {
                dispatch(FetchAllUsersFailed());
            }
        } catch (e) {
            dispatch(FetchAllUsersFailed());
            console.log('FetchAllUsersFailed error', e);
        }
    }

};

export const FetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const FetchAllUsersFailed = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the user succeed");
                dispatch(deleteUserSuccess());
                dispatch(FetchAllUsersStart());
            }
            else {
                toast.error('Fetch all user error!');
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            toast.error('Fetch all user error!');
            dispatch(deleteUserFailed());
            console.log("Delete the user error!", e)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Update the user succeed");
                dispatch(editUserSuccess());
                dispatch(FetchAllUsersStart());
            }
            else {
                toast.error('Update all user error!');
                dispatch(editUserFailed());
            }
        } catch (e) {
            toast.error('Update all user error!');
            dispatch(editUserFailed());
            console.log("Update the user error!", e)
        }
    }
}

export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_TOP_DOCTORS_FAILED', e)
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED
            })
        }
    }
}

export const fetchAllDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDr: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_ALL_DOCTORS_FAILED', e)
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED
            })
        }
    }
}

export const saveDetailDoctors = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if (res && res.errCode === 0) {
                toast.success("Save infor Detail Doctor succeed!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                })
                dispatch(fetchAllDoctor());
            } else {
                toast.error("Save infor Detail Doctor error!");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                })
            }
        } catch (e) {
            toast.error("Save infor Detail Doctor error!");
            console.log('FETCH_ALL_DOCTORS_FAILED', e)
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
            })
        }
    }
}

export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                })
            }
        } catch (e) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED', e)
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
            })
        }
    }
}




export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START
            })
            let resPrice = await getAllCodeService("PRICE");
            let resPayment = await getAllCodeService("PAYMENT");
            let resProvince = await getAllCodeService("PROVINCE");
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();
            if (resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0 &&
                resSpecialty && resSpecialty.errCode === 0 &&
                resClinic && resClinic.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data
                }
                dispatch(fetchRequiredDoctorInforSuccess(data))
            }
            else {
                dispatch(fetchRequiredDoctorInforFailed());
            }
        } catch (e) {
            dispatch(fetchRequiredDoctorInforFailed());
            console.log('fetchRequiredDoctorInfor error', e);
        }
    }

};

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = (data) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
})


export const fetchChatbotMessage = (message) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_CHATBOT_MESSAGE_START });

            let res = await postChatbotMessage(message);

            if (res && res.data && res.data.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_CHATBOT_MESSAGE_SUCCESS,
                    data: res.data.reply,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_CHATBOT_MESSAGE_FAILED,
                });
            }
        } catch (error) {
            console.error("fetchChatbotMessage error:", error);
            dispatch({
                type: actionTypes.FETCH_CHATBOT_MESSAGE_FAILED,
            });
        }
    };
};
