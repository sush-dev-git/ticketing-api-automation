/**
 * Service configuration. PORT is only used when the service is run as a real
 * process (`npm start`); the test suite mounts the app in-process and never
 * binds a port.
 */
module.exports = {
  PORT: Number(process.env.PORT) || 3000,
};
