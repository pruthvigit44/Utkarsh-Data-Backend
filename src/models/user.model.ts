import mongoose, { Schema, Document } from "mongoose";

interface FamilyMember {
  name: string;
  age: string;
  relation: string;
  dob: string;
  education: string;
  phone: string;
  profession: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isOutOfCountry: boolean;
  email: string;
  bloodGroup: string;
}

export interface IUser extends Document {
  srNo: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isOutOfCountry: boolean;
  mobile: string;
  whatsapp: string;
  email: string;
  bloodGroup: string;
  language: string;
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
  education: { type: String, },
  phone: { type: String, required: true },
  profession: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  pincode: { type: String, default: "" },
  country: { type: String, default: "" },
  isOutOfCountry: { type: Boolean, default: false },
  email: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
});

const UserSchema = new Schema<IUser>(
  {
    srNo: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "" },
    isOutOfCountry: { type: Boolean, default: false },
    mobile: { type: String, required: true, unique: true },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },

    language: { type: String, default: "EN" },
    // keva: { type: String, default: "" },
    gotra: { type: String, required: true },
    mataji: { type: String, default: "" },
    profession: { type: String, default: "" },

    dob: { type: String, required: true },
    education: { type: String, default: "" },

    familyMembers: {
      type: [FamilySchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);