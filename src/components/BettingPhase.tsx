import type { Player } from "../App";

interface Props {
  players: Player[];
  bets: number[];
  setBets: (b: number[]) => void;
  dealerIndex: number;
  cards: number | null;
  round: number;
  maxRounds: number;
  setPhase: (p: "betting" | "results") => void;
}

export default function BettingPhase({
  players,
  bets,
  setBets,
  dealerIndex,
  cards,
  round,
  maxRounds,
  setPhase,
}: Props) {
  const totalBets = bets.reduce((a, b) => a + b, 0);
  const dealerInvalid = totalBets === cards;

  const handleBetChange = (i: number, value: number) => {
    if (cards === null) return;
    const newValue = Math.max(0, Math.min(cards, value)); // clamp between 0 and cards
    const newBets = [...bets];
    newBets[i] = newValue;
    setBets(newBets);
  };

  const orderedPlayers = [
    ...players.filter((_, i) => i !== dealerIndex),
    players[dealerIndex],
  ];

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Round {round}/{maxRounds} – {cards} cards
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-600">Total Bets</div>
          <div className="text-lg font-bold">
            {totalBets}/{cards}
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {orderedPlayers.map((p) => {
          const realIndex = p.id;
          const isDealer = realIndex === dealerIndex;
          return (
            <div
              key={p.id}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                isDealer && dealerInvalid
                  ? "bg-red-200 border-red-400"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span className="font-medium">
                {p.name || `Player ${p.id + 1}`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleBetChange(realIndex, bets[realIndex] - 1)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-lg text-lg font-bold active:scale-95"
                >
                  –
                </button>
                <span className="w-12 text-center font-semibold text-lg">
                  {bets[realIndex]}
                </span>
                <button
                  onClick={() =>
                    handleBetChange(realIndex, bets[realIndex] + 1)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-lg text-lg font-bold active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        disabled={dealerInvalid}
        onClick={() => setPhase("results")}
        className={`mt-6 w-full px-6 py-3 rounded-xl shadow ${
          dealerInvalid
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white"
        }`}
      >
        Place Bets
      </button>
    </div>
  );
}
