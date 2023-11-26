const historyServices = require("../services/historyServices");

exports.historOrders = async (req, res) => {
  try {
    const history = await historyServices.history(req.params.userId);
    if (!history.length > 0) {
      return res.status(400).json("not found Historys");
    }
    history.map((order) => {
      order.image = "https://food-app-dashboard.onrender.com/" + order.image;
    });
    return res.status(200).json(history);
  } catch (err) {
    console.log(err);
    res.status(500).json("error");
  }
};
