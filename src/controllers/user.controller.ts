import { Request, Response } from "express";
import User from "../models/user.model";
import { appendToSheet, updateSheetRecord } from "../utils/sheetService";

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
          message: "Invalid family member data",
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
      profession,
      businessAddress,
      maritalStatus,
      remarks,
      dob,
      education,
      familyMembers,
    });

    await newUser.save();

    try {
      await appendToSheet(newUser);
    } catch (err) {
      console.error("Sheet sync failed:", err);
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

export const getUser = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.params;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      data: user,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.params;
    const updateData = req.body;

    const user = await User.findOneAndUpdate(
      { mobile },
      updateData,
      { returnDocument: "after", runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    try {
      await updateSheetRecord(user);
    } catch (err) {
      console.error("Sheet sync failed:", err);
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: user,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
}