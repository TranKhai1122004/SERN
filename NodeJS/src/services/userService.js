import db from "../models/index";
import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = async (password) => {
    try {
        return bcrypt.hashSync(password, salt);
    } catch (e) {
        throw e;
    }
};

let handleUserLogin = async (email, password) => {
    try {
        let userData = {};
        let isExist = await checkUserEmail(email);

        if (isExist) {
            let user = await db.User.findOne({
                attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                where: { email: email },
                raw: true
            });

            if (user) {
                let check = bcrypt.compareSync(password, user.password);

                if (check) {
                    userData.errCode = 0;
                    userData.errMessage = 'Ok';
                    let token = jwt.sign(
                        { id: user.id, roleId: user.roleId },
                        process.env.JWT_SECRET || 'your_secret_key',
                        { expiresIn: '30m' }
                    );
                    let refreshToken = jwt.sign(
                        { id: user.id },
                        process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
                        { expiresIn: '7d' }
                    );

                    delete user.password;
                    userData.user = user;
                    userData.token = token;
                    userData.refreshToken = refreshToken;
                } else {
                    userData.errCode = 3;
                    userData.errMessage = 'Wrong password';
                }
            }
            else {
                userData.errCode = 2;
                userData.errMessage = `User's not found`;
            }
        } else {
            userData.errCode = 1;
            userData.errMessage = `Your's email isn't exist in your system. Please try other email`;
        }
        return userData;
    } catch (e) {
        throw e;
    }
};

let checkUserEmail = async (userEmail) => {
    try {
        let user = await db.User.findOne({
            where: { email: userEmail }
        });
        return !!user;
    } catch (e) {
        throw e;
    }
};

let getAllUsers = async (userId) => {
    try {
        let users = '';
        if (userId === "ALL") {
            users = await db.User.findAll({ // Thêm await ở đây
                attributes: {
                    exclude: ['password']
                }
            });
        }
        if (userId && userId !== 'ALL') {
            users = await db.User.findOne({ // Thêm await ở đây
                where: { id: userId },
                attributes: {
                    exclude: ['password']
                }
            });
        }
        return users; // Trả về users
    } catch (e) {
        throw e;
    }
};

let createNewUser = async (data) => {
    try {
        let check = await checkUserEmail(data.email);
        if (check === true) {
            return {
                errCode: 1,
                errMessage: "Your email is already in used, please try another email !!"
            };
        }
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
            firstName: data.firstName,
            password: hashPasswordFromBcrypt,
            lastName: data.lastName,
            email: data.email,
            address: data.address,
            phonenumber: data.phonenumber,
            gender: data.gender,
            roleId: data.roleId,
            positionId: data.positionId,
            image: data.avatar
        });
        return {
            errCode: 0,
            message: 'OK'
        };
    } catch (e) {
        throw e;
    }
};
let deleteUser = async (userId) => {
    try {
        let founduser = await db.User.findOne({
            where: { id: userId }
        });
        if (!founduser) {
            return {
                errCode: 2,
                errMessage: `The user isn't exist`
            };
        }
        await db.User.destroy({
            where: { id: userId }
        });
        return {
            errCode: 0,
            message: `The user is deleted`
        };
    } catch (e) {
        throw e;
    }
};
let updateUserData = async (data) => {
    try {
        if (!data.id || !data.roleId || !data.positionId || !data.gender) { // Thêm await ở đây
            return {
                errCode: 2,
                errMessage: 'Missing required parameters'
            };
        }
        let user = await db.User.findOne({
            where: { id: data.id },
            raw: false
        })
        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            user.roleId = data.roleId;
            user.positionId = data.positionId;
            user.gender = data.gender;
            user.phonenumber = data.phonenumber;
            if (data.avatar) {
                user.image = data.avatar;
            }
            await user.save();
            return {
                errCode: 0,
                message: 'Update user succeed !!'
            };
        } else {
            return {
                errCode: 1,
                errMessage: `User's not found !`
            };
        }

    } catch (e) {
        throw e;
    }
};

let getAllCodeService = async (typeInput) => {
    try {
        if (!typeInput) { // Thêm await ở đây
            return {
                errCode: 1,
                errMessage: "Missing required parameters !"
            };
        } else {
            let allcode = await db.ALLcode.findAll({
                where: { type: typeInput }
            });
            return {
                errCode: 0,
                data: allcode
            };
        }

    } catch (e) {
        throw e;
    }
}

let refreshTokenService = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your_refresh_secret');
        let user = await db.User.findOne({
            where: { id: decoded.id },
            raw: true
        });
        if (!user) return { errCode: 2, errMessage: 'User not found' };

        let accessToken = jwt.sign(
            { id: user.id, roleId: user.roleId },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '30m' }
        );
        return { errCode: 0, accessToken };
    } catch (e) {
        return { errCode: 1, errMessage: 'Refresh token invalid or expired' };
    }
};

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    refreshTokenService: refreshTokenService
}