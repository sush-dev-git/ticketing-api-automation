const express = require('express');
const { createStore } = require('./store');
const eventsRouter = require('./routes/events');

/**
 * Builds an Express app wired to a store instance.
 *
 * The store is injected (defaulting to a fresh one) so tests can hand in their
 * own seeded/resettable store and assert on state in isolation. The app is
 * exported as a factory rather than a singleton for the same reason — every
 * test file gets a clean instance with no shared state.
 */
function createApp(store = createStore()) {
  const app = express();
  app.use(express.json());

  // Make the store available to routes via req.app.locals.store.
  app.locals.store = store;

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/events', eventsRouter);

  // Fallback 404 with a structured error body, matching the resource routes.
  app.use((req, res) => {
    res
      .status(404)
      .json({ error: 'not_found', message: `No route for ${req.method} ${req.path}` });
  });

  return app;
}

module.exports = { createApp };
