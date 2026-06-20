import { Request, Response } from "express";
import DikiriUser from "../models/dikiriUser.model";
import { appendDikiriToSheet } from "../utils/dikiriSheetService";

export const createDikri = async (req: Request, res: Response) => {
  try {
    const count = await DikiriUser.countDocuments();
    const srNo = String(count + 1).padStart(4, "0");

    const user = new DikiriUser({ ...req.body, srNo });
    await user.save();

    let sheetSynced = true;
    try {
      await appendDikiriToSheet(user);
    } catch (err) {
      console.error("[Dikri] Sheet sync failed:", err);
      sheetSynced = false;
    }

    return res.status(201).json({ srNo, sheetSynced });
  } catch (err: any) {
    console.error("[Dikri] createDikri error:", err);
    return res.status(500).json({ message: err.message });
  }
};
