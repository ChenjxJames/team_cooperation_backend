import { Permission } from "../models/permission";

export class PermissionService {
  permission : Permission;

  constructor() {
    this.permission = new Permission();
  }

  async getAllRolePermissions() {
    try {
      return await this.permission.getAllRolePermissions();
    } catch (err) {
      throw err;
    }
  }
}