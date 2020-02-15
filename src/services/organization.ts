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
        return result
      } else {
        return  {
          permissions: ['join_organization']
        };
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
      await this.organization.createOrganization(userId, name, email);
    } catch (err) {
      throw err;
    }
  }

  async removeOrganization(userId: number) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      await this.organization.removeOrganization();
    } catch (err) {
      throw err;
    }
  }

  async joinOrganization(userId: number, orgId: number) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      await this.organization.addUser(orgId, userId, 3);
    } catch (err) {
      throw err;
    }
  }

  async exitOrganization(userId: number) {
    try {
      await this.organization.init();
      await this.organization.getOrganizationByUserId(userId);
      await this.organization.removeUser(userId, this.organization.organization_id);
    } catch (err) {
      throw err;
    }
  }

  async setRole(organizationId: number, userId: number, roleId: number) {
    try { 
      this.organization.setRole(organizationId, userId, roleId);
    } catch (err) {
      throw err;
    }
  }

  async removeMember(userId: number) {
    try { 
      this.organization.removeUser(userId, this.organization.organization_id);
    } catch (err) {
      throw err;
    }
  }
}