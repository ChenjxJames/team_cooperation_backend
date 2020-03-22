import TagImpl, { Tag } from "../models/tag";

export class TagService {
  tag: TagImpl;

  constructor() {
    this.tag = new TagImpl();
  }

  async query(boardId: number) {
    try {
      return await this.tag.query(boardId);
    } catch (err) {
      throw err;
    }
  }

  async create(tag: Tag) {
    try {
      return await this.tag.create(tag);
    } catch (err) {
      throw err;
    }
  }

  async update(tag: Tag) {
    try {
      return await this.tag.update(tag);
    } catch (err) {
      throw err;
    }
  }

  async remove(tagId: number) {
    try {
      return await this.tag.remove(tagId);
    } catch (err) {
      throw err;
    }
  }
}