import userService from "../services/userService";
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        });
    }
    let userData = await userService.handleUserLogin(email, password);
    const isProduction = process.env.NODE_ENV === 'production';
    if (userData && userData.refreshToken) {
        // Lưu Refresh Token vào Cookie
        res.cookie('refreshToken', userData.refreshToken, {
            httpOnly: true, // Ngăn chặn JavaScript truy cập (chống XSS)
            secure: isProduction, // Chỉ gửi qua HTTPS khi ở production
            sameSite: isProduction ? 'None' : 'Lax', // Chống CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });
    }

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
        token: userData.token ? userData.token : ''
    });
}
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // nếu truyền type là all thì lấy tất cả các ng dùng, còn single chỉ lấy theo người dùng

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    });
};

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
};


let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters !"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
    try {

        let typeInput = req.query.type || req.body.type || req.params.type;
        let data = await userService.getAllCodeService(typeInput);
        return res.status(200).json(data);


    }
    catch (e) {
        console.log("Get all code error: ", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        });
    }
}

let handleRefreshToken = async (req, res) => {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ errCode: 1, message: 'Refresh Token is required' });
    }
    let data = await userService.refreshTokenService(refreshToken);
    console.log("Refresh token data: ", data);
    return res.status(200).json(data);
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleRefreshToken: handleRefreshToken
}