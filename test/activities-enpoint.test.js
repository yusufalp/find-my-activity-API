const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeActivities } = require('./activities.fixture');

describe('Activities endpoints', () => {
  db = knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  })
  app.set('db', db)

  after('disconnect from db', () => {
    db.destroy()
  })

  before('clean the table', () => db.raw('TRUNCATE activities, categories RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE activities, categories RESTART IDENTITY CASCADE'))

  describe('GET /api/activities', () => {
    context('Given there are no data', () => {
      it('responds with 200', () => {
        return supertest(app)
          .get('/api/activities')
          .expect(200, [])
      })
    })

    context('Given there are data in the activities table', () => {
      const testActivities = makeActivities()

      beforeEach('insert activities', () => {
        return db
          .into('activities')
          .insert(testActivities)
      })

      it('responds with 200 and with all activities', () => {
        return supertest(app)
          .get('/api/activities')
          .expect(200, testActivities)
      })
    })
  })

  describe('POST /api/activities', () => {
    it('creates an activity responding with 201 and the new activity', function () {
      const newActivity = {
        name: 'Test Name',
        content: 'Test Content',
        duration: 'Test duration',
        materials: 'Test materials',
        agegroup: '4',
        category: 'Test outdoor'
      }
      return supertest(app)
        .post('/api/activities')
        .send(newActivity)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newActivity.name)
          expect(res.body.content).to.eql(newActivity.content)
          expect(res.body.duration).to.eql(newActivity.duration)
          expect(res.body.agegroup).to.eql(newActivity.agegroup)
          expect(res.body.category).to.eql(newActivity.category)
          expect(res.body).to.have.property('id')
        })
    })
  })
})