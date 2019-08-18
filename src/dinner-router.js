const express = require("express");
const xss = require("xss");
const logger = require("./logger");
const dinnerService = require("./dinner-service");
const { requireAuth } = require("./middleware/basic-auth");
const jsonParser = express.json();
const dinnerRouter = express.Router();
const bodyParser = express.json();

const serializeUser = user => ({
  username: xss(user.username),
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
  .route("/edit-meal/:mealid")
  .all((req, res, next) => {
    const { mealid } = req.params;
    dinnerService
      .getOneMeal(req.app.get("db"), mealid)
      .then(meal => {
        if (!meal) {
          logger.error(`Meal not found.`);
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

      .then(meal => {
        logger.info(`Meal with id ${mealid} deleted.`);
        res.status(200).json({ mealid: mealid });
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { meal, rotation, date_last_eaten } = req.body;
    const { mealid } = req.params;

    const mealToUpdate = { meal, rotation, date_last_eaten };

    const numberOfValues = Object.values(mealToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain an change for either meal, date_last_eaten, or rotation`
        }
      });

    dinnerService
      .updateMeal(req.app.get("db"), mealid, mealToUpdate)
      .then(e => {
        res
          .status(201)
          .location(`/meals/${mealid}`)
          .json(e[0]);
      })
      .catch(next);
  });

dinnerRouter
  .route("/users")
  .get((req, res, next) => {
    dinnerService
      .getAllUsers(req.app.get("db"))
      .then(users => {
        res.status(201).json(users);
      })

      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ["username", "token"]) {
      if (!req.body[field]) {
        logger.error(`${field} is required`);
        return res.status(400).send(`'${field}' is required`);
      }
    }

    const newUser = req.body;

    dinnerService
      .insertUser(req.app.get("db"), newUser)
      .then(user => {
        if (!user) {
          logger.error(`user not found.`);
          return res.status(404).json({
            error: { message: `User Not Found` }
          });
        }
        res
          .status(201)
          .location(`/users/${newUser.username}`)
          .json(user[0]);
      })
      .catch(next);
  });

dinnerRouter
  .route("/users/:userid")
  .all((req, res, next) => {
    const { userid } = req.params;
    dinnerService
      .getOneUser(req.app.get("db"), userid)
      .then(user => {
        if (!user) {
          logger.error(`user not found.`);
          return res.status(404).json({
            error: { message: `User Not Found` }
          });
        }

        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    const { userid } = req.params;

    dinnerService
      .deleteUser(req.app.get("db"), userid)
      .then(() => {
        logger.info(`User with id ${userid} deleted.`);
        res.status(200).json({ userid: userid });
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { meal_index, short_index, medium_index, long_index } = req.body;
    const { userid } = req.params;

    const userToUpdate = { meal_index, short_index, medium_index, long_index };
    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain an change for either meal_index, short_index, medium_index, or long_index`
        }
      });

    dinnerService
      .updateUser(req.app.get("db"), userid, userToUpdate)
      .then(e => {
        res
          .status(201)
          .location(`/users/${userid}`)
          .json(e[0]);
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
