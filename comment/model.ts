import type {Freet} from '../freet/model';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Comment
 */

export type Comment = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  parent: Types.ObjectId;
  dateCreated: Date;
  content: string;
};

export type PopulatedComment = {
  _id: Types.ObjectId;
  userId: User; // Must be unique
  parent: Freet;
  dateCreated: Date;
  content: string;
};

const CommentSchema = new Schema<Comment>({
  // The author userId
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  parent: {
    type: Schema.Types.ObjectId,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true,
    ref: 'Date'
  },
  content: {
    type: String,
    required: true
  }
});

const CommentModel = model<Comment>('Comment', CommentSchema);
export default CommentModel;
