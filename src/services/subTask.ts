import SubTaskImpl, { SubTask } from "../models/subTask";

export class SubTaskService {
  subTask: SubTaskImpl;

  constructor() {
    this.subTask = new SubTaskImpl();
  }

  async create(subTask: any) {
    try {
      return await this.subTask.create(subTask);
    } catch (err) {
      throw err;
    }
  }

  async update(subTask: SubTask) {
    try {
      return await this.subTask.update(subTask);
    } catch (err) {
      throw err;
    }
  }

  async remove(subTaskId: number) {
    try {
      return await this.subTask.remove(subTaskId);
    } catch (err) {
      throw err;
    }
  }

  async query(taskId: number) {
    try {
      return await this.subTask.query(taskId);
    } catch (err) {
      throw err;
    }
  }
}