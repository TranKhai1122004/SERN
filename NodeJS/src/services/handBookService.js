const { reject } = require("lodash");
import { where } from "sequelize";
import db from "../models/index";


let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.name ||
                !data.imageBase64 || !data.contentHTML || !data.contentMarkdown
            ) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }

            await db.HandBook.create({
                name: data.name,
                image: data.imageBase64,
                contentHTML: data.contentHTML,
                contentMarkdown: data.contentMarkdown,

            });

            return resolve({
                errCode: 0,
                errMessage: "Ok"
            });

        } catch (e) {
            console.error("Error in createHandBook:", e);
            return reject({
                errCode: -1,
                errMessage: "Server error, please try again later!"
            });
        }
    });
};
let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll();
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
// 
let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                return resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            } else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['contentHTML', 'contentMarkdown','image', 'name']

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
    createHandBook: createHandBook,
    getAllHandBook: getAllHandBook,
    getDetailHandBookById: getDetailHandBookById

}