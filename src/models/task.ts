import { Connection } from "none-sql";
import { MySqlPool } from "../lib/MySql";

export interface Task {
  taskId: number;
  taskName: string;
  information: string;
  taskDealine: string;
  listId: number;
  laneId: number;
  order: number;

  haveSubTask: boolean;
  haveUser: boolean;
  haveFile: boolean;
  haveComment: boolean;
  haveTag: boolean;
}

export default class TaskImpl implements Task {
  taskId: number = 0;
  taskName: string = '';
  information: string = '';
  taskDealine: string = '';
  listId: number = 0;
  laneId: number = 0;
  order: number = 0;
  haveSubTask: boolean = false;
  haveUser: boolean = false;
  haveFile: boolean = false;
  haveComment: boolean = false;
  haveTag: boolean = false;

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }  

  async create(task: any) {
    this.taskName = task.taskName;
    this.listId = task.listId;
    this.laneId = task.laneId;
    this.order = task.order;
    try {
      let sql = 'INSERT INTO `task` (`task_name`, `list_id`, `lane_id`, `order`) VALUES (?,?,?,?)';
      const result: any = await this.connection.query(sql, [task.taskName, task.listId, task.laneId, task.order]); 
      this.taskId = result.info.insertId;
      return {
        taskId: this.taskId,
        taskName: this.taskName,
        information: this.information,
        taskDealine: this.taskDealine,
        listId: this.listId,
        laneId: this.laneId,
        order: this.order,
        haveSubTask: this.haveSubTask,
        haveUser: this.haveUser,
        haveFile: this.haveFile,
        haveComment: this.haveComment,
        haveTag: this.haveTag
      };
    } catch (err) {
      throw err;
    }
  }

  async update(task: Task) {
    try {
      let sql = 'UPDATE `task` SET `task_id`=?, `task_name`=?, `information`=?, `task_dealine`=?, `list_id`=?, `lane_id`=?, `order`=?, `have_sub_task`=?, `have_user`=?, `have_file`=?, `have_comment`=?, `have_tag`=? WHERE `task_id` = ?';
      await this.connection.query(sql, [task.taskId, task.taskName, task.information, task.taskDealine, task.listId, task.laneId, task.order, task.haveSubTask, task.haveUser, task.haveFile, task.haveComment, task.haveTag, task.taskId]);
    } catch (err) {
      throw err;
    }
  }
  
  async remove(taskId: number) {
    try {
      await this.connection.transaction(async () => {
        let sql = 'DELETE FROM `task` WHERE `task_id` = ?';
        await this.connection.query(sql, [taskId]);          
      });
    } catch (err) {
      throw err;
    }
  }
}