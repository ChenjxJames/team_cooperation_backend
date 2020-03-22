import { Connection } from "none-sql";
import { MySqlPool } from "../lib/mysql";

export interface SubTask{
  subTaskId: number;
  subTaskName: string;
  isCompleted: boolean;
  taskId: number;
}

export default class SubTaskImpl implements SubTask {
  subTaskId: number = 0;
  subTaskName: string = '';
  isCompleted: boolean = false;
  taskId: number = 0;

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }  
  
  async create(subTask: any) {
    try {
      let sql = "INSERT INTO `sub_task` (`sub_task_name`, `is_completed`, `task_id`) VALUES (?,'0',?)";
      const result: any = await this.connection.query(sql, [subTask.subTaskName, subTask.taskId]); 
      subTask.subTaskId = result.info.insertId;
      subTask.isCompleted = false;
      return subTask;
    } catch (err) {
      throw err;
    }
  }

  async update(subTask: SubTask) {
    try {
      let sql = 'UPDATE `sub_task` SET `sub_task_name` = ?, `is_completed` = ? WHERE `sub_task_id` = ?';
      await this.connection.query(sql, [subTask.subTaskName, subTask.isCompleted, subTask.subTaskId]);
    } catch (err) {
      throw err;
    }
  }
  
  async remove(subTaskId: number) {
    try {
      const sql = 'DELETE FROM `sub_task` WHERE `sub_task_id` = ?';
      await this.connection.query(sql, [subTaskId]);      
    } catch (err) {
      throw err;
    }
  }

  async query(taskId: number) {
    try {
      const sql = 'SELECT `sub_task_id` AS `subTaskId`, `sub_task_name` AS `subTaskName`, `is_completed` AS `isCompleted`, `task_id` AS `taskId` FROM `sub_task` WHERE `task_id`=?';
      const result: any = (await this.connection.query(sql, [taskId])).info;      
      result.forEach((item: any) => {
        item.isCompleted = item.isCompleted === 1;
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}