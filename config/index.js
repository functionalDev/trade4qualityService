const getConfig = environment => {
  switch (environment) {
    case 'local':
      return require('./local');
    default:
      return require('./prod');
  }
};
const config = getConfig(process.env.NODE_ENV);
module.exports = config;
