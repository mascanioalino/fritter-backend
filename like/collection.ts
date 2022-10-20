import LikeModel from './model';
import type {Like} from './model';
import type {HydratedDocument, Types} from 'mongoose';
import UserCollection from '../user/collection';

class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created freet
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    hidden: boolean
  ): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      authorId,
      freetId,
      hidden
    });
    await like.save(); // Saves freet to MongoDB
    return like.populate('authorId freetId');
  }

  /**
   * Get all likes given by freet
   *
   * @param {string} likeId - The id of the freet
   * @return {Promise<HydratedDocument<Like>>} - All likes for a particular freet
   */
  static async findOne(
    likeId: Types.ObjectId | string
  ): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({_id: likeId}).populate('authorId freetId');
  }

  /**
   * Get all likes given by freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All likes for a particular freet
   */
  static async findAllPublicLikesByFreet(
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({freetId, hidden: false}).populate('authorId freetId');
  }

  /**
   * Get all likes given by freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All likes for a particular freet
   */
  static async findAllHiddenLikesByFreet(
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({freetId, hidden: true}).populate('authorId freetId');
  }

  /**
   * Get all public likes given by username
   *
   * @param {string} userId - The username of person who liked freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All public likes
   */
  static async findAllPublicLikesByUser(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({authorId: userId, hidden: false}).populate('authorId freetId');
  }

  /**
   * Get all hidden likes given by username
   *
   * @param {string} userId - The username of person who liked freet
   * @return {Promise<Array<HydratedDocument<Like>>>} - All hidden likes
   */
  static async findAllHiddenLikesByUser(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({authorId: userId, hidden: true}).populate('authorId freetId');
  }
}
export default LikeCollection;
