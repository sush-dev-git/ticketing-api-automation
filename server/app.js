const fs = require('fs');
const path = require('path');
const express = require('express');
const YAML = require('yaml');
const swaggerUi = require('swagger-ui-express');
const { createStore } = require('./store');
const eventsRouter = require('./routes/events');

// Load the OpenAPI spec once at startup. It is the single source of truth for
// the API contract and is also published as static docs (GitHub Pages).
const openapiDoc = YAML.parse(
  fs.readFileSync(path.join(__dirname, '..', 'openapi.yaml'), 'utf8')
);

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

  // Interactive API docs (Swagger UI) and the raw spec as JSON.
  app.get('/openapi.json', (req, res) => res.json(openapiDoc));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

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
