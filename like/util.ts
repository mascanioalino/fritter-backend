import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Like, PopulatedLike} from '../like/model';

// Update this if you add a property to the Freet type!
type LikeResponse = {
  _id: string;
  freet: string;
  user: string;
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - A freet
 * @returns {LikeResponse} - The freet object formatted for the frontend
 */
const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  const likeCopy: PopulatedLike = {
    ...like.toObject({
      versionKey: false
    })
  };
  const {username} = likeCopy.authorId;
  delete likeCopy.authorId;
  return {
    ...likeCopy,
    _id: likeCopy._id.toString(),
    user: username,
    freet: likeCopy.freetId._id.toString()
  };
};

export {
  constructLikeResponse
};
