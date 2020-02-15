import { OrganizationImpl } from '../models/organization';
import { OrganizationService } from '../services/organization';

export class OrganizationControl {
  organizationService: OrganizationService;
  
  constructor() {
    this.organizationService = new OrganizationService();
  }

  information = async (ctx: any) => {
    try {
      let userId = ctx.session.user_id;
      if (userId) {
        let result = await this.organizationService.getInformation(userId);
        ctx.session.organization = result.data;
        ctx.body = result;
      } else {
        ctx.body = { succeeded: false, info: 'Please login.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  create = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      let userId = ctx.session.user_id;
      if (userId) {
        if (requestBody.name) {
          let result = await this.organizationService.createOrganization(userId, requestBody.name, requestBody.email);
          ctx.body = result;
        } else {
          ctx.body = { succeeded: false, info: 'Organization name is null.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Please login.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  update = async (ctx: any) => {
    
  }

  remove = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      let userId = ctx.session.user_id;
      if (userId) {
        if (requestBody.organization_id) {
          let result = await this.organizationService.removeOrganization(userId);
          ctx.body = result;
        } else {
          ctx.body = { succeeded: false, info: 'Organization id is null.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Please login.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  join = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      let userId = ctx.session.user_id;
      if (userId) {
        if (requestBody.organization_id) {
          let result = await this.organizationService.joinOrganization(userId, requestBody.organization_id);
          ctx.body = result;
        } else {
          ctx.body = { succeeded: false, info: 'Organization id is null.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Please login.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  exit = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      let userId = ctx.session.user_id;
      if (userId) {
        let result = await this.organizationService.exitOrganization(userId);
        ctx.body = result;
      } else {
        ctx.body = { succeeded: false, info: 'Please login.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  setRole = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      let userId = ctx.session.user_id;
      if (userId) {
        if (requestBody.user_id && requestBody.role_id) {
          const permissions = ctx.session.organization.permissions;
          if (permissions.some((permission: string)=> permission=='manage_organization_admin')) {
            await this.organizationService.setRole(requestBody.user_id, requestBody.role_id);
            ctx.body = { succeeded: true, info: 'Role changed successfully.' };
          } else {
            ctx.body = { succeeded: false, info: 'Permission denied.' };
          }          
        } else {
          ctx.body = { succeeded: false, info: 'User id or roel id is null.' };
        }        
      } else {
        ctx.body = { succeeded: false, info: 'Please login.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
}