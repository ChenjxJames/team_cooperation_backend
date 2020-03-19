import TaskImpl, { Task } from "../models/task";

export class TaskService {
  task: TaskImpl;

  constructor() {
    this.task = new TaskImpl();
  }

  async create(task: any) {
    try {
      return await this.task.create(task);
    } catch (err) {
      throw err;
    }
  }

  async update(task: Task) {
    try {
      return await this.task.update(task);
    } catch (err) {
      throw err;
    }
  }

  async remove(taskId: number) {
    try {
      return await this.task.remove(taskId);
    } catch (err) {
      throw err;
    }
  }
}