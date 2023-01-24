'use strict';

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

    return queryInterface.bulkInsert('Users', [
      {
        uuid: uuid.v4(),
        full_name: 'Ashok',
        email: 'ashoktest@gmail.com',
        active: 1,
        password: '$2a$10$Jh9hrTKEaIPNfqhCrcPU/eHPw5m1tXhslDgCbmfADNwuphVaz7Wnq',
        is_email_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        full_name: 'gianniWehner',
        email: 'gianniwehner@gmail.com',
        active: 1,
        password: '$2a$10$Jh9hrTKEaIPNfqhCrcPU/eHPw5m1tXhslDgCbmfADNwuphVaz7Wnq',
        is_email_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        full_name: 'jarenKerluke',
        email: 'jarenKerluke@gmail.com',
        active: 1,
        password: '$2a$10$Jh9hrTKEaIPNfqhCrcPU/eHPw5m1tXhslDgCbmfADNwuphVaz7Wnq',
        is_email_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        full_name: 'marionKertzmann',
        email: 'marionKertzmann@gmail.com',
        active: 1,
        password: '$2a$10$Jh9hrTKEaIPNfqhCrcPU/eHPw5m1tXhslDgCbmfADNwuphVaz7Wnq',
        is_email_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        uuid: uuid.v4(),
        full_name: 'carmeloStark',
        email: 'carmeloStark@gmail.com',
        active: 1,
        password: '$2a$10$Jh9hrTKEaIPNfqhCrcPU/eHPw5m1tXhslDgCbmfADNwuphVaz7Wnq',
        is_email_verified: true,
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
    return queryInterface.bulkDelete('Users', null, {});
  },
};
