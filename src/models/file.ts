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
      let result: any;
      await this.connection.transaction(async () => {     
        let sql = 'SELECT `file_id` AS `fileId` FROM `file_user` WHERE `file_id` IN (?)';
        result = (await this.connection.query(sql, [fileIds])).info;
        result.forEach((item: any) => {
          const j = fileIds.indexOf(item.fileId);
          if (j !== -1) {
            fileIds.splice(j,1);
          }
        });
        sql = 'SELECT `file_id` AS `fileId`, `file_type` AS `fileType`, `path` FROM `file` WHERE `file_id` IN (?)';
        result = (await this.connection.query(sql, [fileIds])).info;
        sql = 'DELETE FROM `file` WHERE `file_id` IN (?)';
        await this.connection.query(sql, [fileIds]);             
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

  async addFileShare(fileId: number, shareUser: number, createUser: number) {
    try {
      await this.connection.transaction(async () => {     
        const sql = 'INSERT INTO `file_share` (`file_id`, `share_user`, `create_user`) VALUES (?,?,?)';
        await this.connection.query(sql, [fileId, shareUser, createUser]);       
      });
    } catch (err) {
      throw err;
    }
  }

  async removeFileShare(fileId: number, shareUser: number, createUser: number) {
    try {
      await this.connection.transaction(async () => {     
        const sql = 'DELETE FROM `file_share` WHERE `file_id` = ? AND `share_user` = ? AND `create_user` = ?';
        await this.connection.query(sql, [fileId, shareUser, createUser]);       
      });
    } catch (err) {
      throw err;
    }
  }
}