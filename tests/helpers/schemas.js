const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
// Ajv v8 ships no formats by default; enable them so `format: 'date-time'` etc.
// are actually validated rather than silently ignored.
addFormats(ajv);

/**
 * JSON Schemas describe the *contract* each response must satisfy. Validating
 * responses against these (via the toMatchSchema matcher) is a lightweight form
 * of contract testing: a renamed field or changed type fails loudly here.
 *
 * `additionalProperties: false` is deliberate — it catches *new* unexpected
 * fields too, not just missing ones, so the contract stays tight.
 */
const eventSchema = {
  type: 'object',
  required: [
    'id',
    'name',
    'venue',
    'city',
    'startsAt',
    'priceCents',
    'currency',
    'totalSeats',
    'availableSeats',
    'status',
  ],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    venue: { type: 'string' },
    city: { type: 'string' },
    startsAt: { type: 'string', format: 'date-time' },
    priceCents: { type: 'integer', minimum: 0 },
    currency: { type: 'string' },
    totalSeats: { type: 'integer', minimum: 0 },
    availableSeats: { type: 'integer', minimum: 0 },
    status: { type: 'string', enum: ['on_sale', 'sold_out', 'cancelled'] },
  },
  additionalProperties: false,
};

const eventListSchema = {
  type: 'object',
  required: ['data', 'page', 'limit', 'total', 'totalPages'],
  properties: {
    data: { type: 'array', items: eventSchema },
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1 },
    total: { type: 'integer', minimum: 0 },
    totalPages: { type: 'integer', minimum: 1 },
  },
  additionalProperties: false,
};

const errorSchema = {
  type: 'object',
  required: ['error', 'message'],
  properties: {
    error: { type: 'string' },
    message: { type: 'string' },
  },
  additionalProperties: false,
};

/**
 * Compiles and runs a schema against data.
 * @returns {{ valid: boolean, errors: object[]|null }}
 */
function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  return { valid, errors: validate.errors };
}

module.exports = {
  eventSchema,
  eventListSchema,
  errorSchema,
  validateSchema,
};
