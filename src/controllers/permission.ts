import { PermissionService } from '../services/permission';

export class PermissionControl {
  permissionService: PermissionService;
  
  constructor() {
    this.permissionService = new PermissionService();
  }

  allRolePermissions = async (ctx: any) => {
    try {
      const result = await this.permissionService.getAllRolePermissions();
      ctx.body = { succeeded: true, info: 'Get all role permissions information successful.', data: result };
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
}