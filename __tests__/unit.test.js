const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const fs = require("fs");

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
    const endPoints = JSON.parse(fs.readFileSync(`endpoints.json`));
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body}) => {
        console.log(body);
        expect(body).toEqual(endPoints);
      });
  });
  test("GET: 404 - responds with an error message for incorrect or non-existent routes", () => {
    return request(app)
      .get("/apo")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      });
  });
});
