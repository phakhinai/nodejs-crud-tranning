const mysql = require("mysql");
const mongoose = require("mongoose");

// ฐานข้อมูล MySQL
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

// ฐานข้อมูล MongoDB
class MongoDatabase {
  constructor(db = mongoose) {
    this.mongoose = db;
    this.mongoose.connect("mongodb://localhost/nodejs_crud");
    this.posts = this.mongoose.model(
      "posts",
      new this.mongoose.Schema(
        {
          post_image: String,
          post_category: String,
          post_name: String,
          post_detail: String,
          post_date: {
            type: Date,
            default: Date.now
          }
        },
        {
          toJSON: {
            virtuals: true
          }
        }
      )
    );
  }
}

module.exports = { MySqlDatabase, MongoDatabase };
