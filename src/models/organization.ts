import { Connection } from 'none-sql';

interface Organization {
  _organization_id: number;
  organization_name: string;
  email: string;
  create_time: string;
}

export class OrganizationImpl implements Organization {

  _organization_id: number = 0;
  get organization_id() {
    return this._organization_id;
  }
  organization_name: string = '';
  email: string = '';
  create_time: string = '';

  connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  setValues() {

  }

  save() {

  }

  updateOrganization() {

  }

  createOrganization() {

  }

  addUser() {

  }

  removeUser() {

  }

  setRole() {

  }

}