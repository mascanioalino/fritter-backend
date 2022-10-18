import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from 'user/model';
import type {Freet} from 'freet/model';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

export type Like = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  authorId: User;
  freetId: Freet;
};

const LikeSchema = new Schema<Like>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
