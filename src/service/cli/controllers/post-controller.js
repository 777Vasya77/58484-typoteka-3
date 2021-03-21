'use strict';

const ReadFileService = require(`../services/read-file-service`);
const {MOCKS_FILE_NAME} = require(`../../../constants`);

const showPosts = async (req, res) => {
  const readFileService = new ReadFileService(MOCKS_FILE_NAME);

  try {
    const mocks = await readFileService.getJSON();
    res.json(mocks);
  } catch (err) {
    const {code, message} = readFileService.parseError(err);
    res
      .status(code)
      .send(message);
  }
};

module.exports = {
  showPosts,
};
