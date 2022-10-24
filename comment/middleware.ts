import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import {Types} from 'mongoose';
import CommentCollection from './collection';

/**
 * Checks if a comment with commentId is req.params exists
 */
const isCommentExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.commentId);
  const comment = validFormat ? await CommentCollection.findOne(req.params.commentId) : '';
  if (!comment) {
    res.status(404).json({
      error: {
        commentNotFound: `Comment with comment ID ${req.params.commentId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a group does not exist
 */
const isContentValid = async (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Comment content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Comment content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
const isIdValid = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.freetId) {
    const validFormat = Types.ObjectId.isValid(req.body.freetId);
    const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
    if (!freet) {
      res.status(404).json({
        error: {
          freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
        }
      });
      return;
    }
  } else if (req.body.commentId) {
    const validFormat = Types.ObjectId.isValid(req.body.commentId);
    const comment = validFormat ? await CommentCollection.findOne(req.body.commentId) : '';
    if (!comment) {
      res.status(404).json({
        error: {
          commentNotFound: `Comment with freet ID ${req.body.commentId} does not exist.`
        }
      });
      return;
    }
  } else {
    res.status(404).json({
      error: {
        parentNotFound: 'No comment or freet ID input'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the comment whose commentId is in req.params
 */
const isValidCommentModifier = async (req: Request, res: Response, next: NextFunction) => {
  const comment = await CommentCollection.findOne(req.params.commentId);
  const userId = comment.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' comments.'
    });
    return;
  }

  next();
};

export {
  isContentValid,
  isIdValid,
  isValidCommentModifier,
  isCommentExists
};

