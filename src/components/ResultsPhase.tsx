import type { Player } from "../App";

interface Props {
  players: Player[];
  bets: number[];
  results: (boolean | null)[];
  setResults: (r: (boolean | null)[]) => void;
  confirmResults: () => void;
  dealerIndex: number;
  round: number;
  maxRounds: number;
  cards: number | null;
}

export default function ResultsPhase({
  players,
  bets,
  results,
  setResults,
  confirmResults,
  dealerIndex,
  round,
  maxRounds,
  cards,
}: Props) {
  const setPlayerResult = (i: number, value: boolean) => {
    const newResults = [...results];
    newResults[i] = value;
    setResults(newResults);
  };

  const allResultsSelected = results.every((result) => result !== null);

  const orderedPlayers = [
    ...players.filter((_, i) => i !== dealerIndex),
    players[dealerIndex],
  ];

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-lg font-semibold text-center mb-4">
        Round {round}/{maxRounds} – {cards} cards
      </h2>
      <div className="grid gap-3">
        {orderedPlayers.map((p) => {
          const realIndex = p.id;
          const isDealer = realIndex === dealerIndex;
          return (
            <div
              key={p.id}
              className={`flex justify-between items-center p-3 rounded-lg border ${isDealer ? "border-blue-500" : "border-gray-300"
                }`}
            >
              <span className="font-medium">
                {p.name || `Player ${p.id + 1}`} – Angesagte Stiche: {bets[realIndex]}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlayerResult(realIndex, true)}
                  className={`px-4 py-2 rounded-lg text-lg font-bold active:scale-95 ${results[realIndex] === true
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                    }`}
                >
                  ✓
                </button>
                <button
                  onClick={() => setPlayerResult(realIndex, false)}
                  className={`px-4 py-2 rounded-lg text-lg font-bold active:scale-95 ${results[realIndex] === false
                    ? "bg-red-500 text-white"
                    : "bg-gray-200"
                    }`}
                >
                  ✗
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={confirmResults}
        disabled={!allResultsSelected}
        className={`mt-6 w-full px-6 py-3 rounded-xl shadow ${allResultsSelected
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-400 text-white cursor-not-allowed"
          }`}
      >
        Nächste Runde
      </button>
    </div>
  );
}
