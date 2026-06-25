const express = require('express');

const router = express.Router();

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;

/**
 * GET /events
 * Paginated, filterable list of events.
 * Query params: page, limit, city, status.
 * Responds with a paginated envelope: { data, page, limit, total, totalPages }.
 */
router.get('/', (req, res) => {
  const { store } = req.app.locals;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));

  const all = store.listEvents({ city: req.query.city, status: req.query.status });
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  res.json({ data, page, limit, total, totalPages });
});

/**
 * GET /events/:id
 * Returns a single event, or 404 with a structured error body.
 */
router.get('/:id', (req, res) => {
  const { store } = req.app.locals;
  const event = store.getEvent(req.params.id);

  if (!event) {
    return res
      .status(404)
      .json({ error: 'not_found', message: `No event with id ${req.params.id}` });
  }

  res.json(event);
});

module.exports = router;
