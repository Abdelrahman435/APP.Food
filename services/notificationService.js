const { connection } = require("../db/dbConnection");
const util = require("util");

exports.notification = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query(
    "SELECT orders.order_date, orderitems.dishId, dishes.name, dishes.image FROM orders JOIN orderitems ON orderitems.orderId = orders.id JOIN dishes ON dishes.id = orderitems.dishId WHERE orders.userId = ? AND orders.status = 'PENDING' GROUP BY orders.order_date, orderitems.dishId, dishes.name, dishes.image",
    [id]
  );
};
