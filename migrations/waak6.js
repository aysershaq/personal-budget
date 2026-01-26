"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncement:true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_budget:{
        type: Sequelize.DECIMAL,
                 allowNull: false,
      },
      payment_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      payment_recipient:{
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
         from_envelop_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
          to_envelop_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Transactions");
  },
};