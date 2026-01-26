'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    

                await queryInterface.removeColumn('Users','id')


                         await queryInterface.addColumn('Users', 'id',{
                          type:Sequelize.INTEGER,
                          autoIncrement:true,
                          primaryKey:true,
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
