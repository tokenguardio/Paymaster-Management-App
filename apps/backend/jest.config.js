const baseConfig = require('@repo/jest-config/base');

module.exports = {
  ...baseConfig,
  coveragePathIgnorePatterns: [...(baseConfig.coveragePathIgnorePatterns || []), '/src/scripts/'],
};
