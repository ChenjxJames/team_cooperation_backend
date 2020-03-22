import CommentImpl, { Comment } from "../models/comment";

export class CommentService {
  comment: CommentImpl;

  constructor() {
    this.comment = new CommentImpl();
  }

  async create(comment: any) {
    try {
      return await this.comment.create(comment);
    } catch (err) {
      throw err;
    }
  }

  async update(comment: Comment) {
    try {
      return await this.comment.update(comment);
    } catch (err) {
      throw err;
    }
  }

  async remove(commentId: number) {
    try {
      return await this.comment.remove(commentId);
    } catch (err) {
      throw err;
    }
  }

  async query(taskId: number) {
    try {
      return await this.comment.query(taskId);
    } catch (err) {
      throw err;
    }
  }
}