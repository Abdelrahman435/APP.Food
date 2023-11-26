const {
  getCartByID,
  createOrder,
  getOrders,
  getOrderItems,
  orderDelivered,
  cancelOrder,
  orderShipped,
} = require("../services/orderService");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.getOrdersUser = async (req, res) => {
  try {
    const orders = await getOrders(req.user.id);
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
// get specific order
exports.getSpecificOrder = async (req, res) => {
  try {
    const order = await getCartByID(req.params.cartId);
    // console.log(order);
    if (!order || order.status == "PENDING") {
      return res.status(404).json({ msg: "no Order found" });
    }
    const orderItems = await getOrderItems(req.params.cartId);
    return res.status(200).json({ order, order_Items: orderItems });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
// @desc    create cash order
// @route   POST /api/v1/orders/cartId
// @access  Protected/User
exports.createCashOrder = async (req, res, next) => {
  try {
    // 1) Get cart depend on cartId
    const cart = await getCartByID(req.params.cartId);
    if (!cart || cart.status != "PENDING") {
      return res.status(404).json({ msg: "cart not found" });
    }

    if (req.user.id != cart.userId) {
      return res.status(401).json({ msg: "can not apply this order" });
    }
    // 2) Get order price depend on cart price "Check if coupon apply"

    // 3) Create order with  paymentMethodType cash
    const order = await createOrder(
      req.params.cartId,
      cart.total,
      "CASH",
      req.body.shippingAddress,
    );
    // 4) After creating order, decrement product quantity, increment product sold

    res.status(201).json({ msg: "success create order" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};

// @desc    Update order delivered status
// @route   PUT /orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    // get order by id
    const order = await getCartByID(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "no Order found" });
    }
    if (order.status == "DELIVERED") {
      return res.status(400).json({ msg: "order already delivered" });
    }
    // update order to paid
    await orderDelivered(req.params.id, req.user.id);
    res.status(200).json({ msg: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
// @desc    Update order shipped status
// @route   PUT /orders/:id/shipped
// @access  Protected/Admin-Manager
exports.updateOrderToShipped = async (req, res, next) => {
  try {
    // get order by id
    const order = await getCartByID(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "no Order found" });
    }
    if (order.status == "DELIVERED") {
      return res.status(400).json({ msg: "order already delivered" });
    }
    // update order to paid
    await orderShipped(req.params.id);
    res.status(200).json({ msg: "success updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
// @desc    Get checkout session from stripe and send it as response
// @route   GET /api/v1/orders/checkout-session/cartId
// @access  Protected/User
exports.checkoutSession = async (req, res, next) => {
  try {
    // 1) Get cart depend on cartId
    // console.log(req.user);
    // const user = await getUsers();
    const cart = await getCartByID(req.params.cartId);
    // check if found
    if (!cart || cart.status != "PENDING") {
      return res.status(404).json({ msg: "cart not found" });
    }
    console.log(process.env.STRIPE_SECRET);
    console.log(cart);
    // check if order id own by user
    if (req.user.id != cart.userId) {
      return res.status(401).json({ msg: "can not apply this order" });
    }
    // 2) Get order price depend on cart price "Check if coupon apply"
    const totalOrderPrice = cart.total;

    // 3) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "egp",
            unit_amount: totalOrderPrice * 100,
            product_data: {
              name: req.user.fullname,
              // name: user.fullname,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.PAYMENT_SUCCESS_URL,
      cancel_url: process.env.PAYMENT_FAIL_URL,
      customer_email: req.user.email,
      // customer_email: user.email,
      client_reference_id: req.params.cartId,
      metadata: req.body,
    });

    // 4) send session to response
    res
      .status(200)
      .json({ msg: "success create session", session_url: session.url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata.shippingAddress;
  const orderPrice = session.amount_total / 100;

  // 3) Create order with default paymentMethodType card
  const order = await createOrder(
    cartId,
    orderPrice,
    "CREDIT",
    shippingAddress,
  );
  return;
  // 4) After creating order, decrement product quantity, increment product sold
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (event.type === "checkout.session.completed") {
      //  Create order
      await createCardOrder(event.data.object);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// cancel order
exports.cancelOrders = async (req, res) => {
  try {
    const order = await getCartByID(req.params.cartId);
    // console.log(order);
    if (!order || order.status == "PENDING") {
      return res.status(404).json({ msg: "no order found" });
    } else if (req.user.id != order.userId) {
      return res.status(401).json({ msg: "you are not allow" });
    } else if (order.status != "CREATED" || order.paymentMethod != "CASH") {
      return res.status(400).json({ msg: "can not apply this opreation" });
    }
    await cancelOrder(req.params.cartId);
    res.status(200).json({ msg: "success cancel order" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Failed process" });
  }
};
