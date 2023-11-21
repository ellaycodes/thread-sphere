const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");
const jestS = require("jest-sorted");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  test('GET: 200 - responds with an array of topic objects with "slug" and "description" properties', () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topic)).toBe(true);
        expect(body.topic.length).toBe(3);
        body.topic.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("GET: 404 - responds with an error message for all non-existent routes", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api", () => {
  test("GET: 200 - responds with an object describing all the available endpoints on your API ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endPoints);
      });
  });
  test("GET: 404 - responds with an error message for incorrect or non-existent routes", () => {
    return request(app)
      .get("/apo")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 - responds with an article object with the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("GET: 404 - responds with an error message for incorrect or non-existent routes (1)", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET: 404 - responds with an error message for non-existent article_id (2)", () => {
    return request(app)
      .get("/api/articles/200")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

// describe("GET /api/articles/:article_id/comments", () => {
//   test("GET: 200 - responds with an array of comments for the given article_id", () => {
//     return request(app)
//       .get("/api/articles/:article_id/comments")
//       .expect(200)
//       .then(({ body }) => {
//         expect(Array.isArray(body.comments)).toBe(true);
//         body.comments.forEach((comment) => {
//           expect(comment).toEqual({
//             comment_id: expect.any(Number),
//             votes: expect.any(String),
//             created_at: expect.any(String),
//             author: expect.any(String),
//             body: expect.any(String),
//             article_id: expect.any(Number),
//           });
//         });
//       });
//   });
//   test("GET: 200 - Comments should be served with the most recent comments", () => {
//     return request(app)
//       .get("/api/articles/:article_id/comments")
//       .expect(200)
//       .then(({body}) => {
//         expect(body.comments).toBeSortedBy('created_at', { descending: true})
//       });
//   });
// });
