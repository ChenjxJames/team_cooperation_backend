import { Connection } from "none-sql";
import { MySqlPool } from "../lib/MySql";

export interface List{
  listId?: number;
  listName: string;
  boardId: number;
  order: number;
}

export default class ListImpl implements List {
  listId: number = 0;
  listName: string = '';
  boardId: number = 0;
  order: number = 0;

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }  
  
  async create(list: List) {
    try {
      let sql = 'INSERT INTO `list` (`list_name`, `board_id`, `order`) VALUES (?,?,?)';
      const result: any = await this.connection.query(sql, [list.listName, list.boardId, list.order]); 
      list.listId = result.info.insertId;
      return list;
    } catch (err) {
      throw err;
    }
  }

  async update(list: List) {
    try {
      let sql = 'UPDATE `list` SET `list_name` = ?, `order` = ? WHERE `list_id` = ? AND `board_id` = ?';
      await this.connection.query(sql, [list.listName, list.order, list.listId, list.boardId]);
    } catch (err) {
      throw err;
    }
  }
  
  async remove(listId: number) {
    try {
      await this.connection.transaction(async () => {
        let sql = 'DELETE FROM `list` WHERE `list_id` = ?';
        await this.connection.query(sql, [listId]);
        sql = 'DELETE FROM `task` WHERE `list_id` = ?';
        await this.connection.query(sql, [listId]);        
      });
    } catch (err) {
      throw err;
    }
  }
}