import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import {User} from 'user/model';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

export type Group = {
  _id: Types.ObjectId;
  name: string; // Must be unique
  members: Types.ObjectId[];
  followers: Types.ObjectId[];
  admins: Types.ObjectId[];
  requests: Types.ObjectId[];
  owner: Types.ObjectId;
};

const GroupSchema = new Schema<Group>({
  name: {
    type: String,
    required: true
  },
  members: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  followers: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  admins: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  requests: {
    type: [Schema.Types.ObjectId],
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const GroupModel = model<Group>('Group', GroupSchema);
export default GroupModel;
