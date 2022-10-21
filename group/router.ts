import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import GroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groupValidator from '../group/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
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
 * @param {string} groupName - The name of the group
 * @param {string} userName - The user to accept
 * @return {GroupResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the name already exists
 * @throws {405} - If the user is not an admin
 */
router.put(
  '/',
  [userValidator.isUserLoggedIn, groupValidator.isGroupExists],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    if (req.body.response) { // Need to be admin
      next();
      return;
    }

    const group = await GroupCollection.updateOneByJoinLeave(req.body.groupName, userId);

    res.status(201).json({
      message: 'Your group was editted successfully.',
      group: util.constructGroupResponse(group)
    });
  },
  [groupValidator.isUserAdmin, groupValidator.isUserRequests],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.updateOneByResponse(req.body.groupName, req.body.username, req.body.accept);
    res.status(201).json({
      message: 'Your group was editted successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Add a group admin
 *
 * @name PUT /api/groups/admins
 *
 * @param {string} groupName - The name of the group
 * @param {string} userName - The user to add as admin
 * @return {GroupResponse} - The created like
 * @throws {400} - If the new admin user does not exist
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the name already exists
 * @throws {405} - If the user is not an admin
 */
router.put(
  '/admins',
  [groupValidator.isUserExists, userValidator.isUserLoggedIn, groupValidator.isGroupExists, groupValidator.isUserAdmin],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.updateOneByAdmin(req.body.groupName, req.body.username);

    res.status(201).json({
      message: 'You added a new admin successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Change the group owner
 *
 * @name PUT /api/groups/owner
 *
 * @param {string} groupName - The name of the group
 * @param {string} userName - The user to add as admin
 * @return {GroupResponse} - The created like
 * @throws {400} - If the new admin user does not exist
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the name already exists
 * @throws {405} - If the user does not have right permissions
 */
router.put(
  '/owner',
  [groupValidator.isUserExists, userValidator.isUserLoggedIn, groupValidator.isGroupExists, groupValidator.isUserAdmin, groupValidator.isUserOwner],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.updateOneByOwner(req.body.groupName, req.body.username);

    res.status(201).json({
      message: 'Changed owner successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Delete a group.
 *
 * @name DELETE /api/groups
 * @param {strin} groupName - The name of the group to delete
 *
 * @return {string} - A success message
 * @throws {405} - If the user is not an owner
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn, groupValidator.isUserOwner
  ],
  async (req: Request, res: Response) => {
    await GroupCollection.deleteOne(req.body.groupName);
    res.status(200).json({
      message: 'The group has been deleted successfully.'
    });
  }
);

export {router as groupRouter};
