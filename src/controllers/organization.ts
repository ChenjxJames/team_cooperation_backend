import { OrganizationImpl } from '../models/organization';
import { OrganizationService } from '../services/organization';

export class OrganizationControl {
  organizationService: OrganizationService;
  
  constructor() {
    this.organizationService = new OrganizationService();
  }

  information = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const result = await this.organizationService.getInformation(userId);
      ctx.session.organization = result;
      ctx.body = { succeeded: true, info: 'Get organization information successful.', data: result };
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  create = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      const userId = ctx.session.user_id;
      const permissions = ctx.session.organization.permissions;
      if (requestBody.name) {
        if (permissions.some((permission: string)=> permission=='join_organization')) {
          await this.organizationService.createOrganization(userId, requestBody.name, requestBody.email);
          ctx.body = { succeeded: true, info: 'Organization create successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Organization name is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  update = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.name) {
        const permissions = ctx.session.organization.permissions;
        if (permissions.some((permission: string)=> permission=='set_organization_info')) {
          await this.organizationService.updateOrganization(ctx.session.user_id, requestBody.name, requestBody.email);
          ctx.body = { succeeded: true, info: 'Organization information changed successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }          
      } else {
        ctx.body = { succeeded: false, info: 'Organization name is null.' };
      }   
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  remove = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const permissions = ctx.session.organization.permissions;
      if (permissions.some((permission: string)=> permission=='remove_organization')) {
        await this.organizationService.removeOrganization(userId);
        ctx.body = { succeeded: true, info: 'Organization delete successfully.' };;
      } else {
        ctx.body = { succeeded: false, info: 'Permission denied.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  join = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      const userId = ctx.session.user_id;
      const permissions = ctx.session.organization.permissions;
      if (requestBody.organization_id) {
        if (permissions.some((permission: string)=> permission=='join_organization')) {
          await this.organizationService.joinOrganization(userId, requestBody.organization_id);
          ctx.body = { succeeded: true, info: 'Join organization successful.' };;
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Organization id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  exit = async (ctx: any) => {
    try {
      const userId = ctx.session.user_id;
      const permissions = ctx.session.organization.permissions;
      if (permissions.some((permission: string)=> permission=='exit_organization')) {
        await this.organizationService.exitOrganization(userId);
        ctx.body = { succeeded: true, info: 'Exit organization successful.' };
      } else {
        ctx.body = { succeeded: false, info: 'Permission denied.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  setRole = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.user_id && requestBody.role_id) {
        const permissions = ctx.session.organization.permissions;
        if (permissions.some((permission: string)=> permission=='set_organization_admin')) {
          await this.organizationService.setRole(ctx.session.organization.id, requestBody.user_id, requestBody.role_id);
          ctx.body = { succeeded: true, info: 'Role changed successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }          
      } else {
        ctx.body = { succeeded: false, info: 'User id or roel id is null.' };
      }        
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  removeMember = async (ctx: any) => {
    try {
      const requestBody = ctx.request.body;
      if (requestBody.user_id) {
        const permissions = ctx.session.organization.permissions;
        if (permissions.some((permission: string)=> permission=='manage_organization_member')) {
          await this.organizationService.removeMember(requestBody.user_id);
          ctx.body = { succeeded: true, info: 'Organization member remove successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Permission denied.' };
        }          
      } else {
        ctx.body = { succeeded: false, info: 'User id is null.' };
      }        
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

}