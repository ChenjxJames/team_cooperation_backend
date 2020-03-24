import Router from 'koa-router';
import { FileControl } from '../controllers/file';

export class FileRouter {

  router: Router;

  constructor(){ 
    this.router = new Router();
    const control = new FileControl();
    this.router
    .post('/upload', control.upload)
    .post('/createFolder', control.createFolder)
    .post('/remove', control.remove)
    .post('/update', control.update)
    .post('/setFolder', control.setFolder)
    .post('download', control.download)
    .get('/:id', control.getInformation);
  }
  
}