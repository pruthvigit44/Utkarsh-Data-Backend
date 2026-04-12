import mongoose, { Schema, Document } from "mongoose";

interface FamilyMember {
  name: string;
  age: string;
  relation: string;
  dob: string;
  education: string;
  phone: string;
}

export interface IUser extends Document {
  srNo: string;
  name: string;
  address: string;
  city: string;
  mobile: string;
  whatsapp: string;
  keva: string;
  gotra: string;
  mataji: string;
  profession: string;

  dob: string;
  education: string;

  familyMembers: FamilyMember[];
}

const FamilySchema = new Schema<FamilyMember>({
  name: { type: String, required: true },
  age: { type: String, required: true },
  relation: { type: String, required: true },
  dob: { type: String, required: true },
  education: { type: String, required: true },
  phone: { type: String, required: true },
});

const UserSchema = new Schema<IUser>(
  {
    srNo: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    whatsapp: { type: String, required: true },

    keva: { type: String, required: true },
    gotra: { type: String, required: true },
    mataji: { type: String, required: true },
    profession: { type: String, required: true },

    dob: { type: String, required: true },
    education: { type: String, required: true },

    familyMembers: {
      type: [FamilySchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);