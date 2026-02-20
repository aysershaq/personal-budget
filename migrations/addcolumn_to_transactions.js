module.exports = {
  async up(queryInterface, Sequelize) {

   
    await queryInterface.addColumn("Transactions", "to_envelop_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      autoIncrement:true
    });

  },

  async down(queryInterface) {
   
    await queryInterface.removeColumn("Transactions", "to_envelop_id");
  },
};
