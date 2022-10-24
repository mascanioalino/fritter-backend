import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from './middleware';
import * as util from './util';
import BookmarkCollection from './collection';
const router = express.Router();

/**
 * Get all the bookmarks by user
 *
 * @name GET /api/bookmarks
 *
 * @return {BookmarkResponse[]} - A list of all the bookmarks sorted in descending
 *                      order by date modified
 */
/**
 * Get all the freets by bookmark.
 *
 * @name GET /api/bookmarks?folder=folder
 *
 * @return {BookmarkResponse} - An array of freets in the folder
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the folder does not exist
 *
 */
router.get(
  '/',
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.folder !== undefined) {
      next();
      return;
    }

    const allBookmarks = await BookmarkCollection.findAllByUserId(req.session.userId);
    const response = allBookmarks.map(util.constructBookmarkResponse);
    res.status(200).json(response);
  },
  [bookmarkValidator.isFolderExists],
  async (req: Request, res: Response) => {
    const bookmark = await BookmarkCollection.findOneByFolderAndUser(req.query.folder as string, req.session.userId);
    const response = util.constructBookmarkResponse(bookmark);
    res.status(200).json(response);
  }
);

/**
 * Create a folder
 *
 * @name POST /api/bookmarks
 *
 * @param {string} folder - The name of the folder
 * @return {BookmarkResponse} - The created bookmark
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the name already exists
 */
router.post(
  '/',
  [userValidator.isUserLoggedIn, bookmarkValidator.isFolderDoesntExist],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bookmark = await BookmarkCollection.addOne(req.body.folder, userId);

    res.status(201).json({
      message: 'Your bookmark was created successfully.',
      bookmark: util.constructBookmarkResponse(bookmark)
    });
  }
);

/**
 * Bookmark a freet
 *
 * @name PUT /api/bookmarks
 *
 * @param {string} folder - The folder to add or remove from
 * @param {string} freetId - The freet to add or remove
 * @return {BookmarkResponse} - The created bookmark
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the folder does not exist
 */
router.put(
  '/',
  [userValidator.isUserLoggedIn, bookmarkValidator.isFolderExists],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const bookmark = await BookmarkCollection.updateOneByFolderAndFreet(req.body.folder, req.body.freetId, userId);
    res.status(201).json({
      message: 'Your bookmark was editted successfully.',
      bookmark: util.constructBookmarkResponse(bookmark)
    });
  }
);

export {router as bookmarkRouter};
