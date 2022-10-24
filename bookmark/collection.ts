import BookmarkModel from './model';
import type {Bookmark} from './model';
import type {HydratedDocument} from 'mongoose';
import type {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

class BookmarkCollection {
  /**
   * Add a bookmark to the collection
   *
   * @param {string} folder - The name of the folder
   * @param {string} userId - The id of the owner of the folder
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(folder: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const bookmark = new BookmarkModel({
      userId,
      folder,
      freets: []
    });
    await bookmark.save(); // Saves freet to MongoDB
    return bookmark.populate('folder userId');
  }

  /**
   * Get a bookmark with matching folder name in the user's account
   *
   * @param {string} folder - The name of the folder
   * @return {Promise<HydratedDocument<Bookmark>>} - A bookmark with the folder name folder
   */
  static async findOneByFolderAndUser(folder: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({folder, userId}).populate('folder userId');
  }

  /**
   * Get all the bookmarks by given user
   *
   * @param {string} userId - The id of the owner of bookmarks
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the Bookmarks
   */
  static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Bookmark>>> {
    return BookmarkModel.find({userId}).populate('userId');
  }

  /**
   * Update a bookmark by adding or removing a freet
   *
   * @param {string} folder - The name of the folder
   * @param {string} freetId - The freet to add or remove
   * @return {Promise<HydratedDocument<Bookmark>>} - A bookmark with the change in freets
   */
  static async updateOneByFolderAndFreet(folder: string, freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const bookmark = await BookmarkModel.findOne({folder, userId});
    console.log({folder, userId});
    const freet = await FreetCollection.findOne(freetId);
    if (bookmark.freets.includes(freet._id)) { // Already in folder -> remove
      bookmark.freets = bookmark.freets.filter((value, index, arr) => !value.equals(freet._id));
    } else { // Not in the folder -> add to folder
      bookmark.freets.push(freet._id);
    }

    await bookmark.save();
    return bookmark;
  }
}

export default BookmarkCollection;
