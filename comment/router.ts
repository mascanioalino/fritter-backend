import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as commentValidator from './middleware';
import * as util from './util';
import CommentCollection from './collection';
const router = express.Router();

/**
 * Get comments by freet
 *
 * @name GET /api/comments?freetId=id
 *
 * @return {CommentResponse[]} - A list of all the comments for freet with ID commentId
 */
/**
 * Get comments by comment.
 *
 * @name GET /api/comments?commentId=id
 *
 * @return {CommentResponse[]} - An array of comments for comment with ID commentId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    const commentComments = await CommentCollection.findAllByComment(req.query.commentId as string);
    const response = commentComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const freetComments = await CommentCollection.findAllByFreet(
      req.query.freetId as string
    );
    const response = freetComments.map(util.constructCommentResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a folder
 *
 * @name POST /api/comments
 *
 * @param {string} freetId - The freetId
 * @param {string} commentId - The commentId
 * @param {string} content - The content of the comment
 * @return {CommentResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the content is empty
 * @throws {413} - If the content > 140 characters
 * @throws {405} - If the freet or comment does not exist
 */
router.post(
  '/',
  [userValidator.isUserLoggedIn, commentValidator.isContentValid, commentValidator.isIdValid],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    if (!req.body.freetId) {
      next();
      return;
    }

    console.log('here');
    const comment = await CommentCollection.addOneToFreet(req.body.freetId, req.body.content, userId);

    res.status(201).json({
      message: 'Your comment was created successfully.',
      comment: util.constructCommentResponse(comment)
    });
  },
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const comment = await CommentCollection.addOneToComment(req.body.commentId, req.body.content, userId);

    res.status(201).json({
      message: 'Your comment was created successfully.',
      comment: util.constructCommentResponse(comment)
    });
  }
);

export {router as commentRouter};
