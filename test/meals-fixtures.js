function makeMealsArray() {
  return [
    {
      meal: "Thinkful",
      userid: "1",
      rotation: "short"
    },
    {
      meal: "Beans",
      userid: "2",
      rotation: "medium"
    },
    {
      meal: "beef",
      userid: "3",
      rotation: "long"
    }
  ];
}
function makeUsersArray() {
  return [
    {
      username: "Thinkful",
      token: "4rfghiytrfghitrd",
      meal_index: 1,
      short_index: 1,
      medium_index: 1,
      long_index: 1
    },
    {
      username: "Alex",
      token: "4rfghiytrfghitrd",
      meal_index: 2,
      short_index: 2,
      medium_index: 2,
      long_index: 2
    },
    {
      username: "Roberto",
      token: "4rfghiytrfghitrd",
      meal_index: 3,
      short_index: 3,
      medium_index: 3,
      long_index: 3
    }
  ];
}

module.exports = {
  makeMealsArray,
  makeUsersArray
};
