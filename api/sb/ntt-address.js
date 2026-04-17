import { buildReqBbapiBase, getAgency, proxyToSoftbankJson } from "./_agency.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const {
      individualCode,
      buildingKind,
      orderZip,
      inUseServiceType,
      orderAddress1,
      orderAddress2,
      orderAddress3,
      orderAddress4,
      orderAddress10,
      addressCode,
      addressKbn
    } = req.body || {};

    if (!individualCode || !buildingKind || !orderZip || !inUseServiceType) {
      res.status(400).json({ error: "individualCode, buildingKind, orderZip, inUseServiceType are required" });
      return;
    }

    const ag = await getAgency(individualCode);
    const payload = {
      ReqBbapiBase: buildReqBbapiBase(ag),
      buildingKind: String(buildingKind),
      orderZip: String(orderZip),
      inUseServiceType: String(inUseServiceType),
      orderAddress1: orderAddress1 ?? "",
      orderAddress2: orderAddress2 ?? "",
      orderAddress3: orderAddress3 ?? "",
      orderAddress4: orderAddress4 ?? "",
      orderAddress10: orderAddress10 ?? "",
      addressCode: addressCode ?? undefined,
      addressKbn: addressKbn ?? undefined
    };

    const { status, data } = await proxyToSoftbankJson("/bff/nttAddressSearch", payload);
    res.status(status).json(data);
  } catch (error) {
    res.status(500).json({ error: "ntt-address proxy failed", detail: String(error?.message || error) });
  }
}
