import GroupModel from './model';
import type {Group} from './model';
import type {HydratedDocument} from 'mongoose';
import {Types} from 'mongoose';
import UserModel from '../user/model';

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
   * Get a group with matching name
   *
   * @param {string} groupName - The name of the group
   * @return {Promise<HydratedDocument<Group>>} - A group with the groupName
   */
  static async updateOne(groupName: string, userId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({groupName});
    const user = await UserModel.findOne({_id: userId});
    // Const finalGroup ;
    if (group.members.includes(new Types.ObjectId(userId))) {
      console.log(group.members);
      group.members = group.members.filter((value, index, arr) => !value.equals(new Types.ObjectId(userId)));
      console.log(group.members);
    } else {
      group.members.push(new Types.ObjectId(userId));
    }

    await group.save();
    return group;
  }
}

export default GroupCollection;
