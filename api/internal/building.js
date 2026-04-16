import { BUILDINGS_BY_LOCATION, SNAPSHOT_VERSION } from "./_data.js";

function normalizeWideDigits(input) {
  return String(input || "")
    .replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 65248))
    .trim();
}

function buildFallbackBuildings(addressCode, banchi, go) {
  const bn = normalizeWideDigits(banchi) || "0";
  const gv = normalizeWideDigits(go) || "0";
  return [
    {
      buldngId: `BLDG-${addressCode}-${bn}-${gv}-A`,
      buldngNm: `並木 ${bn}-${gv} レジデンス`,
      buldngKana: `ナミキ ${bn}-${gv} レジデンス`,
      synthetic: true
    },
    {
      buldngId: `BLDG-${addressCode}-${bn}-${gv}-B`,
      buldngNm: `グラン ${bn}-${gv}`,
      buldngKana: `グラン ${bn}-${gv}`,
      synthetic: true
    }
  ];
}

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

  const keyRaw = `${addressCode}|${banchi}|${go}`;
  const keyNormalized = `${addressCode}|${normalizeWideDigits(banchi)}|${normalizeWideDigits(go)}`;
  const preset = BUILDINGS_BY_LOCATION[keyRaw] || BUILDINGS_BY_LOCATION[keyNormalized] || [];
  let buildingList = preset;
  let source = "preset";
  if (!buildingList.length) {
    buildingList = buildFallbackBuildings(addressCode, banchi, go);
    source = "synthetic";
  }

  res.status(200).json({
    addressCode,
    banchi,
    go,
    buildingList,
    source,
    snapshotVersion: SNAPSHOT_VERSION
  });
}
