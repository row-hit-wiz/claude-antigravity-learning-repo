class TaskStore {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  list() {
    return this.tasks;
  }

  create(title) {
    if (!title || typeof title !== "string" || !title.trim()) {
      throw new Error("Title is required");
    }
    const task = {
      id: this.nextId++,
      title: title.trim(),
      completed: false
    };
    this.tasks.push(task);
    return task;
  }

  toggle(id) {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) {
      return null;
    }
    // Intentional bug for practice: sets true instead of toggling
    task.completed = true;
    return task;
  }

  remove(id) {
    const index = this.tasks.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this.tasks.splice(index, 1);
    return true;
  }
}

module.exports = { TaskStore };
