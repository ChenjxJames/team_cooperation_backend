import path from 'path';
import fs from 'fs';

import { FileService } from '../services/file';
import { UserService } from '../services/user';

export class FileControl {
  fileService: FileService;
  userService: UserService;
  
  constructor() {
    this.fileService = new FileService();
    this.userService = new UserService();
  }

  getInformation = async (ctx: any) => {
    try {
      const folderId = ctx.params.id;
      const userId = ctx.session.user_id;
      if (folderId) {        
        const result = await this.fileService.getInformationByUserId(userId, folderId);        
        ctx.body = { succeeded: true, info: 'Get file information successfully.', data: result };
      } else {
        ctx.body = { succeeded: false, info: 'Folder id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  createFolder = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body
      const folderName = requestBody.folderName;
      const folderId = requestBody.folderId;
      if (folderName && typeof(folderId) !== "undefined") {    
        const result = await this.fileService.create({ fileType: 'folder', md5: '0', path: '', size: 0 });
        await this.fileService.addUserFile(result.fileId, ctx.session.user_id, folderId, folderName);          
        ctx.body = { succeeded: true, info: 'Create folder successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'Folder information is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  upload = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body
      const fileName = requestBody.fileName;
      const fileType = requestBody.fileType;
      const md5 = requestBody.md5;
      const size = requestBody.size;
      const folderId = requestBody.folderId;
      if (fileName && fileType && md5 && folderId) {        
        const serverFile = await this.fileService.getInformation(md5, size);
        if (serverFile) { // 若服务器已经存有该文件
          await this.fileService.addUserFile(serverFile.fileId, ctx.session.user_id, folderId, fileName);
        } else {
          // 上传单个文件
          const file = ctx.request.files.file; // 获取上传文件
          const uploadPath = path.join(__dirname, '../../public/upload/'); // 创建可读流
          const reader = fs.createReadStream(file.path);
          if(!fs.existsSync(uploadPath)){  //判断upload文件夹是否存在，如果不存在就新建一个
            fs.mkdir(uploadPath, (err: any) => {
              if (err) { throw new Error(err); }
            });
          }
          const filePath = uploadPath + `${file.name}`;
          const upStream = fs.createWriteStream(filePath); // 创建可写流
          reader.pipe(upStream); // 可读流通过管道写入可写流
          const result = await this.fileService.create({ fileType, md5, path: filePath, size });
          await this.fileService.addUserFile(result.fileId, ctx.session.user_id, folderId, fileName);
        }               
        ctx.body = { succeeded: true, info: 'Upload file successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'File information is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  remove = async (ctx: any) => {
    try{
      let requestBody = ctx.request.body
      const fileIds = requestBody.fileIds;
      const folderId = requestBody.folderId;
      if (fileIds.length) {    
        await this.fileService.removeUserFile(fileIds, ctx.session.user_id, folderId);  
        const result: any = await this.fileService.remove(fileIds);
        result.forEach((item: any) => {
          if (item.fileType !== 'folder') {
            fs.unlink(item.path, (err: any) => {
              if (err) { throw new Error(err); }
            });
          }
        });
        ctx.body = { succeeded: true, info: 'Remove file successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'File id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
  
  update = async (ctx: any) => {
    try{
      let requestBody = ctx.request.body
      const fileId = requestBody.fileId;
      const fileName = requestBody.fileName;
      const folderId = requestBody.folderId;
      if (fileId && fileName && folderId) {    
        await this.fileService.updateUserFileName(fileId, ctx.session.user_id, fileName, folderId);    
        ctx.body = { succeeded: true, info: 'File information update successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'File information is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  setFolder = async (ctx: any) => {
    try{
      let requestBody = ctx.request.body
      const fileIds = requestBody.fileIds;
      const folderId = requestBody.folderId;
      const newFolderId = requestBody.newFolderId;
      if (fileIds.length && typeof(folderId) !== "undefined" && typeof(newFolderId) !== "undefined") {    
        await this.fileService.updateUserFileFolder(fileIds, ctx.session.user_id, folderId, newFolderId);    
        ctx.body = { succeeded: true, info: 'File information update successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'File information is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  download = async (ctx: any) => {
    try{
      let requestBody = ctx.request.body
      const fileId = requestBody.fileId;
      const fileName = requestBody.fileName;
      if (fileId && fileName) {   
        const filePath = (await this.fileService.getInformationByFileId(fileId)).path;        
        const stats = fs.statSync(filePath);
        ctx.set('Content-Type', 'application/octet-stream');
        ctx.set('Content-Disposition', 'attachment; filename=' + fileName);
        ctx.set('Content-Length', stats.size);
        ctx.body = fs.createReadStream(filePath);
      } else {
        ctx.body = { succeeded: false, info: 'File id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
  
  share = async (ctx: any) => {
    try{
      let requestBody = ctx.request.body
      const fileId = requestBody.fileId;
      const fileName = requestBody.fileName;
      const email = requestBody.email;
      if (fileId && fileName && email) {    
        const shareUser = await this.userService.getUserIdByEmail(email);
        if (typeof shareUser === 'number') {
          await this.fileService.addFileShare(fileId, fileName, shareUser, ctx.session.user_id);
          ctx.body = { succeeded: true, info: 'File share successfully.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'File information is null.' };
      }
    } catch (err) {
      console.error(err);
      if (err === "Email is error") {
        ctx.body = { succeeded: false, info: 'The corresponding user of this email was not found.'  };
      } else {
        ctx.body = { succeeded: false, info: 'Server error.', error: err };
      }      
    }
  }

  shareWithMe = async (ctx: any) => {
    try{
      const userId = ctx.session.user_id;
      const result = await this.fileService.getFileSharedWithMe(userId);
      ctx.body = { succeeded: true, info: 'Successfully get file shared with me.', data: result};
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  saveShareFile = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      const files = requestBody.files;
      const folderId = requestBody.folderId;
      if (files.length && typeof(folderId) !== "undefined") {        
        await this.fileService.saveShareFile(files, folderId, ctx.session.user_id);
        ctx.body = { succeeded: true, info: 'Save file successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'File information is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  removeFileShare = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      const files = requestBody.files;
      if (files.length) {        
        await this.fileService.removeFileShare(files, ctx.session.user_id);
        ctx.body = { succeeded: true, info: 'Remove file share successfully.' };
      } else {
        ctx.body = { succeeded: false, info: 'File information is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
}
