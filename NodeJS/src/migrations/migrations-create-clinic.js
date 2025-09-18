'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('clinics', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            address: {
                type: Sequelize.STRING
            },
            nameVi: {
                type: Sequelize.STRING
            },
            nameEn: {
                type: Sequelize.STRING
            },
            contentHTMLVi: {
                allowNull: true,
                type: Sequelize.TEXT('long')
            },
            contentMarkdownVi: {
                allowNull: true,
                type: Sequelize.TEXT('long')
            },

            contentHTMLEn: {
                allowNull: true,
                type: Sequelize.TEXT('long')
            },
            contentMarkdownEn: {
                allowNull: true,
                type: Sequelize.TEXT('long')
            },

            image: {
                type: Sequelize.BLOB('long'),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('clinics');
    }
};