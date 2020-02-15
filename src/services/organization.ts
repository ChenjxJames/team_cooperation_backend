import { OrganizationImpl } from "../models/organization";
import { Permission } from "../models/permission";

export class OrganizationService {
  organization: OrganizationImpl;

  constructor() {
    this.organization = new OrganizationImpl();
  }

  async getInformation(userId: number) {
    try { 
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      if (this.organization.organization_id) {
        let permission = new Permission();
        await permission.init();
        const rolePermission = await permission.getPermissions(this.organization.organizationUser.role_id);
        let result = {
          id: this.organization.organization_id,
          name: this.organization.organization_name,
          email: this.organization.email,
          role: rolePermission.roleName,
          permissions: rolePermission.permissions
        }
        return { succeeded: true, info: 'Get organization information successful.', data: result };
      } else {
        return { succeeded: false, info: 'This user is not belong to any organization.' };
      }  
    } catch (err) {
      throw err;
    }
  }

  async updateOrganization(userId: number, organizationName: string, organizationEmail: string) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      this.organization.organization_name = organizationName;
      this.organization.email = organizationEmail;
      this.organization.save();
    } catch (err) {
      throw err;
    }
  }

  async createOrganization(userId: number, name: string, email: string) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      if (this.organization.organization_id) {
        return { succeeded: false, info: 'A user can only belong to one organization.' };
      }
      return await this.organization.createOrganization(userId, name, email);
    } catch (err) {
      throw err;
    }
  }

  async removeOrganization(userId: number) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      if (this.organization.organization_id) {
        return await this.organization.removeOrganization();
      } else {
        return { succeeded: false, info: 'This user is not belong to any organization.' };
      }      
    } catch (err) {
      throw err;
    }
  }

  async joinOrganization(userId: number, orgId: number) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      if (this.organization.organization_id) {
        return { succeeded: false, info: 'A user can only belong to one organization.' };
      }
      await this.organization.addUser(orgId, userId, 3);
      return { succeeded: true, info: 'Join organization successful.' };
    } catch (err) {
      throw err;
    }
  }

  async exitOrganization(userId: number) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      if (this.organization.organization_id) {
        if (this.organization.organizationUser.role_id = 1) {
          return { succeeded: false, info: 'Super admin cannot exit organization. Please try resetting the super admin.' };
        }
        await this.organization.removeUser(userId);
        return { succeeded: true, info: 'Exit organization successful.' };
      } else {
        return { succeeded: false, info: 'This user is not belong to any organization.' };
      }
      
    } catch (err) {
      throw err;
    }
  }

  async setRole(userId: number, roleId: number) {
    try { 
      this.organization.setRole(userId, roleId);
    } catch (err) {
      throw err;
    }
  }
}