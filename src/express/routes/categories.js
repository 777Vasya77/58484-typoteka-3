'use strict';

const {Router} = require(`express`);
const categoriesRouter = new Router();
const categoryController = require(`../controllers/category-controller`);

categoriesRouter.get(`/`, categoryController.showCategories);

module.exports = categoriesRouter;
