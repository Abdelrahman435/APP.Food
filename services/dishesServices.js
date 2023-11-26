const { connection } = require("../db/dbConnection");
const util = require("util");

exports.getTopDishes = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT d.*, AVG(rr.rating) as avg_rating, COUNT(rr.productId) AS totalReviews FROM dishes d JOIN reviews rr ON d.id = rr.productId WHERE d.id IN (SELECT productId FROM reviews) GROUP BY d.id ORDER BY avg_rating DESC"
  );
};

exports.classificationOfDishes = async (category) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT d.*, AVG(rr.rating) as avg_rating, COUNT(rr.productId) AS totalReviews FROM dishes d  LEFT JOIN reviews rr ON d.id = rr.productId WHERE d.category = ? GROUP BY d.id ORDER BY avg_rating DESC LIMIT 10",
    [category]
  );
};

exports.topSeller = async () => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT d.*, AVG(rr.rating) AS avg_rating ,COUNT(rr.productId) AS totalReviews, COUNT(o.dishId) AS order_count FROM dishes d JOIN reviews rr ON d.id = rr.productId JOIN orderitems o ON d.id = o.dishId WHERE d.id IN (SELECT productId FROM reviews)GROUP BY d.id ORDER BY order_count DESC LIMIT 10"
  );
};

exports.search = async (search) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(`SELECT d.*, AVG(rr.rating) as avg_rating, COUNT(rr.productId) AS totalReviews FROM dishes d LEFT JOIN reviews rr ON d.id = rr.productId WHERE d.name LIKE '%${search}%' OR d.category LIKE '%${search}%' GROUP BY d.id ORDER BY avg_rating DESC`);
}

exports.productDetails = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("SELECT d.*, AVG(rr.rating) AS avg_rating, COUNT(rr.productId) AS totalReviews FROM dishes d LEFT JOIN reviews rr ON d.id = rr.productId WHERE d.id = ? GROUP BY d.name, d.price, d.stock, d.image, d.category ORDER BY avg_rating DESC", [id]);
}