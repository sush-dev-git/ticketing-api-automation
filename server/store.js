/**
 * In-memory data store for the mock ticketing service.
 *
 * Everything lives in plain arrays/maps so the service has zero external
 * dependencies and the test suite is fully deterministic — each created store
 * starts from the same seed and resets cleanly. This keeps the focus on the
 * *test architecture*, not on database plumbing.
 *
 * The data is entirely invented. Event names, venues, and cities are fictional.
 */

function seedEvents() {
  return [
    {
      id: 'evt_001',
      name: 'Midnight Synth Collective',
      venue: 'The Glass Hall',
      city: 'Austin',
      startsAt: '2026-09-12T02:00:00.000Z',
      priceCents: 4500,
      currency: 'USD',
      totalSeats: 200,
      availableSeats: 200,
      status: 'on_sale',
    },
    {
      id: 'evt_002',
      name: 'Harbor Lights Jazz Night',
      venue: 'Pier 9 Amphitheater',
      city: 'Seattle',
      startsAt: '2026-09-20T03:30:00.000Z',
      priceCents: 6000,
      currency: 'USD',
      totalSeats: 150,
      availableSeats: 42,
      status: 'on_sale',
    },
    {
      id: 'evt_003',
      name: 'Cascade Indie Fest',
      venue: 'Riverside Grounds',
      city: 'Denver',
      startsAt: '2026-10-04T20:00:00.000Z',
      priceCents: 8000,
      currency: 'USD',
      totalSeats: 500,
      availableSeats: 0,
      status: 'sold_out',
    },
    {
      id: 'evt_004',
      name: 'Riverside Comedy Hour',
      venue: 'The Bric Theater',
      city: 'Austin',
      startsAt: '2026-10-11T01:00:00.000Z',
      priceCents: 3000,
      currency: 'USD',
      totalSeats: 120,
      availableSeats: 75,
      status: 'on_sale',
    },
    {
      id: 'evt_005',
      name: 'Aurora Strings Quartet',
      venue: 'Civic Concert Library',
      city: 'Seattle',
      startsAt: '2026-10-18T02:00:00.000Z',
      priceCents: 5500,
      currency: 'USD',
      totalSeats: 90,
      availableSeats: 90,
      status: 'on_sale',
    },
    {
      id: 'evt_006',
      name: 'Skyline EDM Warehouse',
      venue: 'Depot 17',
      city: 'Denver',
      startsAt: '2026-11-01T04:00:00.000Z',
      priceCents: 7000,
      currency: 'USD',
      totalSeats: 350,
      availableSeats: 350,
      status: 'cancelled',
    },
  ];
}

/**
 * Creates an isolated store instance with freshly seeded data.
 * Tests create their own store (directly or via the app factory) so state
 * never leaks between files.
 */
function createStore() {
  let events = seedEvents();

  return {
    listEvents({ city, status } = {}) {
      return events.filter((e) => {
        if (city && e.city.toLowerCase() !== String(city).toLowerCase()) return false;
        if (status && e.status !== status) return false;
        return true;
      });
    },

    getEvent(id) {
      return events.find((e) => e.id === id) || null;
    },

    // Restores the seed. Useful for resetting state between tests.
    reset() {
      events = seedEvents();
    },
  };
}

module.exports = { createStore, seedEvents };
