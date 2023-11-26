const {
  getCart,
  checkFoundCart,
  addCart,
  getDish,
  getDishInOrderItem,
  insertItem,
  updateItem,
  calcTotalPrice,
  getDishInCartItemByID,
  deleteItem,
} = require("../services/cartService");
const { nanoid } = require("nanoid");


const Cart = async (req, res) => {
  try {
    const cart = await getCart(req.user.id);
    return res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
// add new item to cart or increase quantity of item cart
const addItemCart = async (req, res) => {
  try {
    const checkCart = await checkFoundCart(req.user.id);
    // console.log(checkCart);
    var nId;

    if (!checkCart) {
      nId = nanoid(10);
      await addCart(nId, req.user.id);
    } else {
      nId = checkCart.id;
    }
    const dish = await getDish(req.params.dishId);
    // console.log(dish);
    if (!dish.length) {
      return res.status(404).json({ msg: "dish not found" });
    }

    if (!dish[0].stock) {
      return res.status(400).json({ msg: "dish not found in menu" });
    }
    // console.log(nId);
    const orderDish = await getDishInOrderItem(
      req.params.dishId,
      nId,
      req.body.size,
    );
    if (!orderDish.length) {
      req.body.price = req.body.quantity * dish[0].price;
      await insertItem(req.params.dishId, nId, req.body);
    } else {
      req.body.quantity = orderDish[0].quantity + req.body.quantity;
      req.body.price = req.body.quantity * dish[0].price;
      await updateItem(orderDish[0].id, req.body);
    }
    await calcTotalPrice(nId);
    return res.status(200).json({ msg: "add successfuly" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
const deleteItemCart = async (req, res) => {
  try {
    const item = await getDishInCartItemByID(req.params.id);
    // return res.status(200).json(item);
    if (!item.length) {
      return res.status(404).json({ msg: "No dishes with id in cart" });
    }
    await deleteItem(req.params.id);
    await calcTotalPrice(item[0].orderId);
    return res.status(200).json();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
const updateItemCart = async (req, res) => {
  try {
    // get dish in cart item
    const item = await getDishInCartItemByID(req.params.id);
    if (!item.length) {
      return res.status(404).json({ msg: "No dishes with id in cart" });
    }
    if (req.body.quantity <= 0) {
      return res
        .status(400)
        .json({ msg: "quantity must greater than or equal 1" });
    }
    // get dish in dish database for price
    const dish = await getDish(item[0].dishId);
    if (!dish.length) {
      return res.status(404).json({ msg: "dish not found" });
    }
    // update item cart
    req.body.price = req.body.quantity * dish[0].price;
    await updateItem(req.params.id, req.body);
    // increase or dec stock
    // if (item[0].quantity > req.body.quantity) {
    //   const newQuantity = item[0].quantity - req.body.quantity;
    //   await increaseStock(item[0].dishId, newQuantity);
    // } else if (item[0].quantity < req.body.quantity) {
    //   const newQuantity = req.body.quantity - item[0].quantity;
    //   await decreaseStock(item[0].dishId, newQuantity);
    // }
    // calcTotalPrice
    await calcTotalPrice(item[0].orderId);
    return res.status(200).json({ msg: "update cart successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
module.exports = { Cart, addItemCart, deleteItemCart, updateItemCart };
