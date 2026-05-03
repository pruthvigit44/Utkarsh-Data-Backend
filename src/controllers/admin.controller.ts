import { Request, Response } from "express";
import User from "../models/user.model";
import { syncMissingToSheet, forceResyncAll } from "../utils/sheetService";

export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const [
      totalFamilies,
      outOfCountryFamilies,
      peopleAgg,
      bloodGroupAgg,
      familyBloodGroupAgg,
      gotraAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isOutOfCountry: true }),

      User.aggregate([
        { $project: { count: { $add: [1, { $size: "$familyMembers" }] } } },
        { $group: { _id: null, total: { $sum: "$count" } } },
      ]),

      // Blood groups of heads
      User.aggregate([
        { $match: { bloodGroup: { $ne: "" } } },
        { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
      ]),

      // Blood groups of family members
      User.aggregate([
        { $unwind: "$familyMembers" },
        { $match: { "familyMembers.bloodGroup": { $ne: "" } } },
        { $group: { _id: "$familyMembers.bloodGroup", count: { $sum: 1 } } },
      ]),

      User.aggregate([
        { $match: { gotra: { $ne: "" } } },
        { $group: { _id: "$gotra", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const totalPeople = peopleAgg[0]?.total ?? 0;

    // Merge head + family member blood groups
    const bloodGroupMap: Record<string, number> = {};
    for (const { _id, count } of [...bloodGroupAgg, ...familyBloodGroupAgg]) {
      if (_id) bloodGroupMap[_id] = (bloodGroupMap[_id] ?? 0) + count;
    }

    return res.status(200).json({
      totalFamilies,
      totalPeople,
      outOfCountryFamilies,
      bloodGroupDistribution: bloodGroupMap,
      gotraDistribution: Object.fromEntries(gotraAgg.map((g: any) => [g._id, g.count])),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getRecentEntries = async (_req: Request, res: Response) => {
  try {
    const fields = "srNo name mobile createdAt updatedAt familyMembers";

    const [recentlySubmitted, recentlyUpdated] = await Promise.all([
      User.find().select(fields).sort({ createdAt: -1 }).limit(10).lean(),
      User.find({ $expr: { $ne: ["$createdAt", "$updatedAt"] } })
        .select(fields)
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const shape = (users: any[]) =>
      users.map((u) => ({
        srNo: u.srNo,
        name: u.name,
        mobile: u.mobile,
        familyCount: u.familyMembers?.length ?? 0,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      }));

    return res.status(200).json({
      recentlySubmitted: shape(recentlySubmitted),
      recentlyUpdated: shape(recentlyUpdated),
    });
  } catch (error) {
    console.error("Admin recent error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const syncSheets = async (_req: Request, res: Response) => {
  try {
    const result = await syncMissingToSheet();
    return res.status(200).json({
      message: `Sync complete. Synced: ${result.synced}, Errors: ${result.errors}`,
      ...result,
    });
  } catch (error) {
    console.error("Sync sheets error:", error);
    return res.status(500).json({ message: "Sync failed" });
  }
};

export const forceResyncSheets = async (_req: Request, res: Response) => {
  // Respond immediately — resync runs in background to avoid HTTP timeout
  res.status(202).json({ message: "Force resync started. Check server logs for progress." });
  forceResyncAll().then(result => {
    console.log(`[ForceResync] Done — synced: ${result.synced}, errors: ${result.errors}`);
  }).catch(err => {
    console.error("[ForceResync] Fatal error:", err);
  });
};
