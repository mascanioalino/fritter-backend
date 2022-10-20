import type {Request, Response, NextFunction} from 'express';
import GroupCollection from '../group/collection';

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

export {isGroupDoesntExist, isGroupExists};
