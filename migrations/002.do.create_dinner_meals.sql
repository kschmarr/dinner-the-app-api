CREATE TABLE dinner_meals (
    mealid INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    meal TEXT NOT NULL,
    rotation TEXT NOT NULL,
    userid INTEGER REFERENCES dinner_users(userid) ON DELETE CASCADE NOT NULL,
    date_last_eaten DATE NOT NULL DEFAULT '0001-01-01'
);