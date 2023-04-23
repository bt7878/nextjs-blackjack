import { z } from "zod";

export const gameSchema = z.object({
  win: z.boolean(),
  playerHandTotal: z.number().int(),
  dealerHandTotal: z.number().int(),
});

export type Game = z.infer<typeof gameSchema>;

export interface GameRecord extends Game {
  ip: string;
}
