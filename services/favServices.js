const { connection } = require("../db/dbConnection");
const util = require("util");

async function getDish(data) {
  const query = util.promisify(connection.query).bind(connection);
  const dish = await query("SELECT * FROM dishes WHERE id = ?", [data]);
  return dish.length > 0;
}

async function checkFav(dish, user) {
  const query = util.promisify(connection.query).bind(connection);
  const check = await query(
    "SELECT * FROM favorites WHERE dishId = ? AND userId = ?",
    [user, dish]
  );
  return check.length > 0;
}

async function checkFav2(userId, dishId) {
  const query = util.promisify(connection.query).bind(connection);
  const check = await query(
    "SELECT * FROM favorites WHERE userId = ? and dishId = ?",
    [userId, dishId]
  );
  console.log(check.length);
  return check.length > 0;
}

async function getUserById(data) {
  const query = util.promisify(connection.query).bind(connection);
  const user = await query("SELECT * FROM users WHERE id = ?", [data]);
  return user.length > 0;
}

async function addFavDish(data) {
  const query = util.promisify(connection.query).bind(connection);
  const state = await query("INSERT INTO favorites SET ?", [data]);
  return state;
}

async function removeFavDish(userId, dishId) {
  const query = util.promisify(connection.query).bind(connection);
  const state = await query(
    "DELETE from favorites where userId = ? and dishId = ?",
    [userId, dishId]
  );
  return state;
}

async function getFav(id) {
  const query = util.promisify(connection.query).bind(connection);
  const state = await query("SELECT * from favorites where userId = ?", [[id]]);
  return state;
}

module.exports = {
  addFavDish,
  removeFavDish,
  getDish,
  getUserById,
  checkFav,
  checkFav2,
  getFav,
};
