import { OrganizationImpl } from "../models/organization";

export class OrganizationService {
  organization: OrganizationImpl;

  constructor() {
    this.organization = new OrganizationImpl();
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
}