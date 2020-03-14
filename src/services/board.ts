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
      return this.board.boards;
    } catch (err) {
      throw err;
    }
  }

  async getInformationByTeamId(teamId: number) {
    try {
      await this.board.getBoardByTeamId(teamId);
      return this.board.boards;
    } catch (err) {
      throw err;
    }
  }

  async getInformationByBoardId(boardId: number) {
    try {
      return await this.board.getBoardByBoardId(boardId);
    } catch (err) {
      throw err;
    }
  }

  async createBoard(boardName: string, teamId: number) {
    try {
      await this.board.create(boardName, teamId);
    } catch (err) {
      throw err;
    }
  }

  async removeBoard(boardId: number) {
    try {
      await this.board.remove(boardId);
    } catch (err) {
      throw err;
    }
  }

  async updateBoard(boardName: string, boardId: number) {
    try {
      await this.board.update(boardName, boardId);
    } catch (err) {
      throw err;
    }
  }
}