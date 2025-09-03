import type { Player } from "../App";

interface Props {
  players: Player[];
}

export default function FinalScoreboard({ players }: Props) {
  const totals = players.map((p) => p.scores.reduce((a, b) => a + b, 0));
  const maxScore = totals.length > 0 ? Math.max(...totals) : 0;
  const winner = players.find((_, i) => totals[i] === maxScore);

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-center mb-4">Final Results</h2>

      {/* Winner announcement */}
      <div className="text-center mb-6 p-4 bg-yellow-100 rounded-lg">
        <div className="text-xl font-bold text-yellow-800">
          🎉 {winner?.name || `Player ${winner?.id ?? 0 + 1}`} Wins! 🎉
        </div>
        <div className="text-lg text-yellow-700">
          Final Score: {maxScore} points
        </div>
      </div>

      {/* Full scoring table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-sm bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left sticky left-0 bg-gray-100">
                Player
              </th>
              {players[0]?.scores?.map((_, i) => (
                <th key={i} className="border border-gray-300 p-2 min-w-[60px]">
                  R{i + 1}
                </th>
              ))}
              <th className="border border-gray-300 p-2 bg-yellow-50 font-bold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, playerIndex) => {
              const total = totals[playerIndex];
              const isWinner = total === maxScore;
              return (
                <tr key={p.id} className={isWinner ? "bg-yellow-50" : ""}>
                  <td
                    className={`border border-gray-300 p-2 font-medium sticky left-0 ${isWinner ? "bg-yellow-50" : "bg-white"}`}
                  >
                    {p.name || `Player ${p.id + 1}`}
                    {isWinner && " 👑"}
                  </td>
                  {p.scores.map((s, i) => (
                    <td
                      key={i}
                      className="border border-gray-300 p-2 text-center"
                    >
                      {s}
                    </td>
                  ))}
                  <td
                    className={`border border-gray-300 p-2 font-bold text-center ${isWinner ? "bg-yellow-100" : ""}`}
                  >
                    {total}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Play again button */}
      <div className="text-center mt-6">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
