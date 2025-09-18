
import { reject } from "lodash";
import db from "../models/index";
let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.nameVi || !data.nameEn ||
                !data.imageBase64 || !data.contentHTMLVi || !data.contentMarkdownEn ||
                !data.contentHTMLEn || !data.contentMarkdownEn || !data.address
            ) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }

            await db.Clinic.create({
                nameVi: data.nameVi,
                nameEn: data.nameEn,
                image: data.imageBase64,
                address: data.address,
                contentHTMLVi: data.contentHTMLVi,
                contentMarkdownVi: data.contentMarkdownVi,
                contentHTMLEn: data.contentHTMLEn,
                contentMarkdownEn: data.contentMarkdownEn,

            });

            return resolve({
                errCode: 0,
                errMessage: "Ok"
            });

        } catch (e) {
            console.error("Error in create Clinic:", e);
            return reject({
                errCode: -1,
                errMessage: "Server error, please try again later!"
            });
        }
    });
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
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
            reject(e);
        }
    })
}
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['contentHTMLVi', 'contentMarkdownVi', 'contentHTMLEn', 'contentMarkdownEn', 'image', 'nameVi', 'nameEn', 'address']

                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputId
                        },
                        attributes: ['doctorId']
                    })

                    data.doctorClinic = doctorClinic
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
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById
}