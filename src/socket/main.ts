import socketIo from 'socket.io';

import BoardSocket from './board';

export default class Socket {

  constructor(io: socketIo.Server, sessionMiddleware: any) {
    const boardNSP = io.of('/socket/board');
    const boardSocket = new BoardSocket(boardNSP);    
    boardNSP.on('connection', boardSocket.listener).use(sessionMiddleware);
  }
}