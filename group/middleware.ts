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
        freetNotFound: `Group with ${req.body.groupName} already exists.`
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
        freetNotFound: `Group with ${req.body.groupName} does not exist.`
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
        freetNotFound: `User ${req.session.userId} is not an admin`
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
        freetNotFound: `User ${requestingUser._id} is not in a request`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.body.groupName);
  if (!group.owner.equals(req.session.userId)) {
    res.status(405).json({
      error: {
        freetNotFound: `User ${req.session.userId} is not the owner`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId is owner
 */
const isUserOwner = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.session.userId);
  if (!user) {
    res.status(400).json({
      error: `A user with username ${req.session.userId as string} does not exist.`
    });
    return;
  }

  next();
};

export {isGroupDoesntExist, isGroupExists, isUserAdmin, isUserRequests, isUserExists, isUserOwner};
