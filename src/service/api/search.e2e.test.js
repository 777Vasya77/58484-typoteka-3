'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {createUser} = require(`../cli/factories/user-factory`);
const {getRandomInt} = require(`../../utils`);
const {HttpCode, USER_ROLES} = require(`../../constants`);

const mockCategories = [
  {
    id: 1,
    name: `Деревья`,
  },
  {
    id: 2,
    name: `За жизнь`
  },
  {
    id: 3,
    name: `Без рамки`
  },
  {
    id: 4,
    name: `Разное`
  }
];

const mockArticles = [
  {
    "title": `Как собрать камни бесконечности new`,
    "publishedAt": `2021-03-20 09:32:01`,
    "announce": `Программировать не настолько сложно, как об этом говорят. Программировать не настолько сложно, как об этом говорят new. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Достичь успеха помогут ежедневные повторения new. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами new. Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много new. Золотое сечение — соотношение двух величин, гармоническая пропорция new. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами new. Простые ежедневные упражнения помогут достичь успеха new. Это один из лучших рок-музыкантов new. Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят new. Ёлки — это не просто красивое дерево. Это прочная древесина. Это один из лучших рок-музыкантов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры new. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете new. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов new. Собрать камни бесконечности легко, если вы прирожденный герой new. Ёлки — это не просто красивое дерево. Это прочная древесина new. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем new. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать new.`,
    "categories": [1, 2, 3],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Планируете записать видосик на эту тему Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    "title": `Title`,
    "publishedAt": `2020-02-10 09:32:01`,
    "announce": `test announce`,
    "fullText": `test full text`,
    "categories": [2, 3],
    "comments": [
      {
        "text": `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Планируете записать видосик на эту тему Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  const roles = USER_ROLES.map((title) => ({title}));
  const users = Array.from({length: 5}).map(() => createUser({
    roleId: getRandomInt(1, roles.length),
  }));
  const categoriesName = mockCategories.map(({name}) => name);

  await initDB(mockDB, {categories: categoriesName, articles: mockArticles, roles, users});
  search(app, new DataService(mockDB));
});


describe(`service/api/search.js`, () => {

  describe(`API returns offer based on search query`, () => {

    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/search`)
        .query({
          query: `Как собрать камни`
        });
    });

    it(`Status code 200`, () => {
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    it(`1 offer found`, () => {
      expect(response.body.length).toBe(1);
    });

    it(`Offer has correct title`, () => {
      expect(response.body[0].title).toBe(`Как собрать камни бесконечности new`);
    });

  });

  it(`API returns code 404 if nothing is found`, async () => {
    const response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам свою душу`
      });

    expect(response.statusCode).toBe(HttpCode.NOT_FOUND);
  });

  it(`API returns code 400 if query is not pass`, async () => {
    const response = await request(app)
      .get(`/search`);

    expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
  });
});
