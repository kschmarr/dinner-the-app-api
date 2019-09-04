const app = require("../src/app");
const expect = require("chai").expect;
const request = require("supertest");
const knex = require("knex");
const fixtures = require("./meals-fixtures");

describe("Dinner App", () => {
  it("GET / should return a message", () => {
    return request(app)
      .get("/")
      .expect(200, "Hello, Kris!");
  });
});
describe("Dinner App", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => db("dinner_meals").truncate());

  afterEach("cleanup", () => db("dinner_meals").truncate());

  describe("GET /meals", () => {
    context(`If tables are empty`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/meals")
          .expect(200, []);
      });
    });

    context("Given there are meals in the database", () => {
      const testmeals = fixtures.makeMealsArray();

      beforeEach("insert meals", () => {
        return db.into("dinner_meals").insert(testmeals);
      });

      it("gets the meals from the store", () => {
        return supertest(app)
          .get("/meals")
          .expect(200, testmeals);
      });
    });
  });

  describe("GET /meals/:id", () => {
    context(`Given no meals`, () => {
      it(`responds 404 the meals doesn't exist`, () => {
        return supertest(app)
          .get(`/meals/123`)
          .expect(404, {
            error: { message: `Meal Not Found` }
          });
      });
    });

    context("Given there are meals in the database", () => {
      const testmeals = fixtures.makeMealsArray();

      beforeEach("insert meals", () => {
        return db.into("meals").insert(testmeals);
      });

      it("responds with 200 and the specified Meal", () => {
        const mealId = 2;
        const expectedMeal = testmeals[mealId - 1];
        return supertest(app)
          .get(`/meals/${mealsId}`)
          .expect(200, expectedMeal);
      });
    });
  });

  describe("DELETE /meals/:id", () => {
    context("Given there are meals in the database", () => {
      const testmeals = fixtures.makeMealsArray();

      beforeEach("insert meals", () => {
        return db.into("meals").insert(testmeals);
      });

      it("removes the meals by ID from the store", () => {
        const idToRemove = 2;
        const expectedmeals = testmeals.filter(m => m.id !== idToRemove);
        return supertest(app)
          .delete(`/meals/${idToRemove}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/meals`)
              .expect(expectedmeals)
          );
      });
    });
  });

  describe("POST /meals", () => {
    it("adds a new meals to the store", () => {
      const newMeal = {
        meal: "test-title",
        rotation: "test"
      };
      return supertest(app)
        .post(`/meals`)
        .send(newMeal)
        .expect(201)
        .expect(res => {
          expect(res.body.meal).to.eql(newMeal.meal);
          expect(res.body.rotation).to.eql(newMeal.rotation);
        })
        .then(res =>
          supertest(app)
            .get(`/meals/${res.body.id}`)
            .expect(res.body)
        );
    });
  });
});
