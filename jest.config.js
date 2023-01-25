/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    verbose: true,
    testMatch: ['<rootDir>/__tests__/*.test.js'],
  };
};
