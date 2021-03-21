'use strict';

const api = require(`../api`).getAPI();

const showMain = async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
};

const showSearch = async (req, res) => {
  const {search} = req.query;

  try {
    const results = await api.search(search);

    res.render(`search`, {
      results,
      search
    });
  } catch (error) {
    res.render(`search`, {
      results: [],
      search
    });
  }
};

const showLogin = (req, res) => {
  res.render(`login`);
};

const showRegister = (req, res) => {
  res.render(`sign-up`);
};

module.exports = {
  showMain,
  showSearch,
  showLogin,
  showRegister,
};
