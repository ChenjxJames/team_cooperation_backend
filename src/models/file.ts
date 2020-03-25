import { Connection } from "none-sql";
import { MySqlPool } from "../lib/mysql";

export interface File {
  fileId: number;
  fileType: string;
  md5: string;
  path: string;
  size: number;
  createTime: string;
}

export default class FileImpl implements File {
  fileId: number = 0;
  fileType: string = '';
  md5: string = '';
  path: string = '';
  size: number = 0;
  createTime: string = '';

  connection !: Connection;

  constructor() {
    MySqlPool.getConnection().then((result: any) => {
      this.connection = result;
    }).catch((error: any) => {
      console.error(error)
    })
  }  

  async getInformation(md5: string, size: number) {
    try {
      let sql = 'SELECT `file_id` AS `fileId`, `file_type` AS `fileType`, HEX(`md5`) AS `md5`, `path`, `size` FROM `file` WHERE `md5`=UNHEX(?) AND `size`=?';
      const result: any = await this.connection.query(sql, [md5, size]); 
      return result.info[0];
    } catch (err) {
      throw err;
    }
  }

  async getInformationByFileId(fileId: number) {
    try {
      let sql = 'SELECT `file_id` AS `fileId`, `file_type` AS `fileType`, HEX(`md5`) AS `md5`, `path`, `size` FROM `file` WHERE `file_id`=?';
      const result: any = await this.connection.query(sql, [fileId]); 
      return result.info[0];
    } catch (err) {
      throw err;
    }
  }

  async getInformationByUserId(userId: number, folderId: number) {
    try {
      let sql = 'SELECT `file_id` AS `fileId`, `file_name` AS `fileName`, `file_type` AS `fileType`, HEX(`md5`) AS `md5`, `path`, `size`, `create_time` AS `createTime` FROM `file` LEFT JOIN `file_user` USING(`file_id`) WHERE `user_id`=? AND `folder_id`=?';
      const result: any = await this.connection.query(sql, [userId, folderId]); 
      return result.info;
    } catch (err) {
      throw err;
    }
  }
  
  async create(file: any) {
    try {
      let sql = 'INSERT INTO `file` (`file_type`, `md5`, `path`, `size`) VALUES (?,UNHEX(?),?,?)';
      const result: any = await this.connection.query(sql, [file.fileType, file.md5, file.path, file.size]); 
      file.fileId = result.info.insertId;
      return file;
    } catch (err) {
      throw err;
    }
  }
  
  async remove(fileIds: number[]) {
    try {
      let result: any = [];
      await this.connection.transaction(async () => {     
        let sql = 'SELECT `file_id` AS `fileId` FROM `file_user` WHERE `file_id` IN (?) UNION SELECT `file_id` AS `fileId` FROM `file_share` WHERE `file_id` IN (?) UNION SELECT `file_id` AS `fileId` FROM `task_file` WHERE `file_id` IN (?)';
        const dontDelFilesId = (await this.connection.query(sql, [fileIds,fileIds,fileIds])).info;
        dontDelFilesId.forEach((item: any) => {
          const j = fileIds.indexOf(item.fileId);
          if (j !== -1) {
            fileIds.splice(j,1);
          }
        });
        if (fileIds.length) {
          sql = 'SELECT `file_id` AS `fileId`, `file_type` AS `fileType`, `path` FROM `file` WHERE `file_id` IN (?)';
          result = (await this.connection.query(sql, [fileIds])).info;
          sql = 'DELETE FROM `file` WHERE `file_id` IN (?)';
          await this.connection.query(sql, [fileIds]);     
        }                
      });
      return result;  
    } catch (err) {
      throw err;
    }
  }

  async addUserFile(fileId: number, userId: number, folderId: number, fileName: string) {
    try {
      await this.connection.transaction(async () => {     
        const sql = 'INSERT INTO `file_user` (`file_id`, `user_id`, `folder_id`, `file_name`) VALUES (?,?,?,?)';
        await this.connection.query(sql, [fileId, userId, folderId, fileName]);       
      });
    } catch (err) {
      throw err;
    }
  }

