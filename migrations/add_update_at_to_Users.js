'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    

            


                         await queryInterface.addColumn('Users', 'created_at',{
                          type:Sequelize.DATE
                         });
                                                  await queryInterface.addColumn('Users', 'updated_at',{
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
