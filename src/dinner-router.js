const express = require("express");
const xss = require("xss");
const logger = require("./logger");
const dinnerService = require("./dinner-service");
const { requireAuth } = require("./middleware/basic-auth");

const dinnerRouter = express.Router();
const bodyParser = express.json();

const serializeUser = user => ({
  name: xss(user.name),
  userid: xss(user.userid),
  token: xss(user.token),
  meal_index: xss(user.meal_index),
  short_index: xss(user.short_index),
  medium_index: xss(user.medium_index),
  long_index: xss(user.long_index)
});

const serializeMeal = meal => ({
  meal: xss(meal.meal),
  rotation: xss(meal.rotation),
  userid: xss(meal.userid),
  date_last_eaten: xss(meal.date_last_eaten),
  mealid: xss(meal.mealid)
});

dinnerRouter
  .route("/meals")
  .get((req, res, next) => {
    dinnerService
      .getAllMeals(req.app.get("db"))
      .then(meals => {
        res.json(meals.map(serializeMeal));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["meal", "rotation"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const meal = req.body;

    dinnerService
      .insertMeal(req.app.get("db"), meal)
      .then(meal => {
        res
          .status(201)
          .location(`/meals/${meal.meal}`)
          .json(meal[0]);
      })
      .catch(next);
  });

dinnerRouter
  .route("/users")
  .get((req, res, next) => {
    dinnerService
      .getAllUsers(req.app.get("db"))
      .then(users => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["name", "password"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const { name } = req.body;

    dinnerService
      .insertUser(req.app.get("db"), user)
      .then(user => {
        res
          .status(201)
          .location(`/users/${user.name}`)
          .json(user[0]);
      })
      .catch(next);
  });
dinnerRouter.route("/users/:name").get((req, res, next) => {
  const { name } = req.params;

  dinnerService
    .getOneUser(req.app.get("db"), name)
    .then(user => {
      if (!user) {
        logger.error(`User with name ${name} not found.`);
        return res.status(404).json({
          error: { message: `User Not Found` }
        });
      }
      res.json(serializeUser(user));
    })
    .catch(next);
});

dinnerRouter
  .route("/edit-meal/:meal")
  .all((req, res, next) => {
    const { meal } = req.params;
    dinnerService
      .getOneMeal(req.app.get("db"), meal)
      .then(meal => {
        if (!meal) {
          logger.error(`Meal with name ${meal} not found.`);
          return res.status(404).json({
            error: { message: `Meal Not Found` }
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
    const { mealid } = req.params;

    dinnerService
      .deleteMeal(req.app.get("db"), mealid)
      .then(() => {
        logger.info(`Meal with id ${mealid} deleted.`);
        res.status(200).json({ mealid: mealid });
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    for (const field of ["meal", "rotation"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const meal = req.body;

    dinnerService
      .updateMeal(req.app.get("db"), meal, [...meal])
      .then(meal => {
        res
          .status(201)
          .location(`/meals/${meal.meal}`)
          .json(meal[0]);
      })
      .catch(next);
  });

// async function checkMealExists(req, res, next) {
//   try {
//     const meal = await dinnerService.getById(
//       req.app.get("db"),
//       req.params.name
//     );

//     if (!meal)
//       return res.status(404).json({
//         error: `Meal doesn't exist`
//       });

//     res.meal = meal;
//     next();
//   } catch (error) {
//     next(error);
//   }

module.exports = dinnerRouter;
