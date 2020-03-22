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

  async queryMember(taskId: number) {
    try {
      return await this.task.queryMember(taskId);
    } catch (err) {
      throw err;
    }
  }

  async addMember(userId: number, taskId: number) {
    try {
      return await this.task.addMember(userId, taskId);
    } catch (err) {
      throw err;
    }
  }

  async removeMember(userId: number, taskId: number) {
    try {
      return await this.task.removeMember(userId, taskId);
    } catch (err) {
      throw err;
    }
  }

  async queryTag(taskId: number) {
    try {
      return await this.task.queryTag(taskId);
    } catch (err) {
      throw err;
    }
  }

  async addTag(tagId: number, taskId: number) {
    try {
      return await this.task.addTag(tagId, taskId);
    } catch (err) {
      throw err;
    }
  }

  async removeTag(tagId: number, taskId: number) {
    try {
      return await this.task.removeTag(tagId, taskId);   
    } catch (err) {
      throw err;
    }
  }
}