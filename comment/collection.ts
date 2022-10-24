import type {HydratedDocument, Types} from 'mongoose';
import type {Comment} from './model';
import CommentModel from './model';

class CommentCollection {
  /**
   * Find a comment by commentId
   *
   * @param {string} commentId - The id of the comment to find
   * @return {Promise<HydratedDocument<Comment>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(commentId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    return CommentModel.findOne({_id: commentId}).populate('userId');
  }

  /**
   * Add a Comment to the collection
   *
   * @param {string} userId - The id of the author of the comment
   * @param {string} content - The content of the comment
   * @param {string} freetId - The freet the comment is a child to
   * @return {Promise<HydratedDocument<Comment>>} - The newly created freet
   */
  static async addOneToFreet(freetId: Types.ObjectId | string, content: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      userId,
      content,
      dateCreated: date,
      parent: freetId
    });
    await comment.save(); // Saves comment to MongoDB
    return comment.populate('userId');
  }

  /**
   * Add a comment to the collection
   *
   * @param {string} userId - The id of the author of the comment
   * @param {string} content - The content of the comment
   * @param {string} commentId - The comment the comment is a child to
   * @return {Promise<HydratedDocument<Comment>>} - The newly created freet
   */
  static async addOneToComment(commentId: Types.ObjectId | string, content: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Comment>> {
    const date = new Date();
    const comment = new CommentModel({
      userId,
      content,
      dateCreated: date,
      parent: commentId
    });
    await comment.save(); // Saves freet to MongoDB
    return comment.populate('userId');
  }

  /**
   * Get all the comments in by given freet
   *
   * @param {string} freetId - The freetId of the freet
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the comments
   */
  static async findAllByFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find({parent: freetId}).populate('parent');
  }

  /**
   * Get all the comments in by given freet
   *
   * @param {string} commentId - The id of the comment
   * @return {Promise<HydratedDocument<Comment>[]>} - An array of all of the comments
   */
  static async findAllByComment(commentId: Types.ObjectId | string) {
    return CommentModel.find({parent: commentId}).populate('parent');
  }

  /**
   * Delete a comment with given commentId.
   *
   * @param {string} commentID - The commentId of comment to delete
   * @return {Promise<Boolean>} - true if the comment has been deleted, false otherwise
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const comment = await CommentModel.deleteOne({_id: commentId});
    return comment !== null;
  }
}

export default CommentCollection;
