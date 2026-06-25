const { validateSchema } = require('./tests/helpers/schemas');

/**
 * Custom matcher: expect(responseBody).toMatchSchema(eventSchema)
 *
 * Keeps contract assertions readable in the test files and produces a helpful
 * diff (the ajv errors) when a response drifts from its schema. Validating
 * responses against a schema is a lightweight form of contract testing: if the
 * API renames a field or changes a type, the check fails loudly here instead of
 * a downstream consumer breaking silently in production.
 */
expect.extend({
  toMatchSchema(received, schema) {
    const { valid, errors } = validateSchema(schema, received);
    return {
      pass: valid,
      message: () =>
        valid
          ? 'expected response NOT to match schema, but it did'
          : `expected response to match schema, but validation failed:\n${JSON.stringify(
              errors,
              null,
              2
            )}`,
    };
  },
});
