const router = require("express").Router();

//#region Posts Component

const PostsComponent = require("../components/posts.component");
const Posts = new PostsComponent();

// แสดงข้อมูลทั้งหมด
router.get("/posts", (req, res) => res.sendAsyncApi(Posts.selectAll()));

// แสดงข้อมูลตาม id
router.get("/posts/:id", (req, res) =>
  res.sendAsyncApi(Posts.selectOne(req.params.id))
);

// เพิ่มข้อมูล
router.post("/posts", (req, res) => res.sendAsyncApi(Posts.create(req.body)));

// แก้ไขข้อมูล
router.put("/posts/:id", (req, res) =>
  res.sendAsyncApi(Posts.update(req.params.id, req.body))
);

// ลบข้อมูล
router.delete("/posts/:id", (req, res) =>
  res.sendAsyncApi(Posts.delete(req.params.id))
);

//#endregion

module.exports = router;
