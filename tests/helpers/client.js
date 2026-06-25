const supertest = require('supertest');
const { createApp } = require('../../server/app');

/**
 * Test client.
 *
 * By default the suite mounts the Express app in-process and lets SuperTest
 * drive it directly — no port binding, no network, fully deterministic. Set
 * BASE_URL to run the exact same suite against a deployed instance instead
 * (e.g. a staging URL in a smoke-test job). One suite, two targets.
 */
const target = process.env.BASE_URL || createApp();

const client = () => supertest(target);

module.exports = { client };
