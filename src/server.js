const http = require("node:http");
const { TaskStore } = require("./store");

function createServer(store = new TaskStore()) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && url.pathname === "/tasks") {
      res.statusCode = 200;
      res.end(JSON.stringify(store.list()));
      return;
    }

    if (req.method === "POST" && url.pathname === "/tasks") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body || "{}");
          const task = store.create(parsed.title);
          res.statusCode = 201;
          res.end(JSON.stringify(task));
        } catch (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }

    const toggleMatch = url.pathname.match(/^\/tasks\/(\d+)\/toggle$/);
    if (req.method === "PATCH" && toggleMatch) {
      const id = Number(toggleMatch[1]);
      const updated = store.toggle(id);
      if (!updated) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Task not found" }));
        return;
      }
      res.statusCode = 200;
      res.end(JSON.stringify(updated));
      return;
    }

    const deleteMatch = url.pathname.match(/^\/tasks\/(\d+)$/);
    if (req.method === "DELETE" && deleteMatch) {
      const id = Number(deleteMatch[1]);
      const deleted = store.remove(id);
      if (!deleted) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Task not found" }));
        return;
      }
      res.statusCode = 204;
      res.end();
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  });
}

if (require.main === module) {
  const port = process.env.PORT || 3000;
  const server = createServer();
  server.listen(port, () => {
    console.log(`Task API listening on http://localhost:${port}`);
  });
}

module.exports = { createServer };
