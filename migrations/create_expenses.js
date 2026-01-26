"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Expenses", {
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
      created_at:{
        type: Sequelize.DATE
      },
      updated_at:{
        type: Sequelize.DATE
      }
     
      
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Expenses");
  },
};