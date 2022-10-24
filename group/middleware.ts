import type {Request, Response, NextFunction} from 'express';
import GroupCollection from '../group/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a group does not exist
 */
const isGroupDoesntExist = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  if (group) {
    res.status(404).json({
      error: {
        groupNotFound: `Group with ${req.body.groupName} already exists.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a group exists
 */
const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  if (!group) {
    res.status(404).json({
      error: {
        groupNotFound: `Group with ${req.body.groupName} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user is admin
 */
const isUserAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  if (!group.admins.includes(req.session.userId)) {
    res.status(405).json({
      error: {
        userNotFound: `User ${req.session.userId} is not an admin`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user is in requests
 */
const isUserRequests = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  const requestingUser = await UserCollection.findOneByUsername(req.body.username);
  if (!group.requests.includes(requestingUser._id)) {
    res.status(406).json({
      error: {
        userNotFound: `User ${requestingUser._id} is not in a request`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId exists
 */
const isUserOwner = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  if (!group.owner.equals(req.session.userId)) {
    res.status(405).json({
      error: {
        userNotFound: `User ${req.session.userId as string} is not the owner`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId is owner
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username as string || req.query.username as string;
  const user = await UserCollection.findOneByUsername(username);
  if (!user) {
    res.status(400).json({
      error: `A user with username ${username} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a user can leave the group
 */
const isAbleToLeave = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  if (!req.body.response && group.admins.length === 1 && group.admins.includes(req.session.userId)) {
    res.status(407).json({
      error: `The user ${req.session.userId as string} cannot not leave.`
    });
    return;
  }

  next();
};

/**
 * Checks if a user is a member of group
 */
const isUserMember = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  const user = await UserCollection.findOneByUsername(req.body.username);
  if (!group.members.includes(user._id)) {
    res.status(406).json({
      error: `The user ${req.body.username as string} is not in the group.`
    });
    return;
  }

  next();
};

export {isUserMember, isAbleToLeave, isGroupDoesntExist, isGroupExists, isUserAdmin, isUserRequests, isUserExists, isUserOwner};
