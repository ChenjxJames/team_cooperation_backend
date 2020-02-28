import { OrganizationImpl } from "../models/organization";
import { Permission } from "../models/permission";
import Mail from "../lib/mail";

export class OrganizationService {
  organization: OrganizationImpl;
  permission : Permission;

  constructor() {
    this.organization = new OrganizationImpl();
    this.permission = new Permission();
  }

  async getInformation(userId: number) {
    try {      
      await this.organization.getOrganizationByUserId(userId);
      let result = {
        id: 0, 
        name: '', 
        email: '', 
        role: '',
        permissions: ['join_organization'], 
        member: []
      }
      if (this.organization.organization_id) {
        const rolePermission = await this.permission.getPermissions(this.organization.organizationUser.role_id);
        const members = await this.organization.getOrganizationMembers();
        result = {
          id: this.organization.organization_id,
          name: this.organization.organization_name,
          email: this.organization.email,
          role: rolePermission.roleName,
          permissions: rolePermission.permissions,
          member: members,
        }
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateOrganization(userId: number, organizationName: string, organizationEmail: string) {
    try {
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
      await this.organization.createOrganization(userId, name, email);
    } catch (err) {
      throw err;
    }
  }

  async removeOrganization(userId: number) {
    try {
      await this.organization.getOrganizationByUserId(userId);
      await this.organization.removeOrganization();
    } catch (err) {
      throw err;
    }
  }

  async inviteMember(organizationId: number, organizationName: string, email: string, inviterName: string) {
    try {
      await this.organization.addUser(organizationId, email, 3);
      const mail = new Mail();
      await mail.sendInform(email, `已加入${organizationName}`, `您已在管理员${inviterName}的邀请下加入本组织。`);
    } catch (err) {
      throw err;
    }
  }

  async exitOrganization(userId: number) {
    try {
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
      await this.organization.getOrganizationByUserId(userId);
      await this.organization.removeUser(userId, this.organization.organization_id);
    } catch (err) {
      throw err;
    }
  }
}