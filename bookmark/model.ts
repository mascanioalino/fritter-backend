import type {Freet} from '../freet/model';
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

export type Bookmark = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  folder: string;
  freets: Types.ObjectId[];
};

export type PopulatedBookmark = {
  _id: Types.ObjectId;
  userId: User; // Must be unique
  folder: string;
  freets: Freet[];
};

const BookmarkSchema = new Schema<Bookmark>({
  // The author userId
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freets: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Freet'
  },
  folder: {
    type: String,
    required: true
  }
});

const BookmarkModel = model<Bookmark>('Bookmark', BookmarkSchema);
export default BookmarkModel;
