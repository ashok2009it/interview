"use strict";

const uuid = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    return queryInterface.bulkInsert("Teams", [
      {
        uuid: uuid.v4(),
        name: "Ordinary Coral Lynx",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        name: "Weekly Peach Wildebeest",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        name: "Surrounding Gold Pheasant",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        name: "Feminist Maroon Gorilla",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        name: "Resident Scarlet Hare",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Teams", null, {});
  },
};
