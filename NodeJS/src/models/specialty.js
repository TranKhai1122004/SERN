'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Specialty.init({
        nameVi: DataTypes.STRING,
        nameEn: DataTypes.STRING,

        contentHTMLVi: DataTypes.TEXT('long'),
        contentMarkdownVi: DataTypes.TEXT('long'),

        contentHTMLEn: DataTypes.TEXT('long'),
        contentMarkdownEn: DataTypes.TEXT('long'),

        image: DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'Specialty',
        tableName: 'specialties',   // ép đúng tên bảng
        freezeTableName: true
    });
    return Specialty;
};