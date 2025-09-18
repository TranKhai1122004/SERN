'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ALLcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ALLcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
      ALLcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      ALLcode.hasMany(models.Schedule, { foreignKey: 'timeType', as: 'timeTypeData' })
      ALLcode.hasMany(models.Booking, { foreignKey: 'timeType', as: 'timeTypeDataPatient' })
      ALLcode.hasMany(models.Doctor_Infor, { foreignKey: 'priceId', as: 'priceTypeData' })
      ALLcode.hasMany(models.Doctor_Infor, { foreignKey: 'provinceId', as: 'provinceTypeData' })
      ALLcode.hasMany(models.Doctor_Infor, { foreignKey: 'paymentId', as: 'paymentTypeData' })

    }
  }

  ALLcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ALLcode', // Tên model
  });

  return ALLcode; // Trả về class ALLcode thay vì User hoặc ALLcode chưa định nghĩa
};
