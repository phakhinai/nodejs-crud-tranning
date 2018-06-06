const validate = require("validate.js");
const database = require("../config/database");

class PostsComponentForMySQL {
  constructor(valid = validate, db = database.MySqlDatabase) {
    // ใช้งาน Database
    this._database = new db();
    // สร้าง Validate
    this._validate = valid;
    this._validate.validators.presence.message = "ห้ามเป็นค่าว่าง";
    this._validate.validators.format.message = "ไม่ตรงกับรูปแบบที่กำหนด";
    this._validate.validators.numericality.message = "ต้องเป็นตัวเลขเท่านั้น";
    this.validate_rules = {
      post_image: {
        presence: { allowEmpty: false },
        format: /(https?:\/\/.*\.(?:png|jpg))/i
      },
      post_category: {
        presence: { allowEmpty: false }
      },
      post_name: {
        presence: { allowEmpty: false }
      }
    };
  }

  // แสดงข้อมูลทั้งหมด
  async selectAll() {
    return await this._database.query(
      "select * from posts order by post_date desc"
    );
  }

  // แสดงข้อมูลตาม id
  async selectOne(id) {
    const errors = this._validate({ id }, { id: { numericality: true } });
    if (errors) throw { errors };
    const items = await this._database.query("select * from posts where id=?", [
      id
    ]);
    return items[0];
  }

  // เพิ่มข้อมูล
  async create(value) {
    const errors = this._validate(value, this.validate_rules);
    if (errors) throw { errors };
    const item = await this._database.query(
      "insert into posts value(0, ?, ?, ?, ?, now())",
      [
        value["post_image"],
        value["post_category"],
        value["post_name"],
        value["post_detail"]
      ]
    );
    return await this.selectOne(item.insertId);
  }

  // แก้ไขข้อมูล
  async update(id, value) {
    const errors = this._validate(value, this.validate_rules);
    const errorsId = this._validate({ id }, { id: { numericality: true } });
    if (errors || errorsId) throw { errors: errorsId || errors };
    const item = await this._database.query(
      `update posts set
        post_image = ?,
        post_category = ?,
        post_name = ?,
        post_detail = ?
      where id = ?`,
      [
        value["post_image"],
        value["post_category"],
        value["post_name"],
        value["post_detail"],
        id
      ]
    );
    return this.selectOne(id);
  }

  // ลบข้อมูล
  async delete(id) {
    const errors = this._validate({ id }, { id: { numericality: true } });
    if (errors) throw { errors };
    const item = await this._database.query("delete from posts where id = ?", [
      id
    ]);
    return await { id };
  }
}

class PostsComponentForMongoDB {
  constructor(valid = validate, db = database.MongoDatabase) {
    // ใช้งาน Database
    this._database = new db();
    // สร้าง Validate
    this._validate = valid;
    this._validate.validators.presence.message = "ห้ามเป็นค่าว่าง";
    this._validate.validators.format.message = "ไม่ตรงกับรูปแบบที่กำหนด";
    this._validate.validators.numericality.message = "ต้องเป็นตัวเลขเท่านั้น";
    this.validate_rules = {
      post_image: {
        presence: { allowEmpty: false },
        format: /(https?:\/\/.*\.(?:png|jpg))/i
      },
      post_category: {
        presence: { allowEmpty: false }
      },
      post_name: {
        presence: { allowEmpty: false }
      }
    };
  }

  // แสดงข้อมูลทั้งหมด
  async selectAll() {
    return await this._database.posts.find().sort({ post_date: "desc" });
  }

  // แสดงข้อมูลตาม id
  async selectOne(id) {
    return await this._database.posts.findById(id);
  }

  // เพิ่มข้อมูล
  async create(value) {
    const errors = this._validate(value, this.validate_rules);
    if (errors) throw { errors };
    return await new this._database.posts(value).save();
  }

  // แก้ไขข้อมูล
  async update(id, value) {
    const errors = this._validate(value, this.validate_rules);
    if (errors) throw { errors };
    await this._database.posts.update({ _id: id }, value);
    return await this.selectOne(id);
  }

  // ลบข้อมูล
  async delete(id) {
    return await this._database.posts.deleteOne({ _id: id });
  }
}

module.exports = PostsComponentForMongoDB;
