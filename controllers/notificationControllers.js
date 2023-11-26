const notifications = require("../services/notificationService");

exports.notification = async (req, res) => {
  try {
    const notification = await notifications.notification(req.params.id);
    if (!notification.length > 0) {
      return res.status(400).json("not found notifications");
    }
    notification.map((no) => {
      no.image = "https://food-app-api-fnni.onrender.com/" + no.image;
    });
    return res.status(200).json(notification);
  } catch (err) {
    console.log(err);
    res.status(500).json("error");
  }
};
