'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    return queryInterface.bulkInsert("User_Roles", [
      {
        user_id: 1,
        role_id: 1,
      },
      {
        user_id: 2,
        role_id: 1,
      },
      {
        user_id: 3,
        role_id: 1,
      },
      {
        user_id: 4,
        role_id: 1,
      },
      {
        user_id: 5,
        role_id: 1,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
