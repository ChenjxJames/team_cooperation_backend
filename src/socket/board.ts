import socketIo from 'socket.io';

import { BoardService } from "../services/board";
import { TeamService } from "../services/team";
import { LaneService } from "../services/lane";
import { ListService } from "../services/list";

export default class BoardSocket {
  boardService = new BoardService();
  teamService = new TeamService();
  laneService = new LaneService();
  listService = new ListService();
  nsp: socketIo.Namespace;

  constructor(nsp: socketIo.Namespace) {
    this.nsp = nsp;
  }

  listener = (socket: any) => {
    const userId = socket.session.user_id;

    if (!userId) {
      socket.emit('message', { succeeded: false, info: 'Please login.' });
    }
  
    console.log((new Date()).toLocaleString(), 'socket connect board');
  
    socket.on('disconnect', () => {
      console.log('disconnect');
    });
  
    socket.on('join', async (data: any, fn: any) => {
      console.log((new Date()).toLocaleString(), 'socket join', data.boardId);
      let result: any = {};
      try {  
        const boards = await this.boardService.getInformation(userId);
        if (boards.some((board: any) => board.boardId == data.boardId)) {
          socket.join(data.boardId);
          const board = await this.boardService.getInformationByBoardId(data.boardId);
          const team = await this.teamService.getInformationByTeamId(board.teamId, userId);
          result = { succeeded: true, info: 'Board information get successfully.', data: { ...board, team: team } };
        } else {
          result = { succeeded: false, info: 'Permission denied.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }   
    });
  
    socket.on('event', (data: any, fn: any) => {
      console.log(data);
      let s = socket.session;
      console.log(s);
      let rooms = Object.keys(socket.rooms); 
      fn(rooms);
    });
  
    socket.on('update', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'socket', boardId, 'update');
      let result: any = {};
      try {  
        if (data.boardName) {
          await this.boardService.updateBoard(data.boardName, +boardId);
          this.nsp.to(boardId).emit('update', { boardName: data.boardName });
          result = { succeeded: true, info: 'Board update successfully.' };
        } else {
          result = { succeeded: false, info: 'Board name or id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('create lane', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'socket', boardId, 'create lane');
      let result: any = {};
      try {  
        if (data.lane) {
          if (boardId == data.lane.boardId) {
            const lane = await this.laneService.create(data.lane);
            this.nsp.to(boardId).emit('create lane', { lane });
            result = { succeeded: true, info: 'Lane create successfully.' };
          } else {
            result = { succeeded: false, info: 'Permission denied.' };
          }          
        } else {
          result = { succeeded: false, info: 'Lane information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('update lane', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'socket', boardId, 'update lane');
      let result: any = {};
      try {  
        if (data.lane) {
          if (boardId == data.lane.boardId) {
            await this.laneService.update(data.lane);
            this.nsp.to(boardId).emit('update lane', { lane: data.lane });
            result = { succeeded: true, info: 'Lane update successfully.' };
          } else {
            result = { succeeded: false, info: 'Permission denied.' };
          }          
        } else {
          result = { succeeded: false, info: 'Lane information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('remove lane', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'socket', boardId, 'remove lane');
      let result: any = {};
      try {  
        if (data.lane.laneId) {
          if (boardId == data.lane.boardId) {
            await this.laneService.remove(data.lane.laneId);
            this.nsp.to(boardId).emit('remove lane', { lane: data.lane });
            result = { succeeded: true, info: 'Lane remove successfully.' };
          } else {
            result = { succeeded: false, info: 'Permission denied.' };
          }          
        } else {
          result = { succeeded: false, info: 'Lane id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('create list', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'socket', boardId, 'create list');
      let result: any = {};
      try {  
        if (data.list) {
          if (boardId == data.list.boardId) {
            const list = await this.listService.create(data.list);
            this.nsp.to(boardId).emit('create list', { list });
            result = { succeeded: true, info: 'List create successfully.' };
          } else {
            result = { succeeded: false, info: 'Permission denied.' };
          }   
        } else {
          result = { succeeded: false, info: 'List information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('update list', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'socket', boardId, 'update list');
      let result: any = {};
      try {  
        if (data.list) {
          if (boardId == data.list.boardId) {
            await this.listService.update(data.list);
            this.nsp.to(boardId).emit('update list', { list: data.list });
            result = { succeeded: true, info: 'List update successfully.' };
          } else {
            result = { succeeded: false, info: 'Permission denied.' };
          }   
        } else {
          result = { succeeded: false, info: 'List information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('remove list', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'socket', boardId, 'remove list');
      let result: any = {};
      try {  
        if (data.list.listId) {
          if (boardId == data.list.boardId) {
            await this.listService.remove(data.list.listId);
            this.nsp.to(boardId).emit('remove list', { list: data.list });
            result = { succeeded: true, info: 'List remove successfully.' };
          } else {
            result = { succeeded: false, info: 'Permission denied.' };
          }   
        } else {
          result = { succeeded: false, info: 'List id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });
  }
}