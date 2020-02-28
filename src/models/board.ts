import { Connection } from 'none-sql';
import { MySqlPool } from '../lib/MySql';

interface Board {
  board_id: number;
  board_name: string;
  create_time: string;
  role_id?: number;
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
      const sql = 'SELECT `board`.`board_id`,`role_id`,`board_name`,`create_time` FROM `board_user` LEFT JOIN `board` ON `board_user`.`board_id`=`board`.`board_id` WHERE `user_id`=?';
      const result: any = await this.connection.query(sql, [userId]);
      result.info.forEach((board: any) => {
        this.boards.push({
          board_id: board.board_id,
          board_name: board.board_name,
          create_time: board.create_time,
          role_id: board.role_id
        });
      });
    } catch (err) {
      throw err;
    }
  }
  
  async getBoardByTeamId(teamId: number) {
    try {
      this.boards = [];
      const sql = 'SELECT `board`.`board_id`,`board_name`,`create_time` FROM `team_board` LEFT JOIN `board` ON `team_board`.`board_id`=`board`.`board_id` WHERE `team_id`=?';
      const result: any = await this.connection.query(sql, [teamId]);
      result.info.forEach((board: any) => {
        this.boards.push({
          board_id: board.board_id,
          board_name: board.board_name,
          create_time: board.create_time
        });
      });
    } catch (err) {
      throw err;
    }
  }


  async createUserBoard(boardName: string, userId: number) {
    try { 
      const sql = 'INSERT INTO `board` (`board_name`) VALUES (?)';
      const result: any = await this.connection.query(sql, [boardName]);
      await this.addUser(result.info.insertId, userId, 7);
    } catch (err) {
      throw err;
    }
  }

  async addUser(boardId: number, userId: number, roleId: number){
    try {
      const sql = 'INSERT INTO `board_user` (`board_id`, `user_id`, `role_id`) VALUES (?,?,?)';
      await this.connection.query(sql, [boardId, userId, roleId]);
    } catch (err) {
      throw err;
    }
  }
}