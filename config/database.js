const mysql = require("mysql");

class MySqlDatabase {
  constructor() {
    this.connection = mysql.createPool({
      host: "localhost",
      user: "test",
      password: "1234",
      database: "db_test"
    });
  }

  query(sql, params = null) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (err, res) => {
        if (err) return reject({ err });
        resolve(res);
      });
    });
  }
}

module.exports = { MySqlDatabase };
