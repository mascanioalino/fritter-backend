import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from './middleware';
import * as util from './util';
import BookmarkCollection from './collection';
const router = express.Router();
/**
 * Create a folder
 *
 * @name POST /api/bookmarks
 *
 * @param {string} folder - The name of the folder
 * @return {GroupResponse} - The created like
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
 * @return {GroupResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the name already exists
 * @throws {405} - If the user is not an admin
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
