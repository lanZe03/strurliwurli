// types.ts
export interface Player {
  id: number;
  name: string;
  scores: number[]; // one entry per round
}

export interface Round {
  dealerIndex: number;
  cards: number; // current hand size
  bids: number[]; // one per player
  tricks: number[]; // one per player
}

export interface GameState {
  players: Player[];
  rounds: Round[];
  dealerIndex: number;
  currentCards: number;
}
