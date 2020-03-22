import { Connection } from "none-sql";
import { MySqlPool } from "../lib/mysql";

export interface Tag {
  tagId: number;
  tagName: string;
  boardId: number;
  color: string;
}

export default class TagImpl implements Tag {
  tagId: number = 0;
  tagName: string = '';
  boardId: number = 0;
  color: string = '1976d2';

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }  

  async query(boardId: number) {
    try {
      let sql = 'SELECT `tag_id` AS `tagId`, `tag_name` AS `tagName`, `board_id` AS `boardId`, HEX(`color`) AS `color` FROM `tag` WHERE `board_id`=?';
      const result: any = await this.connection.query(sql, [boardId]); 
      return result.info;
    } catch (err) {
      throw err;
    }
  }
  
  async create(tag: any) {
    try {
      let sql = 'INSERT INTO `tag` (`tag_name`, `board_id`, `color`) VALUES (?,?,UNHEX(?))';
      const result: any = await this.connection.query(sql, [tag.tagName, tag.boardId, tag.color]); 
      tag.tagId = result.info.insertId;
      return tag;
    } catch (err) {
      throw err;
    }
  }

  async update(tag: Tag) {
    try {
      let sql = 'UPDATE `tag` SET `tag_name` = ?, `color` = UNHEX(?) WHERE `tag_id` = ?';
      await this.connection.query(sql, [tag.tagName, tag.color, tag.tagId]);
    } catch (err) {
      throw err;
    }
  }
  
  async remove(tagId: number) {
    try {
      await this.connection.transaction(async () => {
        let sql = 'DELETE FROM `task_tag` WHERE  `tag_id` = ?';
        await this.connection.query(sql, [tagId]);       
        sql = 'DELETE FROM `tag` WHERE `tag_id` = ?';
        await this.connection.query(sql, [tagId]);       
      });
    } catch (err) {
      throw err;
    }
  }

}