"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Income", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncement:true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      income: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
     
      
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Income");
  },
};