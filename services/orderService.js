const { connection } = require("../db/dbConnection");
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const getCartByID = async (cartid) => {
  const cart = await query("SELECT * FROM orders WHERE id = ?", [cartid]);
  return cart[0];
};
///////
const createOrder = async (orderid, oderPrice, paymentMethod, orderAddress) => {
  let dateToday = new Date().toISOString();
  dateToday = dateToday.replace("T", " ");
  dateToday = dateToday.substring(0, 19);
  const cart = await query(
    `UPDATE orders SET paymentMethod = ?,total=?,address=?,order_date='${dateToday}',status='CREATED' WHERE id = ?`,
    [paymentMethod, oderPrice, orderAddress, orderid],
  );
  return cart;
};
// get orders for user
const getOrders = async (userId) => {
  const orders = await query(
    "SELECT id,address,status,order_date,paymentMethod,total FROM orders WHERE userId=? and status ='CREATED' OR status ='SHIPPED' ORDER BY order_date DESC",
    [userId],
  );
  return orders;
};
// get order items
const getOrderItems = async (orderId) => {
  var cart_items = await query(
    `SELECT d.id,d.quantity,d.price,d.size,s.name,s.image FROM orderitems d  JOIN dishes s ON d.dishId=s.id WHERE d.orderId=?`,
    [orderId],
  );
  cart_items = cart_items.map((item) => {
    item.image = process.env.SERVER_HOST + item.image;
    return item;
  });
  return cart_items;
};
// update order to delivered
const orderDelivered = async (orderId, delivery_id) => {
  let dateToday = new Date().toISOString();
  dateToday = dateToday.replace("T", " ");
  dateToday = dateToday.substring(0, 19);
  const order = await query(
    `UPDATE orders SET status='DELIVERED',delivered_date='${dateToday}',delivery_id=? WHERE id=?`,
    [delivery_id, orderId],
  );
  return order;
};
// update order to shipped to prevent cancel order
const orderShipped = async (orderId) => {
  const order = await query(`UPDATE orders SET status='SHIPPED' WHERE id=?`, [
    orderId,
  ]);
  return order;
};
// cancel order
const cancelOrder = async (orderId) => {
  await query("DELETE FROM orderitems WHERE orderId=?", [orderId]);
  const deleteOrder = await query("DELETE FROM orders WHERE id=?", [orderId]);
  return deleteOrder;
};
module.exports = {
  getCartByID,
  createOrder,
  getOrders,
  getOrderItems,
  orderDelivered,
  cancelOrder,
  orderShipped,
};
