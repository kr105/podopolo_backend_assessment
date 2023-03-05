const request = require('supertest');
const app = require('../../app');

describe('Test 404 handling', () => {
  test('It should respond a 404 code with json message', () => {
    return request(app)
      .get('/invalid-route-test')
      .then(response => {
        expect(response.statusCode).toBe(404);
        expect(response.headers['content-type']).toContain('application/problem+json');
        expect(response.body).toStrictEqual({"message": "Not Found"});
      });
  });
});