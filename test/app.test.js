const app = require('../src/app');

describe('GET /api/categories', () => {
  it('should return an array of categories', () => {
    return supertest(app)
      .get('/api/categories')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  })
})