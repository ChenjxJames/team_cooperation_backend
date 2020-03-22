import socketIo from 'socket.io';

import { BoardService } from "../services/board";
import { TeamService } from "../services/team";
import { LaneService } from "../services/lane";
import { ListService } from "../services/list";
import { TaskService } from '../services/task';
import { SubTaskService } from '../services/subTask';
import { CommentService } from '../services/comment';
import { TagService } from '../services/tag';

export default class BoardSocket {
  boardService = new BoardService();
  teamService = new TeamService();
  laneService = new LaneService();
  listService = new ListService();
  taskService = new TaskService();
  subTaskService = new SubTaskService();
  commentService = new CommentService();
  tagService = new TagService();

  nsp: socketIo.Namespace;

  constructor(nsp: socketIo.Namespace) {
    this.nsp = nsp;
  }

  listener = (socket: any) => {
    const userId = socket.session.user_id;

    if (!userId) {
      socket.emit('message', { succeeded: false, info: 'Please login.' });
    }
  
    console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket connect board');
  
    socket.on('disconnect', () => {
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket disconnect board');
    });
  
    socket.on('join', async (data: any, fn: any) => {
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket join board', data.boardId);
      let result: any = {};
      try {  
        const boards = await this.boardService.getInformation(userId);
        if (boards.some((board: any) => board.boardId == data.boardId)) {
          socket.join(data.boardId);
          const board = await this.boardService.getInformationByBoardId(data.boardId);
          const team = await this.teamService.getInformationByTeamId(board.teamId, userId);
          const tags = await this.tagService.query(data.boardId);
          result = { succeeded: true, info: 'Board information get successfully.', data: { ...board, team, tags } };
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
    
    socket.on('update', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'update');
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
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'create lane');
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
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'update lane');
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
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'remove lane');
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
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'create list');
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
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'update list');
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
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'remove list');
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

    socket.on('create task', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'create task');
      let result: any = {};
      try {  
        if (data.task) {
          const task = await this.taskService.create(data.task);
          this.nsp.to(boardId).emit('create task', { task });
          result = { succeeded: true, info: 'Task create successfully.' };
        } else {
          result = { succeeded: false, info: 'Task information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('update task', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'update task');
      let result: any = {};
      try {  
        if (data.task) {
          await this.taskService.update(data.task);
          this.nsp.to(boardId).emit('update task', { task: data.task });
          result = { succeeded: true, info: 'Task update successfully.' };
        } else {
          result = { succeeded: false, info: 'Task information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('join task room', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'join task room', data.task.taskId);
      let result: any = {};
      try {  
        if (data.task) {
          socket.join('task_'+data.task.taskId);
          let resultData: any = {};
          if (data.task.haveSubTask) {
            resultData.subTask = await this.subTaskService.query(data.task.taskId);
          }
          if (data.task.haveComment) {
            resultData.comment = await this.commentService.query(data.task.taskId);
          }
          if (data.task.haveUser) {
            resultData.member = await this.taskService.queryMember(data.task.taskId);
          }
          if (data.task.haveTag) {
            resultData.taskTags = await this.taskService.queryTag(data.task.taskId);
          }
          result = { succeeded: true, info: 'Join task room successfully.', data: resultData };
        } else {
          result = { succeeded: false, info: 'Task information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('exit task room', async (data: any, fn: any) => {
      const boardId  = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'Exit task room', data.task.taskId);
      let result: any = {};
      try {  
        if (data.task) {
          socket.leave('task_'+data.task.taskId);
          result = { succeeded: true, info: 'Exit task room successfully.' };
        } else {
          result = { succeeded: false, info: 'Task information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('create sub task', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'create sub task');
      let result: any = {};
      try {  
        if (data.subTask) {
          const subTask = await this.subTaskService.create(data.subTask);
          this.nsp.to(taskRoom).emit('create sub task', { subTask });
          result = { succeeded: true, info: 'Create sub task successfully.' };
        } else {
          result = { succeeded: false, info: 'Sub task information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('update sub task', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'update sub task');
      let result: any = {};
      try {  
        if (data.subTask) {
          const subTask = this.subTaskService.update(data.subTask);
          this.nsp.to(taskRoom).emit('update sub task', { subTask });
          result = { succeeded: true, info: 'Update sub task successfully.' };
        } else {
          result = { succeeded: false, info: 'Sub task information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('remove sub task', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'remove sub task');
      let result: any = {};
      try {  
        if (data.subTaskId) {
          this.subTaskService.remove(data.subTaskId);
          this.nsp.to(taskRoom).emit('remove sub task', { subTaskId: data.subTaskId });
          result = { succeeded: true, info: 'Remove sub task successfully.' };
        } else {
          result = { succeeded: false, info: 'Sub task id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('create comment', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'create comment');
      let result: any = {};
      try {  
        if (data.comment) {
          const comment = await this.commentService.create(data.comment);
          this.nsp.to(taskRoom).emit('create comment', { comment });
          result = { succeeded: true, info: 'Create comment successfully.' };
        } else {
          result = { succeeded: false, info: 'Comment information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('remove comment', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'remove comment');
      let result: any = {};
      try {  
        if (data.commentId) {
          this.commentService.remove(data.commentId);
          this.nsp.to(taskRoom).emit('remove comment', { commentId: data.commentId });
          result = { succeeded: true, info: 'Remove comment successfully.' };
        } else {
          result = { succeeded: false, info: 'Comment id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('add member', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'add member');
      let result: any = {};
      try {  
        if (data.userId) {
          this.taskService.addMember(data.userId, +taskRoom.split('_')[1]);
          this.nsp.to(taskRoom).emit('add member', { userId: data.userId });
          result = { succeeded: true, info: 'Add task member successfully.' };
        } else {
          result = { succeeded: false, info: 'User id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('remove member', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'remove member');
      let result: any = {};
      try {  
        if (data.userId) {
          this.taskService.removeMember(data.userId, +taskRoom.split('_')[1]);
          this.nsp.to(taskRoom).emit('remove member', { userId: data.userId });
          result = { succeeded: true, info: 'Remove task member successfully.' };
        } else {
          result = { succeeded: false, info: 'User id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('create tag', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'create tag');
      let result: any = {};
      try {  
        if (data.tag) {
          const tag = await this.tagService.create({ ...data.tag, boardId });
          this.nsp.to(boardId).emit('create tag', { tag });
          result = { succeeded: true, info: 'Create tag successfully.' };
        } else {
          result = { succeeded: false, info: 'Tag information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('update tag', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'update tag');
      let result: any = {};
      try {  
        if (data.tag) {
          this.tagService.update(data.tag);
          this.nsp.to(boardId).emit('update tag', { tag: data.tag });
          result = { succeeded: true, info: 'Update tag successfully.' };
        } else {
          result = { succeeded: false, info: 'Tag information is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('remove tag', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'remove tag');
      let result: any = {};
      try {  
        if (data.tagId) {
          this.tagService.remove(data.tagId);
          this.nsp.to(boardId).emit('remove tag', { tagId: data.tagId });
          result = { succeeded: true, info: 'Remove tag successfully.' };
        } else {
          result = { succeeded: false, info: 'Tag id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('add task tag', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'add task tag');
      let result: any = {};
      try {  
        if (data.tagId) {
          this.taskService.addTag(data.tagId, +taskRoom.split('_')[1]);
          this.nsp.to(taskRoom).emit('add task tag', { tagId: data.tagId });
          result = { succeeded: true, info: 'Add task tag successfully.' };
        } else {
          result = { succeeded: false, info: 'Tag id is null.' };
        }
      } catch (err) {
        console.error(err);
        result = { succeeded: false, info: 'Server error.', error: err };
      } finally {
        fn(result);
      }
    });

    socket.on('remove task tag', async (data: any, fn: any) => {
      const boardId = Object.keys(socket.rooms)[0]; 
      const taskRoom = Object.keys(socket.rooms)[2];
      console.log((new Date()).toLocaleString(), 'userID_'+userId, 'socket', boardId, 'remove task tag');
      let result: any = {};
      try {  
        if (data.tagId) {
          this.taskService.removeTag(data.tagId, +taskRoom.split('_')[1]);
          this.nsp.to(taskRoom).emit('remove task tag', { tagId: data.tagId });
          result = { succeeded: true, info: 'Remove task tag successfully.' };
        } else {
          result = { succeeded: false, info: 'Tag id is null.' };
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