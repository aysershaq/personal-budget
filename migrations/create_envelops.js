"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Envelops", {
           id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncement:true

      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_budget: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      spent:{
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("users");
  },
};
