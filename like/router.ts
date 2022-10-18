import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';
const router = express.Router();

/**
 * Get likes by user.
 *
 * @name GET /api/likes?user=id
 *
 * @return {LikeResponse[]} - An array of likes given by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
/**
 * Get likes by freet.
 *
 * @name GET /api/likes?freetId=id
 *
 * @return {LikeResponse[]} - An array of likes in freet with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.user !== undefined) {
      next();
      return;
    }

    const freetLikes = await LikeCollection.findAllByFreet(req.query.freet as string);
    const response = freetLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const authorLikes = await LikeCollection.findAllByUser(req.query.user as string);
    const response = authorLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Like a freet.
 *
 * @name POST /api/likes
 *
 * @param {string} freet - The content of the freet
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [userValidator.isUserLoggedIn, likeValidator.isFreetExists],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addOne(userId, req.body.id);

    res.status(201).json({
      message: 'Your like was created successfully.',
      like: util.constructLikeResponse(like)
    });
  }
);

export {router as likeRouter};
