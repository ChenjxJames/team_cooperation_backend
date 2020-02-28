import { BoardImpl } from "../models/board";
import { Permission } from "../models/permission";

export class BoardService {
  board: BoardImpl;
  permission: Permission;

  constructor() {
    this.board = new BoardImpl();
    this.permission = new Permission();
  }

  async getInformation(userId: number) {
    try {
      await this.board.getBoardByUserId(userId);
      const allRolePermissions = await this.permission.getAllRolePermissions();
      const boards = this.board.boards;
      const result: any[] = [];
      boards.forEach((board: any) => {
        result.push({
          board_id: board.board_id,
          board_name: board.board_name,
          create_time: board.create_time, 
          role_id: board.role_id,
          permissions: allRolePermissions[board.role_id].permissions
        });
      });
      return result;
    } catch (err) {
      throw err;
    }
  }

  async createUserBoard(boardName: string, userId: number) {
    try {
      return await this.board.createUserBoard(boardName, userId);
    } catch (err) {
      throw err;
    }
  }

  async joinBoard(board_id: number, userId: number) {
    try {
      return await this.board.addUser(board_id, userId, 8);
    } catch (err) {
      throw err;
    }
  }
}