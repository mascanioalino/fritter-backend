import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import GroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groupValidator from '../group/middleware';
import * as util from './util';
const router = express.Router();
/**
 * Create a group
 *
 * @name POST /api/groups
 *
 * @param {string} groupName - The content of the freet
 * @return {GroupResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the name already exists
 */
router.post(
  '/',
  [userValidator.isUserLoggedIn, groupValidator.isGroupDoesntExist],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const group = await GroupCollection.addOne(req.body.groupName, userId);

    res.status(201).json({
      message: 'Your group was created successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Join a group
 *
 * @name PUT /api/groups
 *
 * @param {string} groupName - The content of the freet
 * @return {GroupResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the name already exists
 */
router.put(
  '/',
  [userValidator.isUserLoggedIn, groupValidator.isGroupExists],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const group = await GroupCollection.updateOne(req.body.groupName, userId);

    res.status(201).json({
      message: 'Your group was editted successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

export {router as groupRouter};
