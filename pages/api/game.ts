import { GameRecord, gameSchema } from "@/types/Game";
import { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "@/lib/mongodb";
import requestIp from "request-ip";

if (process.env.DB_NAME === undefined) {
  throw new Error('Invalid/Missing environment variable: "DB_NAME"');
}
const DB_NAME = process.env.DB_NAME;
if (process.env.GAMES_COLLECTION_NAME === undefined) {
  throw new Error(
    'Invalid/Missing environment variable: "GAMES_COLLECTION_NAME"'
  );
}
const GAMES_COLLECTION_NAME = process.env.GAMES_COLLECTION_NAME;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const ip = requestIp.getClientIp(req);
    const body = gameSchema.safeParse(req.body);
    if (!body.success || ip === null) {
      return res.status(400);
    }

    const dbClient = await clientPromise;
    const db = dbClient.db(DB_NAME);
    const games = db.collection<GameRecord>(GAMES_COLLECTION_NAME);

    const added = await games.insertOne({
      ip: ip,
      win: body.data.win,
      playerHandTotal: body.data.playerHandTotal,
      dealerHandTotal: body.data.dealerHandTotal,
    });

    return res.status(201).json({ id: added.insertedId.toString() });
  } else {
    return res.status(400);
  }
}
