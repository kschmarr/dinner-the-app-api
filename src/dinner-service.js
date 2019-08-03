const dinnerService = {
  getAllMeals(knex) {
    return knex.select("*").from("dinner_meals");
  },
  updateMeal(knex, mealid, new_meal_fields) {
    return knex("dinner_meals")
      .where({ mealid })
      .update(new_meal_fields);
  },
  deleteMeal(knex, mealid) {
    return knex("dinner_meals")
      .where({ mealid })
      .delete();
  },
  insertMeal(knex, new_meal) {
    return knex
      .insert(new_meal)
      .into("dinner_meals")
      .returning("*")
      .then(rows => {
        return rows;
      });
  },
  getOneMeal(knex, name) {
    return knex
      .from("dinner_meals")
      .select("*")
      .where("name", name)
      .first();
  },
  getAllUsers(knex) {
    return knex.select("*").from("dinner_users");
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
  updateUser(knex, id, new_user_fields) {
    return knex("dinner_users")
      .where({ id })
      .update(new_user_fields);
  }
};

module.exports = dinnerService;
