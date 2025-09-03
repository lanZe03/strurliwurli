import type { Player } from "../App";

interface Props {
  players: Player[];
}

export default function Scoreboard({ players }: Props) {
  // Create a sorted copy of players
  const sortedPlayers = [...players].sort((a, b) => {
    const totalA = a.scores.reduce((acc, val) => acc + val, 0);
    const totalB = b.scores.reduce((acc, val) => acc + val, 0);
    return totalB - totalA; // descending order
  });

  return (
    <div className="w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-center mb-3">Zwischenstand</h3>
      <div className="grid gap-2">
        {sortedPlayers.map((p, index) => {
          const total = p.scores.reduce((a, b) => a + b, 0);
          return (
            <div
              key={p.id}
              className="flex justify-between items-center p-3 border rounded-lg bg-white"
            >
              <span className="font-medium">
                #{index + 1} {p.name || `Player ${p.id + 1}`}
              </span>
              <span className="font-bold text-lg">{total}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
