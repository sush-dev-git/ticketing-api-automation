const { createApp } = require('./app');
const { PORT } = require('./config');

/**
 * Entry point for running the mock service as a real process (`npm start`).
 * The test suite does not use this — it mounts the app in-process via SuperTest.
 */
const app = createApp();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ticketing mock API listening on http://localhost:${PORT}`);
});
