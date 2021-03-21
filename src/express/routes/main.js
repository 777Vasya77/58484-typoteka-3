'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const mainController = require(`../controllers/main-controller`);

mainRouter.get(`/`, mainController.showMain);
mainRouter.get(`/search`, mainController.showSearch);
mainRouter.get(`/login`, mainController.showLogin);
mainRouter.get(`/register`, mainController.showRegister);

module.exports = mainRouter;
