const { reject } = require("lodash");
import { where,  Op, fn, col } from "sequelize";
import db from "../models/index";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data ||
                !data.imageBase64 ||
                !data.nameVi ||
                !data.nameEn ||
                !data.contentHTMLVi ||
                !data.contentMarkdownVi ||
                !data.contentHTMLEn ||
                !data.contentMarkdownEn) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }

            await db.Specialty.create({
                nameVi: data.nameVi,
                nameEn: data.nameEn,
                image: data.imageBase64,
                contentHTMLVi: data.contentHTMLVi,
                contentMarkdownVi: data.contentMarkdownVi,
                contentHTMLEn: data.contentHTMLEn,
                contentMarkdownEn: data.contentMarkdownEn
            });

            return resolve({
                errCode: 0,
                errMessage: "Ok"
            });

        } catch (e) {
            console.error("Error in createSpecialty:", e);
            return reject({
                errCode: -1,
                errMessage: "Server error, please try again later!"
            });
        }
    });
};

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: '',
                data
            })
        } catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['contentHTMLVi', 'contentMarkdownVi', 'contentHTMLEn', 'contentMarkdownEn', 'image']

                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        //find by location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }

                    data.doctorSpecialty = doctorSpecialty
                } else {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: '',
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getDetailSpecialtyByName = (inputName) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputName) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: where(
                        fn("LOWER", col("nameVi")),   // ép cột về lowercase
                        inputName.toLowerCase()       // ép input về lowercase
                    ),
                    attributes: ['contentHTMLVi', 'contentMarkdownVi', 'contentHTMLEn', 'contentMarkdownEn', 'image', "id"]

                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    errMessage: '',
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    getDetailSpecialtyByName: getDetailSpecialtyByName
}