import mongoose, { Document, Schema } from "mongoose";

// ✅ TypeScript Interface
export interface IUser extends Document {
  srNo: string;

  name: string;
  address?: string;
  city?: string;

  mobile: string;
  whatsapp?: string;

  keva: string;
  gotra: string;
  mataji?: string;

  profession?: string;
  index?: string;

  createdAt: Date;
  updatedAt: Date;
}

// ✅ Schema
const userSchema = new Schema<IUser>(
  {
    srNo: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    keva: {
      type: String,
      required: true,
    },

    gotra: {
      type: String,
      required: true,
    },

    mataji: {
      type: String,
      trim: true,
    },

    profession: {
      type: String,
      trim: true,
    },

    index: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // ✅ auto adds createdAt, updatedAt
  }
);

// ✅ Export Model
const User = mongoose.model<IUser>("User", userSchema);

export default User;