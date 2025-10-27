import mongoose, { Document, Schema } from "mongoose";

export interface IBlogModel extends Document {
  _id: string;
  lawyerId: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  likes: string[];
  comments: {
    userId: string;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlogModel>(
  {
    _id: { type: String },
    lawyerId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    isPublished: { type: Boolean, default: false },
    likes: [{ type: String }],
    comments: [
      {
        userId: { type: String },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const BlogModel = mongoose.model<IBlogModel>("blog", BlogSchema);
