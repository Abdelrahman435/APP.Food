const mysql = require("mysql");

const db_config = {
  host: "bynz8ffsh8hxzo6i79rp-mysql.services.clever-cloud.com",
  user: "uimqgwitzguanugd",
  password: "BhTGse6vgRW24QoNey19",
  database: "bynz8ffsh8hxzo6i79rp",
  port: "3306",
};

////////////////////////////////////////////////////////////////////
// let connection = mysql.createConnection({
//   host: "bynz8ffsh8hxzo6i79rp-mysql.services.clever-cloud.com",
//   user: "uimqgwitzguanugd",
//   password: "BhTGse6vgRW24QoNey19",
//   database: "bynz8ffsh8hxzo6i79rp",
//   port: "3306",
// });

// let connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "food app",
//   port: "3306",
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log("DB CONNECTED");
// });
////////////////////////////////////////////////////////////////////

function handleDisconnect() {
  connection = mysql.createConnection({
    host: "bynz8ffsh8hxzo6i79rp-mysql.services.clever-cloud.com",
    user: "uimqgwitzguanugd",
    password: "BhTGse6vgRW24QoNey19",
    database: "bynz8ffsh8hxzo6i79rp",
    port: "3306",
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log("DB CONNECTED");
  });

  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();
module.exports = { connection };
