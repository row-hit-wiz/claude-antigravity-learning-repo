const test = require("node:test");
const assert = require("node:assert/strict");
const { TaskStore } = require("../src/store");

test("creates and lists tasks", () => {
  const store = new TaskStore();
  const created = store.create("Buy espresso beans");
  assert.equal(created.id, 1);
  assert.equal(created.completed, false);
  assert.equal(store.list().length, 1);
});

test("deletes a task", () => {
  const store = new TaskStore();
  const created = store.create("Walk along Naviglio Grande");
  assert.equal(store.remove(created.id), true);
  assert.equal(store.list().length, 0);
});
