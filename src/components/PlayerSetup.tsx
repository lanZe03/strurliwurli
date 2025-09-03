import type { Player } from "../App";

interface Props {
  players: Player[];
  setPlayers: (p: Player[]) => void;
  confirmNames: () => void;
}

export default function PlayerSetup({
  players,
  setPlayers,
  confirmNames,
}: Props) {
  return (
    <div className="w-full max-w-md">
      <h2 className="font-semibold mb-2 text-center">Spielernamen eingeben</h2>
      {players.map((p, i) => (
        <input
          key={p.id}
          type="text"
          value={p.name}
          placeholder={`Player ${i + 1}`}
          onChange={(e) => {
            const newPlayers = [...players];
            newPlayers[i].name = e.target.value;
            setPlayers(newPlayers);
          }}
          className="w-full p-2 mb-2 border rounded-lg"
        />
      ))}
      <button
        onClick={confirmNames}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-xl shadow"
      >
        Spiel beginnen!
      </button>
    </div>
  );
}
