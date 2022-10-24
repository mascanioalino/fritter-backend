import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a like with likeId is req.params exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.likeId);
  const like = validFormat ? await LikeCollection.findOne(req.params.likeId) : '';
  if (!like) {
    res.status(404).json({
      error: {
        freetNotFound: `Like with like ID ${req.params.likeId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.body.freetId as string || req.query.freetId as string;
  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOne(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.user) {
    res.status(400).json({
      error: 'Provided author username must be nonempty.'
    });
  }
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.username) {
    const user = await UserCollection.findOneByUsername(req.query.username as string);
    if (!user) {
      res.status(404).json({
        error: `A user with username ${req.query.username as string} does not exist.`
      });
      return;
    }
  }

  next();
};

export {
  isLikeExists,
  isFreetExists,
  isAuthorExists,
  isUserExists
};
