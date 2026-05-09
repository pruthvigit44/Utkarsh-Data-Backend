import { Request, Response } from "express";
import User from "../models/user.model";
import { appendToSheet } from "../utils/sheetService";

// 🔥 Generate SR No
const generateSrNo = async () => {
  const count = await User.countDocuments();
  return `U${String(count + 1).padStart(4, "0")}`;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      age,
      address,
      country,
      isOutOfCountry,
      mobile,
      whatsapp,
      email,
      bloodGroup,
      language = "EN",
      gotra,
      mataji,
      mosala,
      profession,
      businessAddress,
      maritalStatus,
      remarks,
      dob,
      education,
      familyMembers,
    } = req.body;

    // 🔥 Duplicate check
    const existing = await User.findOne({ mobile });
    if (existing) {
      return res.status(400).json({
        message: "User already exists with this mobile number",
      });
    }

    for (const m of familyMembers) {
      if (
        !m.name ||
        !m.age ||
        !m.relation 
        
      ) {
        return res.status(400).json({
          message: "Invalid family member data/Add family member details",
        });
      }
    }

    const srNo = await generateSrNo();

    const newUser = new User({
      srNo,
      name,
      age,
      address,
      country,
      isOutOfCountry,
      mobile,
      whatsapp,
      email,
      bloodGroup,
      language,
      gotra,
      mataji,
      mosala,
      profession,
      businessAddress,
      maritalStatus,
      remarks,
      dob,
      education,
      familyMembers,
    });

    await newUser.save();

    let sheetSynced = true;
    try {
      await appendToSheet(newUser);
    } catch (err) {
      console.error("Sheet sync failed:", err);
      sheetSynced = false;
    }

    return res.status(201).json({
      message: "User created successfully",
      srNo,
      data: newUser,
      sheetSynced,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

