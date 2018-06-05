const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// public ให้กับ client folder
app.use("/", express.static(__dirname + "/client"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// สร้าง Function ใหม่ให้กับ express
app.use(require("./config/config"));

// สร้าง router ที่ขึ้นด้วย /api
app.use("/api", require("./config/route"));

// หน้าแรกของเว็บไซต์จะใช้ไฟล์ client/index.html
app.get("/", (req, res) => res.sendFile(__dirname + "/client/index.html"));

// เปิด port 3000 เพื่อ run server
app.listen(3000, () => console.log("Example app listening on port 3000!"));
