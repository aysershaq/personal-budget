module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeColumn("Transactions",'id')
    await queryInterface.addColumn("Transactions", "id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      autoIncrement:true,
      primaryKey:true
    });

  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Transactions", "from_envelop_id");
    await queryInterface.removeColumn("Transactions", "to_envelop_id");
  },
};
