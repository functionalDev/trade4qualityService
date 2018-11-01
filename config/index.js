const getConfig = environment => {
  switch (environment) {
    case 'production':
      return require('./prod');
    default:
      return require('./local');
  }
};
module.exports = getConfig(process.env.NODE_ENV);
