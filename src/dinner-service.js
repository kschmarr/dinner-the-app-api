const dinnerService = {
  getAllMeals(knex) {
    return knex.select("*").from("dinner_meals");
  },
  getById(knex, id) {
    return knex("dinner_meals")
      .where("mealid", id)
      .first();
  },
  updateMeal(knex, mealid, new_meal_fields) {
    return knex("dinner_meals")
      .where({ mealid })
      .update(new_meal_fields)
      .returning("*");
  },
  deleteMeal(knex, mealid) {
    return knex("dinner_meals")
      .where({ mealid })
      .del()
      .returning("*");
  },
  insertMeal(knex, new_meal) {
    return knex
      .insert(new_meal)
      .into("dinner_meals")
      .returning("*");
  },
  getOneMeal(knex, id) {
    return knex
      .from("dinner_meals")
      .select("*")
      .where("mealid", id)
      .first();
  },
  getAllUsers(knex) {
    return knex.select("*").from("dinner_users");
  },
  getOneUser(knex, token) {
    return knex
      .from("dinner_users")
      .select("*")
      .where({ token })
      .first();
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("dinner_users")
      .returning("*")
      .then(rows => {
        return rows;
      });
  },
  updateUser(knex, userid, new_user_fields) {
    return knex("dinner_users")
      .where({ userid })
      .update(new_user_fields)
      .returning("*");
  },
  deleteUser(knex, userid) {
    return knex("dinner_users")
      .where({ userid })
      .del();
  }
};

module.exports = dinnerService;
