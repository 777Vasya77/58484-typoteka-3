'use strict';

const api = require(`../api`).getAPI();

const showMy = async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
};

const showComments = async (req, res) => {
  const articles = await api.getArticles();
  res.render(`comments`, {articles: articles.slice(0, 3)});
};

module.exports = {
  showMy,
  showComments,
};
