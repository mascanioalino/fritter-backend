import type {Request, Response, NextFunction} from 'express';
import BookmarkCollection from './collection';

/**
 * Checks if a folder does not exist
 */
const isFolderDoesntExist = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookmarkCollection.findOneByFolderAndUser(req.body.folder, req.session.userId);
  if (bookmark) {
    res.status(403).json({
      error: {
        freetNotFound: `Bookmark with folder name ${req.body.folder} already exists.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a folder exists
 */
const isFolderExists = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookmarkCollection.findOneByFolderAndUser(req.body.folder, req.session.userId);
  if (!bookmark) {
    res.status(403).json({
      error: {
        freetNotFound: `Bookmark with folder name ${req.body.folder} does not exist.`
      }
    });
    return;
  }

  next();
};

export {isFolderDoesntExist, isFolderExists};
