const fs = require("fs")
const userServices = require("../services/editPrfileServices")
const bcrypt = require("bcrypt");
var passwordValidator = require("password-validator");
var schema = new passwordValidator();

schema
  .is()
  .min(8)
  .is()
  .max(255)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

exports.editProfile = async (req, res) => {
    try {
      let result;
      let user = await userServices.getUser(req.params.id);
      if (!user[0]) {
        return res.status(404).json({ errors: ["User not found"] });
      }
      const flag = await schema.validate(req.body.password);
      if (!flag) {
        return res.status(400).json({
          msg: "password should contain : 1 lowercase, 1 uppercase, 2 digits, no spaces, length of 8",
        });
      }
      if(req.body.password){
        req.body.password =  bcrypt.hashSync(req.body.password, 10)
      }
      if (fs.existsSync('../upload' + user[0].image)) {
        fs.unlinkSync('../upload/' + user[0].image);
      }
      if (req.file) {
        req.body.image = req.file.filename;
    }
    
      result = await userServices.editProfile(req.body, req.params.id);
  
      if (result.length == 0) {
        return res.status(400).send("profile not updated");
      }
      return res.status(200).send("updated successfully");
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: "error updating profile" });
    }
  };