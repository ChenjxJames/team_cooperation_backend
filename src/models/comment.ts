import { Connection } from "none-sql";
import { MySqlPool } from "../lib/mysql";

export interface Comment{
  commentId: number;
  commentContent: string;
  taskId: number;
  userId: number;
  createTime: string;
}

export default class CommentImpl implements Comment {
  commentId: number = 0;
  commentContent: string = '';
  taskId: number = 0;
  userId: number = 0;
  createTime: string = '';

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }  
  
  async create(comment: any) {
    try {
      let sql = "INSERT INTO `task_comment` (`comment_content`, `task_id`, `user_id`) VALUES (?,?,?)";
      let result: any = await this.connection.query(sql, [comment.commentContent, comment.taskId, comment.userId]); 
      sql = "SELECT `comment_id` AS `commentId`, `comment_content` AS `commentContent`, `task_id` AS `taskId`, `task_comment`.`create_time` AS `createTime`, `user_id` AS `userId`, `username` FROM `task_comment` LEFT JOIN `user` USING(`user_id`) WHERE `comment_id`=?";
      result = (await this.connection.query(sql, [result.info.insertId])).info[0];
      return result;
    } catch (err) {
      throw err;
    }
  }

  async update(comment: Comment) {
    try {
      let sql = 'UPDATE `task_comment` SET `comment_content` = ? WHERE `comment_id` = ?';
      await this.connection.query(sql, [comment.commentContent, comment.commentId]);
    } catch (err) {
      throw err;
    }
  }
  
  async remove(commentId: number) {
    try {
      const sql = 'DELETE FROM `task_comment` WHERE `comment_id` = ?';
      await this.connection.query(sql, [commentId]);      
    } catch (err) {
      throw err;
    }
  }

  async query(taskId: number) {
    try {
      const sql = 'SELECT `comment_id` AS `commentId`, `comment_content` AS `commentContent`, `task_id` AS `taskId`, `task_comment`.`create_time` AS `createTime`, `user_id` AS `userId`, `username` FROM `task_comment` LEFT JOIN `user` USING(`user_id`) WHERE `task_id`=?';
      const result: any = (await this.connection.query(sql, [taskId])).info;   
      return result;
    } catch (err) {
      throw err;
    }
  }
}