import mongoose, { Schema, Document } from "mongoose";

interface FamilyMember {
  name: string;
  age: string;
  relation: string;
  dob: string;
  education: string;
  phone: string;
  profession: string;
  businessAddress: string;
  maritalStatus: string;
  remarks: string;
  country: string;
  isOutOfCountry: boolean;
  email: string;
  bloodGroup: string;
}

export interface IUser extends Document {
  srNo: string;
  name: string;
  age: string;
  address: string;
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
  businessAddress: string;
  maritalStatus: string;
  remarks: string;
  dob: string;
  education: string;
  familyMembers: FamilyMember[];
}

const FamilySchema = new Schema<FamilyMember>({
  name: { type: String, required: true },
  age: { type: String, default: "" },
  relation: { type: String, required: true },
  dob: { type: String, default: "" },
  education: { type: String, default: "" },
  phone: { type: String, default: "" },
  profession: { type: String, default: "" },
  businessAddress: { type: String, default: "" },
  maritalStatus: { type: String, default: "" },
  remarks: { type: String, default: "" },
  country: { type: String, default: "" },
  isOutOfCountry: { type: Boolean, default: false },
  email: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
});

const UserSchema = new Schema<IUser>(
  {
    srNo: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    age: { type: String, default: "" },
    address: { type: String, required: true },
    country: { type: String, default: "" },
    isOutOfCountry: { type: Boolean, default: false },
    mobile: { type: String, required: true, unique: true },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    bloodGroup: { type: String, default: "" },

    language: { type: String, default: "EN" },
    gotra: { type: String },
    mataji: { type: String, default: "" },
    profession: { type: String, default: "" },
    businessAddress: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    remarks: { type: String, default: "" },

    dob: { type: String, default: "" },
    education: { type: String, default: "" },

    familyMembers: {
      type: [FamilySchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
