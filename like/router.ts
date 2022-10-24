import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from '../like/middleware';
import * as util from './util';
const router = express.Router();

/**
 * Get likes by user.
 *
 * @name GET /api/likes?userId=userId
 *
 * @return {LikeResponse[]} - An array of likes given by user with id, authorId
 * @throws {403} - If user is not logged in
 *
 */
/**
 * Get likes by freet.
 *
 * @name GET /api/likes?freetId=freetId
 *
 * @return {LikeResponse[]} - An array of likes in freet with id, freetId
 * @throws {403} - If user is not logged in
 * @throws {404} - If no freet has given freetId
 *
 */
router.get(
  '/',
  [userValidator.isUserLoggedIn, likeValidator.isUserExists],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.username === undefined) {
      next();
      return;
    }

    const user = await UserCollection.findOneByUsername(req.query.username as string);
    const hiddenUserLikes = (user._id.toString() === req.session.userId) ? await LikeCollection.findAllHiddenLikesByUser(user._id.toString()) : null;
    const publicUserLikes = await LikeCollection.findAllPublicLikesByUser(user._id.toString());
    const response = {hidden: hiddenUserLikes ? hiddenUserLikes.map(util.constructLikeResponse) : null, public: publicUserLikes.map(util.constructLikeResponse)};
    res.status(200).json(response);
  },
  [likeValidator.isFreetExists],
  async (req: Request, res: Response) => {
    const hiddenFreetLikes = await LikeCollection.findAllHiddenLikesByFreet(req.query.freetId as string);
    const publicFreetLikes = await LikeCollection.findAllPublicLikesByFreet(req.query.freetId as string);
    const response = {hidden: hiddenFreetLikes.map(util.constructLikeResponse), public: publicFreetLikes.map(util.constructLikeResponse)};
    res.status(200).json(response);
  }

);

/**
 * Like a freet.
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The id of the freet
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freet does not exist
 */
router.post(
  '/',
  [userValidator.isUserLoggedIn, likeValidator.isFreetExists],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addOne(userId, req.body.freetId, req.body.hidden);

    res.status(201).json({
      message: 'Your like was created successfully.',
      like: util.constructLikeResponse(like)
    });
  }
);

export {router as likeRouter};
