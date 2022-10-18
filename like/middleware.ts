import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import LikeCollection from '../like/collection';

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
  const validFormat = Types.ObjectId.isValid(req.body.id);
  const freet = validFormat ? await FreetCollection.findOne(req.body.id) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.id} does not exist.`
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

export {
  isLikeExists,
  isFreetExists,
  isAuthorExists
};
