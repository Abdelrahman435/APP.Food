const { error } = require("console");
const {
  addFavDish,
  removeFavDish,
  getDish,
  getUserById,
  checkFav,
  checkFav2,
  getFav,
} = require("../services/favServices");
const { nanoid } = require("nanoid");

async function addFavController(req, res) {
  try {
    if (!(await getUserById(req.body.userId))) {
      return res.status(404).json({ msg: "User not found..." });
    }
    if (!(await getDish(req.body.dishId))) {
      return res.status(404).json({ msg: "Dish not found..." });
    }
    if (await checkFav(req.body.userId, req.body.dishId)) {
      return res
        .status(400)
        .json({ msg: "Dish is already in your favorites..." });
    }
    const nId = await nanoid(10);
    const obj = {
      dishId: req.body.dishId,
      userId: req.body.userId,
      id: nId,
    };
    const add = await addFavDish(obj);
    if (!add) {
      return res
        .status(501)
        .json({ error: true, msg: "INTERNAL SERVER ERROR" });
    }
    res.status(201).json({ error: false });
  } catch (error) {
    res.status(404).json({ msg: "NOT FOUND" });
  }
}

async function removeFavController(req, res) {
  try {
    const fav = await checkFav2(req.body.userId, req.body.dishId);
    if (!fav) {
      return res.status(404).json({ msg: "NOT FOUND" });
    }
    const remove = await removeFavDish(req.body.userId, req.body.dishId);
    if (!remove) {
      return res
        .status(501)
        .json({ error: true, msg: "INTERNAL SERVER ERROR" });
    }
    res.status(202).json({ error: false });
  } catch (error) {
    res.status(404).json({ msg: "NOT FOUND" });
  }
}

async function getFavController(req, res) {
  try {
    const favs = await getFav(req.body.userId);
    res.send(favs);
  } catch (error) {
    res.status(404).json({ msg: "NOT FOUND" });
  }
}

module.exports = { addFavController, removeFavController, getFavController };
