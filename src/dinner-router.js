const express = require("express");
const xss = require("xss");
const logger = require("./logger");
const dinnerService = require("./dinner-service");

const dinnerRouter = express.Router();
const bodyParser = express.json();

const serializeUser = user => ({
  name: xss(user.name),
  userid: xss(user.userid)
});

const serializeMeal = meal => ({
  name: xss(meal.name),
  rotation: xss(meal.rotation),
  userid: xss(meal.userid)
});

dinnerRouter
  .route("/main")
  .get((req, res, next) => {
    dinnerService
      .getAllMeals(req.app.get("db"))
      .then(meals => {
        res.json(meals.map(serializeMeal));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["name", "rotation"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const { name } = req.body;

    const newUser = { name };

    dinnerService
      .insertUser(req.app.get("db"), newUser)
      .then(user => {
        res
          .status(201)
          .location(`/users/${user.userid}`)
          .json(user[0]);
      })
      .catch(next);
  });

dinnerRouter
  .route("/list")
  .get((req, res, next) => {
    dinnerService
      .getAllMeals(req.app.get("db"))
      .then(meals => {
        res.json(meals.map(serializeMeal));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["name", "rotation", "userid"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const { name, rotation, userid } = req.body;

    const newMeal = { name, rotation, userid };
    dinnerService
      .insertMeal(req.app.get("db"), newMeal)
      .then(meal => {
        logger.info(`Meal with id ${meal.mealid} created.`);
        res
          .status(201)
          .location(`/meals/${meal.mealid}`)
          .json(meal);
      })
      .catch(next);
  });

dinnerRouter
  .route("/edit-meal/:mealid")
  .all((req, res, next) => {
    const { mealid } = req.params;
    dinnerService
      .getOneMeal(req.app.get("db"), mealid)
      .then(meal => {
        if (!meal) {
          logger.error(`Meal with id ${mealid} not found.`);
          return res.status(404).json({
            error: { message: `meal Not Found` }
          });
        }
        res.meal = meal;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeMeal(res.meal));
  })
  .delete((req, res, next) => {
    // TODO: update to use db
    const { mealid } = req.params;

    dinnerService
      .deleteMeal(req.app.get("db"), mealid)
      .then(() => {
        logger.info(`Meal with id ${mealid} deleted.`);
        res.status(200).json({ mealid: mealid });
      })
      .catch(next);
  });

module.exports = dinnerRouter;
