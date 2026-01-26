'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    

            


                         await queryInterface.addColumn('Transactions', 'created_at',{
                          type:Sequelize.DATE
                         });
                                                  await queryInterface.addColumn('Transactions', 'updated_at',{
                          type:Sequelize.DATE
                         });


    /**           

     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
