import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from 'user/model';

/**
 * This file defines the properties stored in a Like
 * DO NOT implement operations here ---> use collection file
 */

export type Bookmark = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  folder: string;
  freetId: Types.ObjectId;
};

const BookmarkSchema = new Schema<Bookmark>({
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
  },
  folder: {
    type: String,
    required: true,
    ref: 'Folder'
  }
});

const BookmarkModel = model<Bookmark>('Bookmark', BookmarkSchema);
export default BookmarkModel;
