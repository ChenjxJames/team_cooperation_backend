import FileImpl, { File } from "../models/file";

export class FileService {
  file: FileImpl;

  constructor() {
    this.file = new FileImpl();
  }

  async getInformation(md5: string, size: number) {
    try {
      return await this.file.getInformation(md5, size);
    } catch (err) {
      throw err;
    }
  }

  async getInformationByFileId(fileId: number) {
    try {
      return await this.file.getInformationByFileId(fileId);
    } catch (err) {
      throw err;
    }
  }
  
  async getInformationByUserId(userId: number, folderId: number) {
    try {
      return await this.file.getInformationByUserId(userId, folderId);
    } catch (err) {
      throw err;
    }
  }

  async create(file: any) {
    try {
      return await this.file.create(file);
    } catch (err) {
      throw err;
    }
  }

  async remove(fileIds: number[]) {
    try {
      return await this.file.remove(fileIds);
    } catch (err) {
      throw err;
    }
  }

  async addUserFile(fileId: number, userId: number, folderId: number, fileName: string) {
    try {
      return await this.file.addUserFile(fileId, userId, folderId, fileName);
    } catch (err) {
      throw err;
    }
  }

  async updateUserFileFolder(fileIds: number[], userId: number, folderId: number, newFolderId: number) {
    try {
      return await this.file.updateUserFileFolder(fileIds, userId, folderId, newFolderId);
    } catch (err) {
      throw err;
    }
  }

  async updateUserFileName(fileId: number, userId: number, fileName: string, folderId: number) {
    try {
      return await this.file.updateUserFileName(fileId, userId, fileName, folderId);
    } catch (err) {
      throw err;
    }
  }

  async removeUserFile(fileIds: number[], userId: number, folderId: number) {
    try {
      return await this.file.removeUserFile(fileIds, userId, folderId);
    } catch (err) {
      throw err;
    }
  }

  async getFileSharedWithMe(userId: number) {
    try {
      return await this.file.getFileSharedWithMe(userId);
    } catch (err) {
      throw err;
    }
  }

  async addFileShare(fileId: number, fileName: string, shareUser: number, createUser: number) {
    try {
      return await this.file.addFileShare(fileId, fileName, shareUser, createUser);
    } catch (err) {
      throw err;
    }
  }

  async saveShareFile(files: any[], folderId: number, shareUser: number) {
    try {
      return await this.file.saveShareFile(files, folderId, shareUser);
    } catch (err) {
      throw err;
    }
  }

  async removeFileShare(files: any[], shareUser: number) {
    try {
      return await this.file.removeFileShare(files, shareUser);
    } catch (err) {
      throw err;
    }
  } 
}