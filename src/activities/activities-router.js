const express = require('express');
const ActivitiesService = require('./activities-service');
const path = require('path');
// const path = require('path');
const xss = require('xss');

const activitiesRouter = express.Router();
const jsonParser = express.json();

const serializeActivity = activity => ({
  id: activity.id,
  name: xss(activity.name),
  content: xss(activity.content),
  duration: xss(activity.duration),
  materials: xss(activity.materials),
  agegroup: activity.agegroup,
  category: activity.category
})

activitiesRouter
  .route('/')
  .get((req, res, next) => {
    ActivitiesService.getAllActivities(
      req.app.get('db')
    )
      .then(activities => {
        res.json(activities.map(serializeActivity))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, content, duration, materials, agegroup, category } = req.body
    const newActivity = { name, content, duration, materials, agegroup, category }

    ActivitiesService.insertActivity(
      req.app.get('db'),
      newActivity
    )
      .then(activity => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${activity.id}`))
          .json(serializeActivity(activity))
      })
      .catch(next)
  })

module.exports = activitiesRouter;