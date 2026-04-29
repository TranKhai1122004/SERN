import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from '../controllers/patientController';
import specialtyController from "../controllers/specialtyController";
import handBookController from "../controllers/handBookController";
import clinicController from "../controllers/clinicController";
import chatbotController from "../controllers/chatbotController";
import pingController from "../controllers/pingController";
import authMiddleware from "./authMiddleware";
import verifyToken from "../services/verifyToken";
let router = express.Router();
let initWebRoutes = (app) => {
    //homeController
    router.get("/", homeController.getHomePage);
    router.get("/about", homeController.getHomeAbout);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);
    //userController
    router.post('/api/login', userController.handleLogin);
    router.post('/api/refresh-token', userController.handleRefreshToken);
    router.get('/api/get-all-users', verifyToken, authMiddleware.checkUserRole(['R1']), userController.handleGetAllUsers);
    router.post('/api/create-new-user', verifyToken, authMiddleware.checkUserRole(['R1']), userController.handleCreateNewUser);
    router.put('/api/edit-user', verifyToken, authMiddleware.checkUserRole(['R1']), userController.handleEditUser);
    router.delete('/api/delete-user', verifyToken, authMiddleware.checkUserRole(['R1']), userController.handleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);
    //doctorController
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorController.getAllDoctors);
    router.post('/api/save-infor-doctors', verifyToken, authMiddleware.checkUserRole(['R1']), doctorController.postInforDoctors);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDotorById);
    router.post('/api/bulk-create-schedule', verifyToken, authMiddleware.checkUserRole(['R1', 'R2']), doctorController.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);
    router.get('/api/get-list-patient-for-doctor', verifyToken, authMiddleware.checkUserRole(['R1', 'R2']), doctorController.getListPatientForDoctor);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.post('/api/send-remedy', verifyToken, authMiddleware.checkUserRole(['R1', 'R2']), doctorController.sendRemedy);
    //patientController
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);
    //specialtyController
    router.post('/api/create-new-specialty', verifyToken, authMiddleware.checkUserRole(['R1']), specialtyController.createSpecialty);
    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.get('/api/get-detail-specialty-by-name', specialtyController.getDetailSpecialtyByName);
    //handBookController
    router.get('/api/get-handbook', handBookController.getAllHandBook);
    router.post('/api/create-new-handbook', verifyToken, authMiddleware.checkUserRole(['R1']), handBookController.createHandBook);
    router.get('/api/get-detail-handbook-by-id', handBookController.getDetailHandBookById);
    //clinicController
    router.post('/api/create-new-clinc', verifyToken, authMiddleware.checkUserRole(['R1']), clinicController.createClinic);
    router.get('/api/get-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);
    //chatbotController
    router.post('/api/chatbot', chatbotController.handleChatbotMessage);
    //route ping
    router.get("/ping", pingController.handlePing);

    return app.use("/", router);
};

module.exports = initWebRoutes;