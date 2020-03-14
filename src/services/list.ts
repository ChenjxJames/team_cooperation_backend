import ListImpl, { List } from "../models/list";

export class ListService {
  list: ListImpl;

  constructor() {
    this.list = new ListImpl();
  }

  async create(list: List) {
    try {
      return await this.list.create(list);
    } catch (err) {
      throw err;
    }
  }

  async update(list: List) {
    try {
      return await this.list.update(list);
    } catch (err) {
      throw err;
    }
  }

  async remove(listId: number) {
    try {
      return await this.list.remove(listId);
    } catch (err) {
      throw err;
    }
  }
}