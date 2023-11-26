const { connection } = require("../db/dbConnection");
const util = require("util");

exports.history = async (id) => {
    const query = util.promisify(connection.query).bind(connection);
    return await query(
      "SELECT orders.order_date, orders.id, orders.address, orders.paymentMethod, orders.total, orderitems.dishId, dishes.name, dishes.image FROM orders LEFT JOIN orderitems ON orderitems.orderId = orders.id LEFT JOIN dishes ON dishes.id = orderitems.dishId WHERE orders.userId = ? AND orders.status = 'DELIVERED' GROUP BY orders.order_date, orderitems.dishId, dishes.name, dishes.image, orders.paymentMethod, orders.total, orders.id, orders.address",
      [id]
    );
  };
