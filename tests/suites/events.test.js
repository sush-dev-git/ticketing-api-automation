const { client } = require('../helpers/client');
const { eventSchema, eventListSchema, errorSchema } = require('../helpers/schemas');

/**
 * Read-path coverage for the /events resource: the paginated list, filtering,
 * single-resource fetch, and the not-found path. Each test asserts both the
 * status/shape *and* the response contract via toMatchSchema.
 */
describe('GET /events', () => {
  it('returns 200, a JSON content-type, and a paginated envelope', async () => {
    const res = await client().get('/events');

    expect(res.status).toBe(200);
    expect(res.type).toBe('application/json');
    expect(res.body).toMatchSchema(eventListSchema);
  });

  it('every event in the list satisfies the event contract', async () => {
    const res = await client().get('/events');

    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((event) => {
      expect(event).toMatchSchema(eventSchema);
    });
  });

  it('reports an accurate total and respects the page size', async () => {
    const res = await client().get('/events').query({ limit: 2, page: 1 });

    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(2);
    expect(res.body.page).toBe(1);
    expect(res.body.data).toHaveLength(2);
    // total counts all matching events, not just the current page.
    expect(res.body.total).toBeGreaterThan(2);
    expect(res.body.totalPages).toBe(Math.ceil(res.body.total / 2));
  });

  it('returns different items on different pages (no overlap)', async () => {
    const page1 = await client().get('/events').query({ limit: 2, page: 1 });
    const page2 = await client().get('/events').query({ limit: 2, page: 2 });

    const ids1 = page1.body.data.map((e) => e.id);
    const ids2 = page2.body.data.map((e) => e.id);

    expect(ids1).not.toEqual(ids2);
    expect(ids1.some((id) => ids2.includes(id))).toBe(false);
  });

  it('filters by city', async () => {
    const res = await client().get('/events').query({ city: 'Austin' });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((event) => {
      expect(event.city).toBe('Austin');
    });
  });

  it('filters by status', async () => {
    const res = await client().get('/events').query({ status: 'sold_out' });

    expect(res.status).toBe(200);
    res.body.data.forEach((event) => {
      expect(event.status).toBe('sold_out');
    });
  });

  it('returns an empty page (not an error) when a filter matches nothing', async () => {
    const res = await client().get('/events').query({ city: 'Nowhereville' });

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });
});

describe('GET /events/:id', () => {
  it('returns a single event matching the contract', async () => {
    const res = await client().get('/events/evt_001');

    expect(res.status).toBe(200);
    expect(res.body).toMatchSchema(eventSchema);
    expect(res.body.id).toBe('evt_001');
  });

  it('returns 404 with a structured error body for an unknown id', async () => {
    const res = await client().get('/events/evt_does_not_exist');

    expect(res.status).toBe(404);
    expect(res.body).toMatchSchema(errorSchema);
    expect(res.body.error).toBe('not_found');
  });
});
