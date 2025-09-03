import { useState } from "react";
import PlayerSetup from "./components/PlayerSetup";
import BettingPhase from "./components/BettingPhase";
import ResultsPhase from "./components/ResultsPhase";
import Scoreboard from "./components/Scoreboard";
import FinalScoreboard from "./components/FinalScoreboard";

export interface Player {
  id: number;
  name: string;
  scores: number[];
  roundsWithoutZero: number[]; // Track rounds without 0 points per dealer cycle
}

type Phase = "setup" | "betting" | "results" | "finished";

interface BonusAlert {
  playerName: string;
  message: string;
  points: number;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [phase, setPhase] = useState<Phase>("setup");
  const [bets, setBets] = useState<number[]>([]);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [cards, setCards] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState<number>(0);
  const [bonusAlerts, setBonusAlerts] = useState<BonusAlert[]>([]);
  const [currentDealerCycle, setCurrentDealerCycle] = useState(0);

  const startGame = (count: number) => {
    let initialCards = 0;
    let totalRounds = 0;

    if (count === 4) {
      initialCards = 8;
      totalRounds = 32;
    } else if (count === 5) {
      initialCards = 7;
      totalRounds = 35;
    } else if (count === 6) {
      initialCards = 6;
      totalRounds = 36;
    } else {
      throw new Error("Only 4, 5, or 6 players are supported.");
    }

    const newPlayers: Player[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      name: "",
      scores: [],
      roundsWithoutZero: [],
    }));

    setPlayers(newPlayers);
    setPhase("setup");
    setCards(initialCards);
    setDealerIndex(0);
    setRound(1);
    setMaxRounds(totalRounds);
    setBonusAlerts([]);
    setCurrentDealerCycle(0);
  };

  const confirmNames = () => {
    setPhase("betting");
    setBets(Array(players.length).fill(0));
    setResults(Array(players.length).fill(false)); // Default to X selected
  };

  const confirmResults = () => {
    const newPlayers = [...players];
    const newBonusAlerts: BonusAlert[] = [];

    newPlayers.forEach((p, i) => {
      let points = 0;
      const playerName = p.name || `Player ${i + 1}`;

      if (results[i]) {
        // Basic points for correct bet
        points = bets[i] + 10;

        // Track rounds without zero
        if (!p.roundsWithoutZero[currentDealerCycle]) {
          p.roundsWithoutZero[currentDealerCycle] = 0;
        }
        p.roundsWithoutZero[currentDealerCycle]++;

        // Bonus for betting all cards correctly
        if (bets[i] === cards) {
          const bonus = (cards ?? 0) + bets[i] + 10;
          points = bonus;
          newBonusAlerts.push({
            playerName,
            message: `All-in bet bonus!`,
            points: bonus,
          });
        }
      } else {
        // Make sure the tracker array exists
        if (!p.roundsWithoutZero[currentDealerCycle]) {
          p.roundsWithoutZero[currentDealerCycle] = 0;
        }
      }

      // Add points to player
      p.scores = [...p.scores, points];
    });

    let nextCards = (cards ?? 1) - 1;
    let nextDealer = dealerIndex;
    let nextDealerCycle = currentDealerCycle;

    // Check if dealer cycle is ending (going to 0 cards)
    const dealerCycleEnding = nextCards === 0;

    if (dealerCycleEnding) {
      // Check "perfect dealer cycle" bonus
      const roundsInThisCycle = getAmountOfCards();

      newPlayers.forEach((p, i) => {
        const playerName = p.name || `Player ${i + 1}`;
        const roundsWithoutZero = p.roundsWithoutZero[currentDealerCycle] || 0;

        if (roundsWithoutZero === roundsInThisCycle) {
          const bonus = i === dealerIndex ? 20 : 10; // Dealer gets +20
          p.scores[p.scores.length - 1] += bonus;

          newBonusAlerts.push({
            playerName,
            message:
              i === dealerIndex
                ? `Perfekte Runde als Geber!`
                : `Perfekte Runde!`,
            points: bonus,
          });
        }
      });

      // Move to next dealer
      nextDealer = (dealerIndex + 1) % players.length;
      nextDealerCycle++;

      // Reset cards for new dealer cycle
      if (players.length === 4) nextCards = 8;
      if (players.length === 5) nextCards = 7;
      if (players.length === 6) nextCards = 6;
    }

    const nextRound = round + 1;
    if (nextRound > maxRounds) {
      setPhase("finished");
      setPlayers(newPlayers);
      setBonusAlerts(newBonusAlerts);
    } else {
      setPlayers(newPlayers);
      setPhase("betting");
      setBets(Array(players.length).fill(0));
      setResults(Array(players.length).fill(false)); // Default to X selected
      setDealerIndex(nextDealer);
      setCards(nextCards);
      setRound(nextRound);
      setBonusAlerts(newBonusAlerts);
      setCurrentDealerCycle(nextDealerCycle);
    }
  };

  const getAmountOfCards = () => {
    if (players.length === 4) return 8;
    if (players.length === 5) return 7;
    if (players.length === 6) return 6;
  };

  const dismissAlert = (index: number) => {
    setBonusAlerts((alerts) => alerts.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Strurliwurli Zähler <br />
        <span className="text-sm font-normal">by Stefan</span>
      </h1>

      {/* Bonus Alerts */}
      {bonusAlerts.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {bonusAlerts.map((alert, i) => (
            <div
              key={i}
              className="bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">{alert.playerName}</div>
                  <div className="text-sm">{alert.message}</div>
                  <div className="text-lg font-bold">
                    +{alert.points} Punkte!
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(i)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!players.length ? (
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-center mb-2">
            Wähle die Anzahl der Spieler:
          </h2>
          {[4, 5, 6].map((n) => (
            <button
              key={n}
              onClick={() => startGame(n)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow"
            >
              {n} Spieler
            </button>
          ))}
        </div>
      ) : phase === "setup" ? (
        <PlayerSetup
          players={players}
          setPlayers={setPlayers}
          confirmNames={confirmNames}
        />
      ) : phase === "betting" ? (
        <BettingPhase
          players={players}
          bets={bets}
          setBets={setBets}
          dealerIndex={dealerIndex}
          cards={cards}
          round={round}
          maxRounds={maxRounds}
          setPhase={setPhase}
        />
      ) : phase === "results" ? (
        <ResultsPhase
          players={players}
          bets={bets}
          results={results}
          setResults={setResults}
          confirmResults={confirmResults}
          dealerIndex={dealerIndex}
          round={round}
          maxRounds={maxRounds}
          cards={cards}
        />
      ) : (
        <FinalScoreboard players={players} />
      )}

      {players.length > 0 && phase !== "setup" && phase !== "finished" && (
        <div className="mt-6 w-full max-w-2xl">
          <Scoreboard players={players} />
        </div>
      )}
    </div>
  );
}

export default App;
