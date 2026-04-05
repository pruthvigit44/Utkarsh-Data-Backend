import { Request, Response } from "express";
import User from "../models/user.model";

// 🔢 Generate SR Number
const generateSR = async (): Promise<string> => {
  const count = await User.countDocuments();
  const next = count + 1;

  return "U" + String(next).padStart(3, "0");
};

// ✅ Create User Controller
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      mobile,
      keva,
      gotra,
      address,
      city,
      whatsapp,
      mataji,
      profession,
      index,
    } = req.body;

    // 🔥 1. Basic Validation
    if (!name || !mobile || !keva || !gotra) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // 🔥 2. Duplicate Check (Mobile)
    const existingUser = await User.findOne({ mobile });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this mobile number",
      });
    }

    // 🔢 3. Generate SR Number
    const srNo = await generateSR();

    // 💾 4. Create User
    const newUser = new User({
      srNo,
      name,
      mobile,
      keva,
      gotra,
      address,
      city,
      whatsapp,
      mataji,
      profession,
      index,
    });

    // 💾 5. Save to DB
    await newUser.save();

    // ✅ 6. Success Response
    return res.status(201).json({
      message: "User created successfully",
      srNo,
      data: newUser,
    });

  } catch (error: any) {
    console.error("Create User Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};