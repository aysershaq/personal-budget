'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
                        await queryInterface.removeColumn('Expenses','income')
            


                         await queryInterface.addColumn('Expenses', 'spent',{
                          type:Sequelize.DECIMAL,
                          allowNull:false
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
