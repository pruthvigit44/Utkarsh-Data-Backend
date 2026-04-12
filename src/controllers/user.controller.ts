import { Request, Response } from "express";
import User from "../models/user.model";
import { appendToSheet } from "../utils/sheetService";

// 🔥 Generate SR No
const generateSrNo = async () => {
  const count = await User.countDocuments();
  return `U${String(count + 1).padStart(3, "0")}`;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      address,
      city,
      mobile,
      whatsapp,
      keva,
      gotra,
      mataji,
      profession,
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

    // 🔥 Validate family members
    if (!familyMembers || familyMembers.length === 0) {
      return res.status(400).json({
        message: "At least one family member required",
      });
    }

    for (const m of familyMembers) {
      if (
        !m.name ||
        !m.age ||
        !m.relation ||
        !m.dob ||
        !m.education ||
        !m.phone
      ) {
        return res.status(400).json({
          message: "Invalid family member data",
        });
      }
    }

    const srNo = await generateSrNo();

    const newUser = new User({
      srNo,
      name,
      address,
      city,
      mobile,
      whatsapp,
      keva,
      gotra,
      mataji,
      profession,
      dob,
      education,
      familyMembers,
    });

    await newUser.save();

    // 🔥 DEBUG
    console.log("Saving to sheet:", newUser.srNo);

    // 🔥 GOOGLE SHEETS INTEGRATION
    try {
      await appendToSheet(newUser);
      console.log("Sheet updated successfully");
    } catch (err) {
      console.error("Sheet error:", err);
    }

    return res.status(201).json({
      message: "User created successfully",
      srNo,
      data: newUser,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};