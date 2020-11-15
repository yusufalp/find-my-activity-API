const app = require('../src/app');
const knex = require('knex');

describe('Categories endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL
    })
    app.set('db', db);
  })

  describe('GET /api/categories', () => {
    context('Given there are no data', () => {
      it('responds with 200', () => {
        return supertest(app)
          .get('/api/categories')
          .expect(200)
          .expect('Content-Type', /json/);
      })
    })
  })
})
