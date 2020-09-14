const express = require('express');
const CategoriesService = require('./categories-service');
const path = require('path');
const xss = require('xss');

const categoriesRouter = express.Router();
const jsonParser = express.json();

const serializeCategory = category => ({
  id: category.id,
  category: category.category
})

categoriesRouter
  .route('/')
  .get((req, res, next) => {
    CategoriesService.getAllCategories(
      req.app.get('db')
    )
      .then(categories => {
        res.json(categories.map(serializeCategory))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { category } = req.body
    const newCategory = { category }

    CategoriesService.insertCategory(
      req.app.get('db'),
      newCategory
    )
      .then(category => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${category.id}`))
          .json(serializeCategory(category))
      })
      .catch(next)
  })

module.exports = categoriesRouter;