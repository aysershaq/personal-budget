'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    

            


                         await queryInterface.addColumn('Income', 'created_at',{
                          type:Sequelize.DATE
                         });
                                                  await queryInterface.addColumn('Income', 'updated_at',{
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