  async updateUserFileFolder(fileIds: number[], userId: number, folderId: number, newFolderId: number) {
    try {
      await this.connection.transaction(async () => {     
        const sql = 'UPDATE `file_user` SET `folder_id` = ? WHERE `file_id` in (?) AND `user_id` = ? AND `folder_id` = ?';
        await this.connection.query(sql, [newFolderId, fileIds, userId, folderId]);       
      });
    } catch (err) {
      throw err;
    }
  }

  async updateUserFileName(fileId: number, userId: number, fileName: string, folderId: number) {
    try {
      await this.connection.transaction(async () => {     
        const sql = 'UPDATE `file_user` SET `file_name` = ? WHERE `file_id` = ? AND `user_id` = ? AND `folder_id` = ?';
        await this.connection.query(sql, [fileName, fileId, userId, folderId]);       
      });
    } catch (err) {
      throw err;
    }
  }

  async removeUserFile(fileIds: number[], userId: number, folderId: number) {
    try {
      await this.connection.transaction(async () => {     
        const sql = 'DELETE FROM `file_user` WHERE `file_id` in (?) AND `user_id` = ? AND `folder_id` = ?';
        await this.connection.query(sql, [fileIds, userId, folderId]);       
      });
    } catch (err) {
      throw err;
    }
  }

  async getFileSharedWithMe(userId: number) {
    try {
      const sql = 'SELECT `file_id` AS `fileId`, `file_name` AS `fileName`, `create_user` AS `userId`, `file_type` AS `fileType`, HEX(`md5`) AS `md5`, `path`, `size`, `username`, `email`, `file_share`.`create_time` AS `createTime` FROM `file_share` LEFT JOIN `file` USING(`file_id`) LEFT JOIN `user` ON `file_share`.`create_user`=`user`.`user_id` WHERE `share_user`=?';
      const result: any = (await this.connection.query(sql, [userId])).info;
      return result;       
    } catch (err) {
      throw err;
    }
  }

  async addFileShare(fileId: number, fileName: string, shareUser: number, createUser: number) {
    try {
      await this.connection.transaction(async () => {     
        const sql = 'INSERT INTO `file_share` (`file_id`, `file_name`, `share_user`, `create_user`) VALUES (?,?,?,?)';
        await this.connection.query(sql, [fileId, fileName, shareUser, createUser]);       
      });
    } catch (err) {
      throw err;
    }
  }

  async saveShareFile(files: any[], folderId: number, shareUser: number) {
    try {
      await this.connection.transaction(async () => {     
        const fileIds = files.map((file: any) => file.fileId);
        let arg = '(';
        let sql = 'INSERT INTO `file_user` (`file_id`, `user_id`, `folder_id`, `file_name`) VALUES ';
        files.forEach((file: any) => {
          sql+=`(${file.fileId},${shareUser},${folderId},'${file.fileName}'),`;
          arg+=`(${file.fileId},${file.userId}),`;
        });
        sql = sql.substring(0,sql.length-1);
        arg = arg.substring(0,arg.length-1)+')';
        await this.connection.query(sql, []); 
        sql = 'DELETE FROM `file_share` WHERE `share_user` = ? AND (`file_id`, `create_user`) in '+arg;
        await this.connection.query(sql, [shareUser]);       
      });
    } catch (err) {
      throw err;
    }
  }

  async removeFileShare(files: any[], shareUser: number) {
    try { 
      let arg = '(';
      files.forEach((file: any) => {
        arg+=`(${file.fileId},${file.userId}),`;
      });
      arg = arg.substring(0,arg.length-1)+')';
      const sql = 'DELETE FROM `file_share` WHERE `share_user` = ? AND (`file_id`, `create_user`) in '+arg;
      await this.connection.query(sql, [shareUser]);       
    } catch (err) {
      throw err;
    }
  }
}