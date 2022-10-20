import type {PopulatedGroup} from './model';
import type {HydratedDocument} from 'mongoose';
import type {Group} from './model';

type GroupResponse = {
  _id: string;
  groupName: string;
};

/**
   * Transform a raw Group object from the database into an object
   * with all the information needed by the frontend
   *
   * @param {HydratedDocument<Group>} group - A group
   * @returns {LikeResponse} - The group object formatted for the frontend
   */
const constructGroupResponse = (group: HydratedDocument<Group>): GroupResponse => {
  const groupCopy: PopulatedGroup = {
    ...group.toObject({
      versionKey: false
    })
  };
  return {
    _id: groupCopy._id.toString(),
    groupName: groupCopy.groupName
  };
};

export {
  constructGroupResponse
};
