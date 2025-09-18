'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Clinic.init({
        nameVi: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        address: DataTypes.STRING,
        contentHTMLVi: DataTypes.TEXT('long'),
        contentMarkdownVi: DataTypes.TEXT('long'),

        contentHTMLEn: DataTypes.TEXT('long'),
        contentMarkdownEn: DataTypes.TEXT('long'),

        image: DataTypes.TEXT('long')
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    
    return Clinic;
};