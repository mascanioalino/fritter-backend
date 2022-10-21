import GroupModel from './model';
import type {Group} from './model';
import type {HydratedDocument} from 'mongoose';
import type {Types} from 'mongoose';
import UserCollection from '../user/collection';

class GroupCollection {
  /**
   * Add a group to the collection
   *
   * @param {string} groupName - The name of the grop
   * @param {string} userId - The id of the owner of the group
   * @return {Promise<HydratedDocument<Group>>} - The newly created group
   */
  static async addOne(groupName: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    const group = new GroupModel({
      groupName, // Must be unique
      members: [userId],
      followers: [userId],
      admins: [userId],
      requests: [],
      owner: userId
    });
    await group.save(); // Saves freet to MongoDB
    return group.populate('groupName owner');
  }

  /**
   * Get a group with matching name
   *
   * @param {string} groupName - The name of the group
   * @return {Promise<HydratedDocument<Group>>} - A group with the groupName
   */
  static async findOne(groupName: string): Promise<HydratedDocument<Group>> {
    return GroupModel.findOne({groupName}).populate('groupName');
  }

  /**
   * Update a group by adding or removing a member
   *
   * @param {string} groupName - The name of the group
   * @return {Promise<HydratedDocument<Group>>} - A group with the groupName
   */
  static async updateOneByJoinLeave(groupName: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({groupName});
    const user = await UserCollection.findOneByUserId(userId);
    if (group.members.includes(user._id)) { // Already in group -> leave
      group.members = group.members.filter((value, index, arr) => !value.equals(user._id));
    } else if (group.requests.includes(user._id)) { // Already requested -> remove request
      group.requests = group.requests.filter((value, index, arr) => !value.equals(user._id));
    } else { // Not in the group or requested -> add to requests
      group.requests.push(user._id);
    }

    await group.save();
    return group;
  }

  /**
   * Update a group by adding or removing a member
   *
   * @param {string} groupName - The name of the group
   * @return {Promise<HydratedDocument<Group>>} - A group with the groupName
   */
  static async updateOneByResponse(groupName: string, username: string, accept: boolean): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({groupName});
    const requestingUser = await UserCollection.findOneByUsername(username);

    if (group.requests.includes(requestingUser._id)) {
      if (accept) {
        group.members.push(requestingUser._id);
        group.followers.push(requestingUser._id);
      }

      group.requests = group.requests.filter((value, index, arr) => !value.equals(requestingUser._id));
    }

    await group.save();
    return group;
  }
}

export default GroupCollection;
