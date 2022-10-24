import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import GroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groupValidator from '../group/middleware';
import * as util from './util';
const router = express.Router();

/**
 * Get groups for a user.
 *
 * @name GET /api/groups?username=username
 *
 * @return {GroupResponse[]} - An array of groups a user is a part of
 * @throws {400} - If the user with username does not exist
 *
 */
router.get(
  '/',
  [groupValidator.isUserExists],
  async (req: Request, res: Response) => {
    console.log('here00');
    const allGroups = await GroupCollection.findAllByUsername(req.query.username as string);
    const response = allGroups.map(util.constructGroupResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a group
 *
 * @name POST /api/groups
 *
 * @param {string} groupName - The name of the group
 * @return {GroupResponse} - The created group
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
 * @param {boolean} response - True if responding to request
 * @param {boolean} accept - True if accepting a user to a group
 * @return {GroupResponse} - The created group
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the group does not exist
 * @throws {405} - If the user is not an admin
 * @throws {406} - If the user is not in requests
 * @throws {407} - If the user cannot leave
 */
router.put(
  '/',
  [userValidator.isUserLoggedIn, groupValidator.isGroupExists, groupValidator.isAbleToLeave],
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
 * @throws {404} - If the group does not exist
 * @throws {405} - If the user is not an admin
 * @throws {406} - If the username is not in members
 */
router.put(
  '/admins',
  [groupValidator.isUserExists, userValidator.isUserLoggedIn, groupValidator.isGroupExists, groupValidator.isUserAdmin, groupValidator.isUserMember],
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
 * @throws {404} - If the group does not exist
 * @throws {405} - If the user does not have right permissions
 * @throws {406} - If the username is not in members
 */
router.put(
  '/owner',
  [groupValidator.isUserExists, userValidator.isUserLoggedIn, groupValidator.isGroupExists, groupValidator.isUserAdmin, groupValidator.isUserOwner, groupValidator.isUserMember],
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
 * @name DELETE /api/groups/:groupName?
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
