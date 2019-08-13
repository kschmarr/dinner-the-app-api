BEGIN;

TRUNCATE
  dinner_meals,
  dinner_users
  RESTART IDENTITY CASCADE;

INSERT INTO dinner_users (username, token, meal_index, short_index, medium_index, long_index)
VALUES
  ('kris', 'a3JpczpsdWNreQ==', 1, 1, 1, 1),
  ('alex', 'YWxleDpzdHJvbmc=', 1, 1, 1, 1),
  ('andy', 'YW5keTpzdHJldGNoeQ==', 4, 3, 2, 1)
  ;


INSERT INTO dinner_meals (meal, userid, rotation)
VALUES
  ('Curry', '1', 'short' ),
  ('Chili', '1', 'short' ),
  ('Salad', '1', 'short' ),
  ('Steak', '1', 'short' ),
  ('Yakisoba', '1', 'medium' ),
  ('Ramen', '1', 'medium' ),
  ('Sushi', '1', 'medium' ),
  ('Meatloaf', '1', 'medium' ),
  ('Burger', '1', 'long' ),
  ('Pancakes', '1', 'long' ),
  ('Fried Rice', '1', 'long' ),
  ('Eggplant Parmesan', '1', 'long' ),
  ('Curry', '2', 'short' ),
  ('Chili', '2', 'short' ),
  ('Salad', '2', 'short' ),
  ('Steak', '2', 'short' ),
  ('Yakisoba', '2', 'medium' ),
  ('Ramen', '2', 'medium' ),
  ('Sushi', '2', 'medium' ),
  ('Meatloaf', '2', 'medium' ),
  ('Burger', '2', 'long' ),
  ('Pancakes', '2', 'long' ),
  ('Fried Rice', '2', 'long' ),
  ('Eggplant Parmesan', '2', 'long' ),
  ('Curry', '3', 'short' ),
  ('Chili', '3', 'short' ),
  ('Salad', '3', 'short' ),
  ('Steak', '3', 'short' ),
  ('Yakisoba', '3', 'medium' ),
  ('Ramen', '3', 'medium' ),
  ('Sushi', '3', 'medium' ),
  ('Meatloaf', '3', 'medium' ),
  ('Burger', '3', 'long' ),
  ('Pancakes', '3', 'long' ),
  ('Fried Rice', '3', 'long' ),
  ('Eggplant Parmesan', '3', 'long' );


COMMIT;