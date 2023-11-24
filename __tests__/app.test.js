const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const fs = require("fs");
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

describe("GET /api/articles", () => {
  test("GET: 200 - responds with an articles array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toEqual({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET: 200 - responds with comment_count which is the total count of all the comments with this article_id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        function calculateExpectedCommentCount(id) {
          if (id === 9 || id === 3 || id === 5) {
            return "2";
          } else if (id === 1) {
            return "11";
          } else if (id === 6) {
            return "1";
          } else {
            return "0";
          }
        }
        body.articles.forEach((article) => {
          const expectedCommentCount = calculateExpectedCommentCount(
            article.article_id
          );
          expect(article.comment_count).toEqual(expectedCommentCount);
        });
      });
  });
  test("GET: 200 - articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET: 200 - there should not be a body property present on any of the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).not.toHaveProperty("body");
      });
  });
  test("GET: 404 - responds with an error message for incorrect or non-existent routes", () => {
    return request(app)
      .get("/api/article")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET: 200 - responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
        body.comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("GET: 200 - Comments should be served with the most recent comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200 - Article does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET 404 - Article does not exist", () => {
    return request(app)
      .get("/api/articles/200/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Article Not Found");
      });
  });
  test("GET 400: Bad Request", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 - request body accepts an object with a username and body", () => {
    const testComment = {
      username: "butter_bridge",
      body: "too long, got bored half-way through",
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comments).toEqual([
          {
            comment_id: expect.any(Number),
            votes: 0,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "too long, got bored half-way through",
            article_id: 2,
          },
        ]);
      });
  });
  test("POST: 404 - article not found", () => {
    const comment = {
      username: "butter_bridge",
      body: "that's a lot of words dude",
    };

    return request(app)
      .post("/api/articles/200/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Article Not Found");
      });
  });
  test("POST: 400 - no comment to post", () => {
    const comment = {
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("POST: 400 - invalid article id format", () => {
    const comment = {
      username: "butter_bridge",
      body: "that's a lot of words dude",
    };
    return request(app)
      .post("/api/articles/notanid/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH: 200 - Successfully updates votes", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.votes).toBe(101);
      });
  });

  test("PATCH: 404 - Article not found", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/99999")
      .send(voteUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
  });

  test("PATCH: 400 - Invalid article ID", () => {
    const voteUpdate = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/notanumber")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("PATCH: 400 - No inc_votes in request body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("PATCH: 400 - Invalid inc_votes value", () => {
    const voteUpdate = { inc_votes: "notanumber" };
    return request(app)
      .patch("/api/articles/1")
      .send(voteUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204: Deletes a comment successfully", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE 400: Invalid comment ID format", () => {
    return request(app).delete("/api/comments/not-a-number").expect(400);
  });

  test("DELETE 404: Non-existent comment ID", () => {
    return request(app).delete("/api/comments/99999").expect(404);
  });
  test("DELETE 404: Deleting a comment that does not exist", () => {
    return request(app).delete("/api/comments/19").expect(404);
  });
});

describe("GET /api/users", () => {
  test("GET 200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBeGreaterThan(0);
        body.users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("GET 404: responds with a not found error for an invalid path", () => {
    return request(app)
      .get("/api/nonexistentEndpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe('GET /api/articles (topic query)', () => {
  test('GET: 200 - filters articles by the specified topic', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        body.articles.forEach((article) => {
          expect(article.topic).toBe('cats');
        });
      });
  });
  test('GET: 404 - responds with not found for a non-existent topic', () => {
    return request(app)
      .get('/api/articles?topic=unknown')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found');
      });
  });
  test('GET: 200 - returns all articles when no topic query is provided', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
      });
  });
});