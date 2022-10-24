import type {Request, Response, NextFunction} from 'express';
import BookmarkCollection from './collection';

/**
 * Checks if a folder does not exist
 */
const isFolderDoesntExist = async (req: Request, res: Response, next: NextFunction) => {
  const folder = req.body.folder as string || req.query.folder as string;
  const bookmark = await BookmarkCollection.findOneByFolderAndUser(folder, req.session.userId);
  if (bookmark) {
    res.status(404).json({
      error: {
        folderFound: `Bookmark with folder name ${folder} already exists.`
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
  const folder = req.body.folder as string || req.query.folder as string;
  const bookmark = await BookmarkCollection.findOneByFolderAndUser(folder, req.session.userId);
  if (!bookmark) {
    res.status(404).json({
      error: {
        folderNotFound: `Bookmark with folder name ${folder} does not exist.`
      }
    });
    return;
  }

  next();
};

export {isFolderDoesntExist, isFolderExists};
