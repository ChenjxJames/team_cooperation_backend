import { Connection } from "none-sql";
import { MySqlPool } from "../lib/mysql";

export interface Lane {
  laneId?: number;
  laneName: string;
  boardId: number;
  order: number;
}

export default class LaneImpl implements Lane {
  laneId: number = 0;
  laneName: string = '';
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

  async create(lane: Lane) {
    try {
      let sql = 'INSERT INTO `lane` (`lane_name`, `board_id`, `order`) VALUES (?,?,?)';
      const result: any = await this.connection.query(sql, [lane.laneName, lane.boardId, lane.order]); 
      lane.laneId = result.info.insertId;
      return lane;
    } catch (err) {
      throw err;
    }
  }

  async update(lane: Lane) {
    try {
      let sql = 'UPDATE `lane` SET `lane_name` = ?, `order` = ? WHERE `lane_id` = ? AND `board_id` = ?';
      await this.connection.query(sql, [lane.laneName, lane.order, lane.laneId, lane.boardId]);
    } catch (err) {
      throw err;
    }
  }
  
  async remove(laneId: number) {
    try {
      await this.connection.transaction(async () => {
        let sql = 'DELETE FROM `task` WHERE `lane_id` = ?';
        await this.connection.query(sql, [laneId]);
        sql = 'DELETE FROM `lane` WHERE `lane_id` = ?';
        await this.connection.query(sql, [laneId]);              
      });
    } catch (err) {
      throw err;
    }
  }
}