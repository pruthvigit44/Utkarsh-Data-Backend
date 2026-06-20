import mongoose, { Schema, Document } from "mongoose";

interface DikiriMember {
  name: string;
  relation: string;
  age: string;
  dob: string;
  education: string;
  phone: string;
  profession: string;
  maritalStatus: string;
  bloodGroup: string;
  email: string;
}

export interface IDikiriUser extends Document {
  srNo: string;
  language: string;
  name: string;
  husbandName: string;
  fatherNameAndVillage: string;
  gnati: string;
  gotra: string;
  kuldevi: string;
  address: string;
  mobile: string;
  whatsapp: string;
  email: string;
  bloodGroup: string;
  education: string;
  profession: string;
  maritalStatus: string;
  dob: string;
  remarks: string;
  backgroundColor: string;
  familyMembers: DikiriMember[];
}

const DikiriMemberSchema = new Schema<DikiriMember>({
  name:          { type: String, required: true },
  relation:      { type: String, required: true },
  age:           { type: String, default: "" },
  dob:           { type: String, default: "" },
  education:     { type: String, default: "" },
  phone:         { type: String, default: "" },
  profession:    { type: String, default: "" },
  maritalStatus: { type: String, default: "" },
  bloodGroup:    { type: String, default: "" },
  email:         { type: String, default: "" },
});

const DikiriUserSchema = new Schema<IDikiriUser>(
  {
    srNo:                 { type: String, unique: true },
    language:             { type: String, enum: ["EN", "GU"], default: "EN" },
    name:                 { type: String, required: true },
    husbandName:          { type: String, required: true },
    fatherNameAndVillage: { type: String, required: true },
    gnati:                { type: String, default: "" },
    gotra:                { type: String, default: "" },
    kuldevi:              { type: String, default: "" },
    address:              { type: String, required: true },
    mobile:               { type: String, required: true },
    whatsapp:             { type: String, default: "" },
    email:                { type: String, default: "" },
    bloodGroup:           { type: String, default: "" },
    education:            { type: String, default: "" },
    profession:           { type: String, default: "" },
    maritalStatus:        { type: String, default: "" },
    dob:                  { type: String, default: "" },
    remarks:              { type: String, default: "" },
    backgroundColor:      { type: String, default: "" },
    familyMembers:        { type: [DikiriMemberSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IDikiriUser>("DikiriUser", DikiriUserSchema);
