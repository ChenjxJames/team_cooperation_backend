import { Connection } from 'none-sql';
import { MySqlPool } from '../lib/MySql';

interface Board {
  teamId: number;
  boardId: number;
  boardName: string;
  createTime: string;
}

interface Boards {
  boards: Array<Board>;
}


export class BoardImpl implements Boards {
  boards: Board[] = [];

  connection!: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }

  async getBoardByUserId(userId: number) {
    try {
      this.boards = [];
      const sql = 'SELECT * FROM `team_board` LEFT JOIN `board` USING(`board_id`) LEFT JOIN `team_user` USING(`team_id`) WHERE `user_id`=?';
      const result: any = await this.connection.query(sql, [userId]);
      result.info.forEach((board: any) => {
        this.boards.push({
          boardId: board.board_id,
          boardName: board.board_name,
          createTime: board.create_time,
          teamId: board.team_id
        });
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  
  async getBoardByTeamId(teamId: number) {
    try {
      this.boards = [];
      const sql = 'SELECT * FROM `team_board` LEFT JOIN `board` USING(`board_id`) WHERE `team_id`=?';
      const result: any = await this.connection.query(sql, [teamId]);
      result.info.forEach((board: any) => {
        this.boards.push({
          boardId: board.board_id,
          boardName: board.board_name,
          createTime: board.create_time,
          teamId: board.team_id
        });
      });
    } catch (err) {
      throw err;
    }
  }

  async getBoardByBoardId(boardId: number) {
    try {
      this.boards = [];
      let sql = 'SELECT * FROM `board` LEFT JOIN `team_board` USING(`board_id`) WHERE `board_id`=?';
      const board: any = (await this.connection.query(sql, [boardId])).info[0];
      sql = 'SELECT `list_id` AS `listId`,`list_name` AS `listName`,`board_id` AS `boardId`,`order` FROM `list` WHERE `board_id`=? ORDER BY `order`';
      const list: any = (await this.connection.query(sql, [boardId])).info;
      sql = 'SELECT `lane_id` AS `laneId`,`lane_name` AS `laneName`,`board_id` AS `boardId`,`order` FROM `lane` WHERE `board_id`=? ORDER BY `order`';
      const lane: any = (await this.connection.query(sql, [boardId])).info;
      sql = 'SELECT * FROM `task` WHERE `list_id` IN (?) AND `lane_id` IN (?)';
      const task: any = (await this.connection.query(sql, [list.map((item: any)=>item.listId), lane.map((item: any)=>item.laneId)])).info;
      const result: any = {
        boardId: board.board_id,
        boardName: board.board_name,
        createTime: board.create_time,
        teamId: board.team_id,
        list: list,
        lane: lane,
        task: task,
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async create(boardName: string, teamId: number) {
    try { 
      await this.connection.transaction(async () => {
        let sql = 'INSERT INTO `board` (`board_name`) VALUES (?)';
        const result: any = await this.connection.query(sql, [boardName]);
        const boardId = result.info.insertId;
        sql = 'INSERT INTO `team_board`(`team_id`, `board_id`) VALUES(?, ?)';
        await this.connection.query(sql, [teamId, boardId]);
        sql = 'INSERT INTO `list`(`list_name`, `board_id`, `order`) VALUES("TO DO", ?, 1),("DOING", ?, 2),("DONE", ?, 3)';
        await this.connection.query(sql, [boardId, boardId, boardId]);
        sql = 'INSERT INTO `lane`(`lane_name`, `board_id`, `order`) VALUES("DEFAULT", ?, 1)';
        await this.connection.query(sql, [boardId]);
      });
    } catch (err) {
      throw err;
    }
  }

  async remove(boardId: number) {
    try { 
      await this.connection.transaction(async () => {
        let sql = 'DELETE FROM `team_board` WHERE `board_id` = ?';
        await this.connection.query(sql, [boardId]);
        sql = 'DELETE FROM `board` WHERE `board_id` = ?';
        await this.connection.query(sql, [boardId]);
      });
    } catch (err) {
      throw err;
    }
  }

  async update(boardName: string, boardId: number) {
    try { 
      const sql = 'UPDATE `board` SET `board_name` = ? WHERE `board`.`board_id` = ?';
      await this.connection.query(sql, [boardName, boardId]);
    } catch (err) {
      throw err;
    }
  }
}