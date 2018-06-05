const assert = require("assert");
const PostComponent = require("../components/posts.component");

describe("Run Test PostComponent", () => {
  let component = new PostComponent();

  beforeEach(() =>
    (component = new PostComponent(
      require("validate.js"),
      class {
        constructor() {
          this.items = [
            {
              id: 1,
              post_image:
                "https://www.parpaikin.com/wp-content/uploads/2017/12/04-30.jpg",
              post_category: "อาหารไทย 1",
              post_name: "อาหารไทย",
              post_detail: "เมนูอาหาร อาหารไทยง่ายๆ ทำกินเองที่บ้านได้ กับข้าว",
              post_date: new Date()
            },
            {
              id: 2,
              post_image:
                "https://www.parpaikin.com/wp-content/uploads/2017/12/04-30.jpg",
              post_category: "อาหารไทย 2",
              post_name: "อาหารไทย",
              post_detail: "เมนูอาหาร อาหารไทยง่ายๆ ทำกินเองที่บ้านได้ กับข้าว",
              post_date: new Date()
            }
          ];
        }

        /**
         *
         * @param {string} sql
         * @param {any} params
         */
        query(sql, params = null) {
          return new Promise((resolve, reject) => {
            const query = sql.toLowerCase();
            //#region Select
            if (query.indexOf("select") >= 0) {
              if (params == null) resolve(this.items);
              else resolve(this.items.filter(m => m.id == params[0]));
            }
            //#endregion

            //#region Insert
            else if (query.indexOf("insert") >= 0) {
              const item = {
                id: Math.random(),
                post_image: params[0],
                post_category: params[1],
                post_name: params[2],
                post_detail: params[3],
                post_date: new Date()
              };
              this.items.push(item);
              resolve({ insertId: item.id });
            }
            //#endregion

            //#region Update
            else if (query.indexOf("update") >= 0) {
              this.items.map(m => {
                if (m.id == params[4]) {
                  m.post_image = params[0];
                  m.post_category = params[1];
                  m.post_name = params[2];
                  m.post_detail = params[3];
                }
                return m;
              });
              resolve();
            }
            //#endregion

            //#region Delete
            if (query.indexOf("delete") >= 0) {
              this.items.splice(
                this.items.findIndex(m => m.id == params[0]),
                1
              );
              resolve();
            }
            //#endregion
          });
        }
      }
    )));

  it("Must have a function selectAll", () => {
    assert.equal(typeof component.selectAll, "function");
  });

  it("Must have a function selectOne", () => {
    assert.equal(typeof component.selectOne, "function");
  });

  it("Must have a function create", () => {
    assert.equal(typeof component.create, "function");
  });

  it("Must have a function update", () => {
    assert.equal(typeof component.update, "function");
  });

  it("Must have a function delete", () => {
    assert.equal(typeof component.delete, "function");
  });

  it("Function selectAll ต้องทำงานถูกต้อง", async () => {
    const items = await component.selectAll();
    assert.equal(items.length, 2);
  });

  it("Function selectOne ต้องทำงานถูกต้อง", async () => {
    const item = await component.selectOne(2);
    assert.equal(item.post_category, "อาหารไทย 2");
  });

  it("Function create ต้องทำงานถูกต้อง", async () => {
    const item = await component.create({
      post_image:
        "https://www.parpaikin.com/wp-content/uploads/2017/12/04-30.jpg",
      post_category: "Test_insert_post_category",
      post_name: "Test_inser_post_name",
      post_detail: "Test_inser_post_detail"
    });
    const items = await component.selectAll();
    assert.equal(items.length, 3);
  });

  it("Function update ต้องทำงานถูกต้อง", async () => {
    const item = await component.update(2, {
      post_image:
        "https://www.parpaikin.com/wp-content/uploads/2017/12/04-30.jpg",
      post_category: "Test_update_post_category",
      post_name: "Test_update_post_name",
      post_detail: "Test_update_post_detail"
    });
    assert.equal(item.post_category, "Test_update_post_category");
  });

  it("Function delete ต้องทำงานถูกต้อง", async () => {
    await component.delete(2);
    const items = await component.selectAll();
    assert.equal(items.length, 1);
  });
});
