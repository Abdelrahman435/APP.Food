const { nanoid } = require("nanoid");

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

///////
const addCart = async (cartId, userid) => {
  const newCart = await query("insert into orders (id,userid) value (?,?)", [
    cartId,
    userid,
  ]);
  return newCart;
};

///
const checkFoundCart = async (userid) => {
  const checkCart = await query(
    "select * from orders where userid=? and status='PENDING'",
    [userid],
  );

  return checkCart[0];
};
//get dish from database
const getDish = async (dishId) => {
  const dish = await query("SELECT price,stock FROM dishes WHERE id=?", [
    dishId,
  ]);
  return dish;
};
// get dish that add to cart
const getDishInOrderItem = async (dishId, orderId, size) => {
  return await query(
    "SELECT id,quantity,size FROM orderitems WHERE dishId=? and orderId = ? and size= ?",
    [dishId, orderId, size],
  );
};
// insert item to database
const insertItem = async (dishId, cartId, body) => {
  var itemId = nanoid(10);
  const cartItem = await query(
    "INSERT INTO orderitems (id, orderId, dishId, quantity, price, size) VALUES (?,?,?,?,?,?)",
    [itemId, cartId, dishId, body.quantity, body.price, body.size],
  );
  return cartItem;
};
// update quantity and price of cart item
const updateItem = async (orderItemId, body) => {
  const cartItem = await query(
    "UPDATE orderitems SET quantity = ?,price=? WHERE id = ?",
    [body.quantity, body.price, orderItemId],
  );
  return cartItem;
};
// calculate total price
const calcTotalPrice = async (orderId) => {
  const total_price = await query(
    "SELECT SUM(price) as total_price FROM orderitems where orderId=?",
    [orderId],
  );
  const total = total_price[0].total_price || 0;
  const cartItem = await query("UPDATE orders SET total=? WHERE id = ?", [
    total,
    orderId,
  ]);
  return cartItem;
};
//get user cart
const getCart = async (userid) => {
  const checkCart = await checkFoundCart(userid);
  // console.log(checkCart);
  if (!checkCart) {
    const nId = nanoid(10);
    await addCart(nId, userid);
    return { cart: nId, dish_items: [], total_price: 0 };
  }

  const cartId = checkCart.id;
  var cart_items = await query(
    `SELECT d.id,d.quantity,d.price,d.size,s.name,s.image,s.stock FROM orderitems d  JOIN dishes s ON d.dishId=s.id WHERE d.orderId=?`,
    [cartId],
  );
  cart_items = cart_items.map((item) => {
    item.image = process.env.SERVER_HOST + item.image;
    return item;
  });
  return {
    cart_id: cartId,
    dish_items: cart_items,
    total_price: checkCart.total || 0,
  };
};
// get Dish In OrderItem databae by id
const getDishInCartItemByID = async (itemId) => {
  const item = await query(
    "SELECT quantity,dishId,orderId FROM orderitems WHERE id=?",
    [itemId],
  );
  return item;
};
// delete item from cart + increse stock and recalc price
const deleteItem = async (itemId) => {
  const item = await query("DELETE FROM orderitems WHERE id=?", [itemId]);
  return item;
};
// //update cart item
// const updateItem=async()=>{

// }
module.exports = {
  getCart,
  checkFoundCart,
  insertItem,
  getDish,
  addCart,
  getDishInOrderItem,
  updateItem,
  calcTotalPrice,
  deleteItem,
  getDishInCartItemByID,
};
