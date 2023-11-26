const dishServices = require("../services/dishesServices");

exports.showTopDishes = async (req, res, next) => {
  try {
    const dishes = await dishServices.getTopDishes();
    if (dishes.length > 0) {
      dishes.map((dishe) => {
        dishe.image = "https://food-app-dashboard.onrender.com/" + dishe.image;
      });
      res.status(200).json(dishes);
    } else {
      res.status(404).json({ errors: ["not found"] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.classificationOfDishes = async (req, res, next) => {
  try {
    const dishes = await dishServices.classificationOfDishes(
      req.params.category
    );
    if (dishes.length > 0) {
      dishes.map((dishe) => {
        dishe.image = "https://food-app-dashboard.onrender.com/" + dishe.image;
      });
      res.status(200).json(dishes);
    } else {
      res.status(404).json({ errors: ["not found"] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.topSeller = async (req, res) => {
  try {
    const dishes = await dishServices.topSeller();
    if (dishes.length > 0) {
      dishes.map((dishe) => {
        dishe.image = "https://food-app-dashboard.onrender.com/" + dishe.image;
      });
      res.status(200).json(dishes);
    } else {
      res.status(404).json({ errors: ["not found"] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.search = async (req, res, next) => {
  try {
    const dishes = await dishServices.search(req.query.search)
    // console.log(dishes.length);
    if(dishes.length > 0) {
      dishes.map((dishe) => {
        dishe.image = "https://food-app-dashboard.onrender.com/" + dishe.image;
      });
      return res.status(200).json(dishes)
       }
    return res.status(404).json("Sorry, the keyword you entered cannot be found, please check again or search with  another keyword.")
  } catch (error) {
    console.log(error);
    res.status(404).json("internal server error")
  }
};

exports.productDetails = async (req, res) => {
  try {
    const product = await dishServices.productDetails(req.params.id)
    if(product.length > 0) {
    product[0].image = "https://food-app-dashboard.onrender.com/" + product[0].image
    return res.status(200).json(product)
    }
    return res.status(404).json("Product not found")
  } catch (error) {
    console.log(error);
    res.status(500).json("internal error")
  }
}
