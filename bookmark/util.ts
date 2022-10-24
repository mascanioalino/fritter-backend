import type {PopulatedBookmark} from './model';
import type {HydratedDocument} from 'mongoose';
import type {Bookmark} from './model';

type BookmarkResponse = {
  _id: string;
  folder: string;
  freets: string[];
};

/**
   * Transform a raw Bookmark object from the database into an object
   * with all the information needed by the frontend
   *
   * @param {HydratedDocument<Bookmark>} bookmark - A bookmark
   * @returns {BookmarkResponse} - The bookmark object formatted for the frontend
   */
const constructBookmarkResponse = (bookmark: HydratedDocument<Bookmark>): BookmarkResponse => {
  const bookmarkCopy: PopulatedBookmark = {
    ...bookmark.toObject({
      versionKey: false
    })
  };
  return {
    _id: bookmarkCopy._id.toString(),
    folder: bookmarkCopy.folder,
    freets: bookmarkCopy.freets.map(f => f._id.toString())
  };
};

export {
  constructBookmarkResponse
};
