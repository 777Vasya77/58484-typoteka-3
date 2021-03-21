'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const myController = require(`../controllers/my-controller`);

myRouter.get(`/`, myController.showMy);
myRouter.get(`/comments`, myController.showComments);

module.exports = myRouter;
