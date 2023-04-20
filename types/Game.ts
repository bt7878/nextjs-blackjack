import { Int32 } from "mongodb";

export type Game = {
  win: boolean;
  playerHandTotal: number;
  dealerHandTotal: number;
};

export type GameRecord = {
  ip: string;
  win: boolean;
  playerHandTotal: Int32;
  dealerHandTotal: Int32;
};
