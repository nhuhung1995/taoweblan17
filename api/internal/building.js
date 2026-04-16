import { BUILDINGS_BY_LOCATION, SNAPSHOT_VERSION } from "./_data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const addressCode = String(req.query?.addressCode || "");
  const banchi = String(req.query?.banchi || "");
  const go = String(req.query?.go || "");

  if (!addressCode || !banchi || !go) {
    res.status(400).json({ code: "E00001", message: "addressCode, banchi, go are required" });
    return;
  }

  const key = `${addressCode}|${banchi}|${go}`;
  const buildingList = BUILDINGS_BY_LOCATION[key] || [];

  res.status(200).json({
    addressCode,
    banchi,
    go,
    buildingList,
    snapshotVersion: SNAPSHOT_VERSION
  });
}
